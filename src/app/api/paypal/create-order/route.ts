import { NextResponse } from "next/server";
import {
  getPayPalAccessToken,
  getPayPalRequestId,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const { executionId } = await request.json();

if (!executionId || typeof executionId !== "string") {
  return NextResponse.json(
    {
      success: false,
      message: "Missing settlement execution ID.",
    },
    { status: 400 }
  );
}

    const accessToken = await getPayPalAccessToken();

    const response = await fetch(
      `${PAYPAL_BASE_URL}/v2/checkout/orders`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          Prefer: "return=representation",
          "PayPal-Request-Id": getPayPalRequestId(
  "create-order",
  executionId
),
        },
        body: JSON.stringify({
          intent: "AUTHORIZE",
          purchase_units: [
            {
              reference_id: "DEAL-1048",
              description: "DealDone · Nova Packaging · PO-77821",
              amount: {
                currency_code: "USD",
                value: "18000.00",
              },
            },
          ],
          application_context: {
  brand_name: "DealDone",
  user_action: "PAY_NOW",
  shipping_preference: "NO_SHIPPING",
  return_url:
    "http://localhost:3000/deals/dd-1048/settlement?paypal=approved",
  cancel_url:
    "http://localhost:3000/deals/dd-1048/settlement?paypal=cancelled",
},
        }),
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal create order error:", data);

      return NextResponse.json(
        {
          success: false,
          error: data,
        },
        { status: response.status }
      );
    }

    const approvalUrl = data.links?.find(
      (link: { rel: string; href: string }) =>
        link.rel === "approve"
    )?.href;

    return NextResponse.json({
      success: true,
      orderId: data.id,
      status: data.status,
      approvalUrl,
    });
  } catch (error) {
    console.error("Create PayPal order failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create PayPal order.",
      },
      { status: 500 }
    );
  }
}