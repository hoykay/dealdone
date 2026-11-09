import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import {
  getPayPalAccessToken,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const { dealId, proposalVersion } =
      await request.json();

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
     * STEP 1
     * Read DealDone's server-side transaction record.
     */
    const { data: settlement, error: lookupError } =
      await supabaseServer
        .from("deal_settlements")
        .select(
          `
            settlement_amount,
            status,
            paypal_order_id,
            paypal_authorization_id,
            paypal_capture_id,
            completed_at
          `
        )
        .eq("deal_id", dealId)
        .eq("proposal_version", proposalVersion)
        .single();

    if (lookupError || !settlement) {
      return NextResponse.json(
        {
          success: false,
          message: "Settlement not found.",
        },
        { status: 404 }
      );
    }

    /*
     * Idempotent completion:
     * if DealDone already completed this exact settlement,
     * return the stored result instead of doing it twice.
     */
    if (settlement.status === "completed") {
      return NextResponse.json({
        success: true,
        alreadyCompleted: true,
        completedAt: settlement.completed_at,
        orderId: settlement.paypal_order_id,
        authorizationId:
          settlement.paypal_authorization_id,
        captureId: settlement.paypal_capture_id,
      });
    }

    if (settlement.status !== "executing") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Settlement is not currently executing.",
        },
        { status: 409 }
      );
    }

    const authorizationId =
      settlement.paypal_authorization_id;

    const captureId =
      settlement.paypal_capture_id;

    const orderId =
      settlement.paypal_order_id;

    if (
      !authorizationId ||
      !captureId ||
      !orderId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal transaction identifiers are incomplete.",
        },
        { status: 409 }
      );
    }

    /*
     * STEP 2
     * Independently verify PayPal.
     */
    const accessToken =
      await getPayPalAccessToken();

    const [
      authorizationResponse,
      captureResponse,
    ] = await Promise.all([
      fetch(
        `${PAYPAL_BASE_URL}/v2/payments/authorizations/${authorizationId}`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        }
      ),

      fetch(
        `${PAYPAL_BASE_URL}/v2/payments/captures/${captureId}`,
        {
          headers: {
            Authorization:
              `Bearer ${accessToken}`,
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
        }
      ),
    ]);

    const authorizationData =
      await authorizationResponse.json();

    const captureData =
      await captureResponse.json();

    if (!authorizationResponse.ok) {
      console.error(
        "PayPal authorization verification failed:",
        authorizationData
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Could not verify PayPal authorization.",
        },
        { status: 502 }
      );
    }

    if (!captureResponse.ok) {
      console.error(
        "PayPal capture verification failed:",
        captureData
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Could not verify PayPal capture.",
        },
        { status: 502 }
      );
    }

    /*
     * STEP 3
     * Require the expected final PayPal states.
     */
    if (authorizationData.status !== "VOIDED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "Remaining PayPal authorization has not been fully released.",
          paypalStatus:
            authorizationData.status,
        },
        { status: 409 }
      );
    }

    if (captureData.status !== "COMPLETED") {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal capture has not completed.",
          paypalStatus: captureData.status,
        },
        { status: 409 }
      );
    }

    /*
     * STEP 4
     * Verify PayPal captured exactly the amount
     * DealDone approved server-side.
     */
    const approvedAmount = Number(
      settlement.settlement_amount
    );

    const capturedAmount = Number(
      captureData?.amount?.value
    );

    if (
      !Number.isFinite(capturedAmount) ||
      captureData?.amount?.currency_code !==
        "USD" ||
      capturedAmount !== approvedAmount
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal captured amount does not match the approved DealDone settlement.",
        },
        { status: 409 }
      );
    }

    /*
     * STEP 5
     * Finalize DealDone's durable transaction record.
     */
    const completedAt =
      new Date().toISOString();

    const {
      data: completedSettlement,
      error: updateError,
    } = await supabaseServer
      .from("deal_settlements")
      .update({
        status: "completed",
        completed_at: completedAt,
        updated_at: completedAt,
      })
      .eq("deal_id", dealId)
      .eq(
        "proposal_version",
        proposalVersion
      )
      .eq("status", "executing")
      .select(
        `
          paypal_order_id,
          paypal_authorization_id,
          paypal_capture_id,
          completed_at
        `
      )
      .single();

    if (updateError || !completedSettlement) {
      throw new Error(
        updateError?.message ??
          "Could not finalize DealDone settlement."
      );
    }

    return NextResponse.json({
      success: true,
      completed: true,
      completedAt:
        completedSettlement.completed_at,
      orderId:
        completedSettlement.paypal_order_id,
      authorizationId:
        completedSettlement.paypal_authorization_id,
      captureId:
        completedSettlement.paypal_capture_id,
    });
  } catch (error) {
    console.error(
      "DealDone completion verification failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Could not complete settlement.",
      },
      { status: 500 }
    );
  }
}