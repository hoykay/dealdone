import { NextRequest, NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalRequestId,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";

export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json();

    if (!orderId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing orderId.",
        },
        { status: 400 }
      );
    }

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}/authorize`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          "PayPal-Request-Id": getPayPalRequestId(
  "authorize-order",
  orderId
),
        },
        body: JSON.stringify({}),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal authorize order error:", data);

      return NextResponse.json(
        {
          success: false,
          error: data,
        },
        { status: response.status }
      );
    }

    const authorization =
      data.purchase_units?.[0]?.payments?.authorizations?.[0];

    return NextResponse.json({
      success: true,
      orderId: data.id,
      orderStatus: data.status,
      authorizationId: authorization?.id,
      authorizationStatus: authorization?.status,
      amount: authorization?.amount,
    });
  } catch (error) {
    console.error("Authorize PayPal order failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to authorize PayPal order.",
      },
      { status: 500 }
    );
  }
}