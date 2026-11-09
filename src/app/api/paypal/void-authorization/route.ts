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
      !dealId ||
      !proposalVersion
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Missing authorizationId, dealId, or proposalVersion.",
        },
        { status: 400 }
      );
    }

    const {
      data: settlement,
      error: settlementError,
    } = await supabaseServer
      .from("deal_settlements")
      .select(
        `
          deal_id,
          proposal_version,
          status,
          paypal_authorization_id,
          paypal_capture_id
        `
      )
      .eq("deal_id", dealId)
      .eq(
        "proposal_version",
        proposalVersion
      )
      .maybeSingle();

    if (settlementError) {
      console.error(
        "Could not verify settlement before void:",
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
      settlement.status !== "executing"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Settlement is not currently executing.",
        },
        { status: 409 }
      );
    }

    if (
      !settlement.paypal_capture_id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Settlement capture has not been recorded yet.",
        },
        { status: 409 }
      );
    }

    if (
      settlement.paypal_authorization_id !==
      authorizationId
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "PayPal authorization does not belong to this settlement.",
        },
        { status: 403 }
      );
    }

    const accessToken =
      await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/payments/authorizations/${authorizationId}/void`,
      {
        method: "POST",
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
          "Content-Type":
            "application/json",
          "PayPal-Request-Id":
            getPayPalRequestId(
              "void-authorization",
              `${dealId}:${proposalVersion}:${authorizationId}`
            ),
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData =
        await response.json();

      console.error(
        "PayPal void authorization error:",
        errorData
      );

      return NextResponse.json(
        {
          success: false,
          error: errorData,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      authorizationId,
      status: "VOIDED",
      proposalVersion,
      message:
        "Remaining uncaptured authorization released successfully.",
    });
  } catch (error) {
    console.error(
      "Void PayPal authorization failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to void PayPal authorization.",
      },
      { status: 500 }
    );
  }
}