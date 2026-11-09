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
      authorizationId,
      dealId,
      proposalVersion,
    } = await request.json();

    if (
      !authorizationId ||
      typeof authorizationId !== "string"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing authorizationId.",
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
     * Never trust a settlement amount supplied by the browser.
     * Read the authoritative negotiated + approved amount directly
     * from DealDone's database.
     */
    const { data: settlement, error: lookupError } =
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

    if (lookupError || !settlement) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Approved settlement could not be found.",
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
            "Both parties must approve the settlement before PayPal capture.",
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

    /*
     * Atomically reserve this approved settlement for execution.
     *
     * Only one request is allowed to move an "approved"
     * settlement into "executing".
     */
    const now = new Date().toISOString();

    const {
      data: executionLock,
      error: executionLockError,
    } = await supabaseServer
      .from("deal_settlements")
      .update({
        status: "executing",
        paypal_authorization_id: authorizationId,
        updated_at: now,
      })
      .eq("deal_id", dealId)
      .eq("proposal_version", proposalVersion)
      .eq("status", "approved")
      .select("id")
      .maybeSingle();

    if (
      executionLockError ||
      !executionLock
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Settlement is already being executed or is no longer eligible for capture.",
        },
        { status: 409 }
      );
    }

    const accessToken =
      await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/payments/authorizations/${authorizationId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          "PayPal-Request-Id":
            getPayPalRequestId(
              "capture-authorization",
              `${authorizationId}:${dealId}:${proposalVersion}`
            ),
        },
        body: JSON.stringify({
          amount: {
            currency_code: "USD",
            value: settlementAmount.toFixed(2),
          },
          final_capture: false,
          note_to_payer:
            `DealDone settlement for ${dealId}`,
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      /*
       * Restore eligibility for an idempotent retry.
       * PayPal-Request-Id prevents an accidental duplicate
       * capture if the external request actually succeeded.
       */
      await supabaseServer
        .from("deal_settlements")
        .update({
          status: "approved",
          updated_at: new Date().toISOString(),
        })
        .eq("deal_id", dealId)
        .eq("proposal_version", proposalVersion)
        .eq("status", "executing");

      console.error(
        "PayPal capture authorization error:",
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

    const { error: saveError } =
      await supabaseServer
        .from("deal_settlements")
        .update({
          paypal_capture_id: data.id,
          updated_at: new Date().toISOString(),
        })
        .eq("deal_id", dealId)
        .eq(
          "proposal_version",
          proposalVersion
        );

    if (saveError) {
      console.error(
        "PayPal capture succeeded but DealDone could not persist the capture ID:",
        saveError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Payment captured, but settlement state could not be updated.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      captureId: data.id,
      status: data.status,
      amount: data.amount,
      finalCapture: data.final_capture,
      settlementAmount,
      proposalVersion,
    });
  } catch (error) {
    console.error(
      "Capture PayPal authorization failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to capture PayPal authorization.",
      },
      { status: 500 }
    );
  }
}