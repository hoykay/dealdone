import { supabaseServer } from "@/lib/supabase-server";

type PayPalWebhookEvent = {
  id?: string;
  event_type?: string;
  resource_type?: string;
  resource?: {
    id?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

export async function persistVerifiedPayPalWebhook(
  webhookEvent: PayPalWebhookEvent
) {
  const eventId = webhookEvent.id;
  const eventType = webhookEvent.event_type;

  if (!eventId || !eventType) {
    throw new Error(
      "Verified PayPal webhook is missing an event ID or event type."
    );
  }

  const { error } = await supabaseServer
    .from("paypal_webhook_events")
    .insert({
      event_id: eventId,
      event_type: eventType,
      resource_type: webhookEvent.resource_type ?? null,
      resource_id: webhookEvent.resource?.id ?? null,
      payload: webhookEvent,
      status: "received",
    });

  if (!error) {
    return {
      recorded: true,
      duplicate: false,
    };
  }

  // PostgreSQL unique-constraint violation.
  // PayPal can retry the same webhook, so duplicates are expected.
  if (error.code === "23505") {
    return {
      recorded: false,
      duplicate: true,
    };
  }

  throw new Error(
    `Failed to persist PayPal webhook: ${error.message}`
  );
}