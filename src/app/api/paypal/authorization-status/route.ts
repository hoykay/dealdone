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
    const authorizationId =
      request.nextUrl.searchParams.get("authorizationId");

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
      `${PAYPAL_BASE_URL}/v2/payments/authorizations/${authorizationId}`,
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
      console.error("PayPal authorization status error:", data);

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
      authorizationId: data.id,
      status: data.status,
      amount: data.amount,
      updateTime: data.update_time,
    });
  } catch (error) {
    console.error("Authorization status check failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to check PayPal authorization status.",
      },
      { status: 500 }
    );
  }
}