import {
  connection,
  NextRequest,
  NextResponse,
} from "next/server";
import {
  getPayPalAccessToken,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";

export async function GET(request: NextRequest) {
  await connection();
  try {
    const orderId = request.nextUrl.searchParams.get("orderId");

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
      `${PAYPAL_BASE_URL}/v2/checkout/orders/${orderId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("PayPal order status error:", data);

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
      orderId: data.id,
      status: data.status,
      payer: data.payer
        ? {
            email: data.payer.email_address,
            payerId: data.payer.payer_id,
          }
        : null,
    });
  } catch (error) {
    console.error("PayPal order status failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check PayPal order status.",
      },
      { status: 500 }
    );
  }
}