import { createHash } from "node:crypto";
const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL || "https://api-m.sandbox.paypal.com";

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET;

export async function getPayPalAccessToken() {
  if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET) {
    throw new Error("Missing PayPal sandbox credentials.");
  }

  const auth = Buffer.from(
    `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    console.error("PayPal authentication error:", data);
    throw new Error("Failed to authenticate with PayPal.");
  }

  return data.access_token as string;
}

export function getPayPalRequestId(
  operation: string,
  stableKey: string
) {
  return createHash("sha256")
    .update(`dealdone:${operation}:${stableKey}`)
    .digest("hex")
    .slice(0, 36);
}

export { PAYPAL_BASE_URL };