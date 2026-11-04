import { NextResponse } from "next/server";
import { persistVerifiedPayPalWebhook } from "@/lib/paypalWebhookAudit";
import {
  getPayPalAccessToken,
  PAYPAL_BASE_URL,
} from "@/lib/paypal";

export async function POST(request: Request) {
  try {
    const webhookId = process.env.PAYPAL_WEBHOOK_ID;

    if (!webhookId) {
      console.error("Missing PAYPAL_WEBHOOK_ID.");

      return NextResponse.json(
        {
          success: false,
          message: "PayPal webhook is not configured.",
        },
        { status: 500 }
      );
    }

    const authAlgo = request.headers.get("paypal-auth-algo");
    const certUrl = request.headers.get("paypal-cert-url");
    const transmissionId = request.headers.get(
      "paypal-transmission-id"
    );
    const transmissionSig = request.headers.get(
      "paypal-transmission-sig"
    );
    const transmissionTime = request.headers.get(
      "paypal-transmission-time"
    );

    if (
      !authAlgo ||
      !certUrl ||
      !transmissionId ||
      !transmissionSig ||
      !transmissionTime
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing PayPal webhook verification headers.",
        },
        { status: 400 }
      );
    }

    const webhookEvent = await request.json();

    const accessToken = await getPayPalAccessToken();

    const verificationResponse = await fetch(
      `${PAYPAL_BASE_URL}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          auth_algo: authAlgo,
          cert_url: certUrl,
          transmission_id: transmissionId,
          transmission_sig: transmissionSig,
          transmission_time: transmissionTime,
          webhook_id: webhookId,
          webhook_event: webhookEvent,
        }),
        cache: "no-store",
      }
    );

    const verificationData =
      await verificationResponse.json();

    if (!verificationResponse.ok) {
      console.error(
        "PayPal webhook verification request failed:",
        verificationData
      );

      return NextResponse.json(
        {
          success: false,
          message: "Could not verify PayPal webhook.",
        },
        { status: 502 }
      );
    }

    if (
      verificationData.verification_status !== "SUCCESS"
    ) {
      console.warn(
        "Rejected unverified PayPal webhook:",
        webhookEvent?.id
      );

      return NextResponse.json(
        {
          success: false,
          message: "Invalid PayPal webhook signature.",
        },
        { status: 401 }
      );
    }

    const auditResult =
  await persistVerifiedPayPalWebhook(webhookEvent);

console.log(
  "Verified PayPal webhook:",
  webhookEvent?.event_type,
  webhookEvent?.id,
  auditResult
);

return NextResponse.json({
  success: true,
  verified: true,
  recorded: auditResult.recorded,
  duplicate: auditResult.duplicate,
  eventId: webhookEvent?.id ?? null,
  eventType: webhookEvent?.event_type ?? null,
});
  } catch (error) {
    console.error("PayPal webhook processing failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process PayPal webhook.",
      },
      { status: 500 }
    );
  }
}