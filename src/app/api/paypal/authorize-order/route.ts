import { NextRequest, NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalRequestId,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const {
      orderId,
      dealId,
      proposalVersion,
    } = await request.json();

    if (!orderId || !dealId || !proposalVersion) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing orderId, dealId, or proposalVersion.",
        },
        { status: 400 }
      );
    }

    /*
     * The browser is not trusted to choose which
     * PayPal order DealDone authorizes.
     *
     * The order must already belong to the exact
     * approved settlement stored by the server.
     */
    const {
      data: settlement,
      error: settlementError,
    } = await supabaseServer
      .from("deal_settlements")
      .select(
        `
          deal_id,
          proposal_version,
          original_amount,
          status,
          buyer_approved_at,
          supplier_approved_at,
          paypal_order_id
        `
      )
      .eq("deal_id", dealId)
      .eq("proposal_version", proposalVersion)
      .maybeSingle();

    if (settlementError) {
      console.error(
        "Could not load settlement before PayPal authorization:",
        settlementError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Could not verify the settlement.",
        },
        { status: 500 }
      );
    }

    if (!settlement) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Settlement proposal not found.",
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
            "Settlement is not approved for PayPal execution.",
        },
        { status: 409 }
      );
    }

    if (
      !settlement.paypal_order_id ||
      settlement.paypal_order_id !== orderId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal order does not belong to this settlement.",
        },
        { status: 403 }
      );
    }

    const accessToken =
      await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/authorize`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
          Prefer:
            "return=representation",
          "PayPal-Request-Id":
            getPayPalRequestId(
              "authorize-order",
              `${dealId}:${proposalVersion}:${orderId}`
            ),
        },
        body: JSON.stringify({}),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error(
        "PayPal authorize order error:",
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

    const authorization =
      data.purchase_units?.[0]?.payments
        ?.authorizations?.[0];

    if (!authorization?.id) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal did not return an authorization ID.",
        },
        { status: 502 }
      );
    }

    const authorizedAmount =
      Number(authorization.amount?.value);

    const expectedAmount =
      Number(settlement.original_amount);

    if (
      authorization.amount?.currency_code !==
        "USD" ||
      !Number.isFinite(authorizedAmount) ||
      authorizedAmount !== expectedAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal authorization amount does not match the DealDone settlement.",
        },
        { status: 409 }
      );
    }

    const {
      error: persistError,
    } = await supabaseServer
      .from("deal_settlements")
      .update({
        paypal_authorization_id:
          authorization.id,
        updated_at:
          new Date().toISOString(),
      })
      .eq("deal_id", dealId)
      .eq(
        "proposal_version",
        proposalVersion
      )
      .eq("paypal_order_id", orderId);

    if (persistError) {
      console.error(
        "Could not persist PayPal authorization:",
        persistError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal authorization succeeded, but DealDone could not persist the authorization record.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: data.id,
      orderStatus: data.status,
      authorizationId:
        authorization.id,
      authorizationStatus:
        authorization.status,
      amount:
        authorization.amount,
      proposalVersion,
    });
  } catch (error) {
    console.error(
      "Authorize PayPal order failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to authorize PayPal order.",
      },
      { status: 500 }
    );
  }
}