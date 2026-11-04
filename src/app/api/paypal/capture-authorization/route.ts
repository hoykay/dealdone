import { NextRequest, NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalRequestId,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { authorizationId, settlementAmount } = await request.json();

    if (!authorizationId) {
  return NextResponse.json(
    {
      success: false,
      message: "Missing authorizationId.",
    },
    { status: 400 }
  );
}

if (
  typeof settlementAmount !== "number" ||
  !Number.isFinite(settlementAmount) ||
  settlementAmount <= 0 ||
  settlementAmount > 18000
) {
  return NextResponse.json(
    {
      success: false,
      message: "Invalid settlement amount.",
    },
    { status: 400 }
  );
}

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/payments/authorizations/${authorizationId}/capture`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          "PayPal-Request-Id": getPayPalRequestId(
  "capture-authorization",
  `${authorizationId}:${settlementAmount.toFixed(2)}`
),
        },
        body: JSON.stringify({
          amount: {
            currency_code: "USD",
            value: settlementAmount.toFixed(2),
          },
          final_capture: false,
          note_to_payer: "DealDone settlement for DEAL-1048",
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal capture authorization error:", data);

      return NextResponse.json(
        {
          success: false,
          error: data,
        },
        { status: response.status }
      );
    }

    return NextResponse.json({
      success: true,
      captureId: data.id,
      status: data.status,
      amount: data.amount,
      finalCapture: data.final_capture,
    });
  } catch (error) {
    console.error("Capture PayPal authorization failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to capture PayPal authorization.",
      },
      { status: 500 }
    );
  }
}