import { NextRequest, NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalRequestId,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { authorizationId } = await request.json();

    if (!authorizationId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing authorizationId.",
        },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/payments/authorizations/${authorizationId}/void`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "PayPal-Request-Id": getPayPalRequestId(
  "void-authorization",
  authorizationId
),
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      const errorData = await response.json();

      console.error("PayPal void authorization error:", errorData);

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
      message: "Remaining uncaptured authorization released successfully.",
    });
  } catch (error) {
    console.error("Void PayPal authorization failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to void PayPal authorization.",
      },
      { status: 500 }
    );
  }
}