import { mkdir, readFile, appendFile } from "node:fs/promises";
import path from "node:path";

type PayPalWebhookAuditRecord = {
  eventId: string;
  eventType: string;
  resourceId: string | null;
  receivedAt: string;
  verified: true;
};

const AUDIT_DIRECTORY = path.join(process.cwd(), "data");
const AUDIT_FILE = path.join(
  AUDIT_DIRECTORY,
  "paypal-webhook-audit.jsonl"
);

export async function persistVerifiedPayPalWebhook(
  webhookEvent: {
    id?: string;
    event_type?: string;
    resource?: {
      id?: string;
    };
  }
) {
  const eventId = webhookEvent.id;
  const eventType = webhookEvent.event_type;

  if (!eventId || !eventType) {
    throw new Error(
      "Verified PayPal webhook is missing an event ID or event type."
    );
  }

  await mkdir(AUDIT_DIRECTORY, {
    recursive: true,
  });

  let existingAudit = "";

  try {
    existingAudit = await readFile(AUDIT_FILE, "utf8");
  } catch {
    // The audit file does not exist yet.
  }

  const alreadyRecorded = existingAudit
    .split("\n")
    .filter(Boolean)
    .some((line) => {
      try {
        const record = JSON.parse(line);
        return record.eventId === eventId;
      } catch {
        return false;
      }
    });

  if (alreadyRecorded) {
    return {
      recorded: false,
      duplicate: true,
    };
  }

  const record: PayPalWebhookAuditRecord = {
    eventId,
    eventType,
    resourceId: webhookEvent.resource?.id ?? null,
    receivedAt: new Date().toISOString(),
    verified: true,
  };

  await appendFile(
    AUDIT_FILE,
    `${JSON.stringify(record)}\n`,
    "utf8"
  );

  return {
    recorded: true,
    duplicate: false,
  };
}