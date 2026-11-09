import { NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalRequestId,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const {
      executionId,
      dealId,
      proposalVersion,
    } = await request.json();

    if (
      !executionId ||
      typeof executionId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing settlement execution ID.",
        },
        { status: 400 }
      );
    }

    if (
      !dealId ||
      typeof dealId !== "string" ||
      !proposalVersion ||
      typeof proposalVersion !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing dealId or proposalVersion.",
        },
        { status: 400 }
      );
    }

    /*
     * SECURITY GATE
     *
     * A PayPal order may only be created for an
     * exact DealDone proposal that has received
     * both human approvals.
     */
    const { data: settlement, error: settlementError } =
      await supabaseServer
        .from("deal_settlements")
        .select(
          `
            settlement_amount,
            buyer_approved_at,
            supplier_approved_at,
            status
          `
        )
        .eq("deal_id", dealId)
        .eq("proposal_version", proposalVersion)
        .single();

    if (settlementError || !settlement) {
      return NextResponse.json(
        {
          success: false,
          message: "Settlement proposal not found.",
        },
        { status: 404 }
      );
    }

    if (
      !settlement.buyer_approved_at ||
      !settlement.supplier_approved_at ||
      settlement.status !== "approved"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Both parties must approve the settlement before PayPal execution.",
        },
        { status: 409 }
      );
    }

    const settlementAmount = Number(
      settlement.settlement_amount
    );

    if (
      !Number.isFinite(settlementAmount) ||
      settlementAmount <= 0 ||
      settlementAmount > 18000
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Stored settlement amount is invalid.",
        },
        { status: 500 }
      );
    }

    const appBaseUrl = (
      process.env.APP_BASE_URL ??
      new URL(request.url).origin
    ).replace(/\/$/, "");

    const accessToken =
      await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          "PayPal-Request-Id":
            getPayPalRequestId(
              "create-order",
              executionId
            ),
        },
        body: JSON.stringify({
          intent: "AUTHORIZE",

          purchase_units: [
            {
              reference_id: dealId,
              description:
                "DealDone · Nova Packaging · PO-77821",

              /*
               * Authorize the original disputed
               * payment amount.
               *
               * DealDone later captures only the
               * server-approved settlement amount.
               */
              amount: {
                currency_code: "USD",
                value: "18000.00",
              },

              custom_id: `${dealId}:${proposalVersion}`,
            },
          ],

          application_context: {
            brand_name: "DealDone",
            user_action: "PAY_NOW",
            shipping_preference: "NO_SHIPPING",

            return_url:
              `${appBaseUrl}/deals/dd-1048/settlement?paypal=approved`,

            cancel_url:
              `${appBaseUrl}/deals/dd-1048/settlement?paypal=cancelled`,
          },
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "PayPal create order error:",
        data
      );

      return NextResponse.json(
        {
          success: false,
          error: data,
        },
        { status: response.status }
      );
    }

    const approvalUrl =
      data.links?.find(
        (link: {
          rel: string;
          href: string;
        }) => link.rel === "approve"
      )?.href;

    if (!approvalUrl) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal did not return an approval URL.",
        },
        { status: 502 }
      );
    }

    /*
     * Persist the real PayPal order identifier
     * against the approved DealDone settlement.
     */
    const { error: saveError } =
      await supabaseServer
        .from("deal_settlements")
        .update({
          paypal_order_id: data.id,
          updated_at:
            new Date().toISOString(),
        })
        .eq("deal_id", dealId)
        .eq(
          "proposal_version",
          proposalVersion
        );

    if (saveError) {
      console.error(
        "Could not save PayPal order ID:",
        saveError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal order created but DealDone could not persist the order ID.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      status: data.status,
      approvalUrl,
      proposalVersion,
      settlementAmount,
    });
  } catch (error) {
    console.error(
      "Create PayPal order failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to create PayPal order.",
      },
      { status: 500 }
    );
  }
}