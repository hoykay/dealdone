"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Status =
  | "idle"
  | "creating"
  | "authorizing"
  | "capturing"
  | "releasing"
  | "complete"
  | "error";

export default function ExecutePayPalSettlement() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const [settlementAmount, setSettlementAmount] = useState(15930);
const [releaseAmount, setReleaseAmount] = useState(2070);

  const paypalApproved = searchParams.get("paypal") === "approved";
  const orderId = searchParams.get("token");
useEffect(() => {
  const savedNegotiation =
    localStorage.getItem("dealdone-negotiation");

  if (!savedNegotiation) return;

  try {
    const parsed = JSON.parse(savedNegotiation);

    const negotiatedSettlement =
      parsed?.negotiation?.agreement?.amount;

    if (
      typeof negotiatedSettlement === "number" &&
      Number.isFinite(negotiatedSettlement)
    ) {
      setSettlementAmount(negotiatedSettlement);
      setReleaseAmount(18000 - negotiatedSettlement);
    }
  } catch {
    console.error(
      "Could not read DealDone negotiated settlement."
    );
  }
}, []);

  useEffect(() => {
    if (!paypalApproved || !orderId || startedRef.current) {
  return;
}

const approvedOrderId = orderId;

startedRef.current = true;

async function completeSettlement() {
      try {
        setError("");

        // 1. Authorize the approved PayPal order
        setStatus("authorizing");

        const authorizeResponse = await fetch(
          "/api/paypal/authorize-order",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
  orderId: approvedOrderId,
}),
          }
        );

        const authorizeData = await authorizeResponse.json();

        if (!authorizeResponse.ok || !authorizeData.authorizationId) {
          throw new Error("PayPal authorization failed.");
        }

        const authorizationId = authorizeData.authorizationId;

        // 2. Read the negotiated DealDone agreement and capture it
setStatus("capturing");

const savedNegotiation =
  localStorage.getItem("dealdone-negotiation");

if (!savedNegotiation) {
  throw new Error(
    "No DealDone negotiated settlement was found."
  );
}

const parsedNegotiation =
  JSON.parse(savedNegotiation);

const negotiatedAmount =
  parsedNegotiation?.negotiation?.agreement?.amount;

if (
  typeof negotiatedAmount !== "number" ||
  !Number.isFinite(negotiatedAmount)
) {
  throw new Error(
    "The DealDone negotiated settlement amount is invalid."
  );
}

const captureResponse = await fetch(
  "/api/paypal/capture-authorization",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      authorizationId,
      settlementAmount: negotiatedAmount,
    }),
  }
);

        const captureData = await captureResponse.json();

        if (!captureResponse.ok || !captureData.captureId) {
          throw new Error("PayPal capture failed.");
        }

        // 3. Release the remaining uncaptured authorization
        setStatus("releasing");

        const voidResponse = await fetch(
          "/api/paypal/void-authorization",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              authorizationId,
            }),
          }
        );

        const voidData = await voidResponse.json();

        if (!voidResponse.ok || voidData.status !== "VOIDED") {
          throw new Error(
            "The settlement was captured, but the remaining authorization could not be released."
          );
        }

        // 4. Verify final PayPal state
        const verifyResponse = await fetch(
          `/api/paypal/authorization-status?authorizationId=${authorizationId}`,
          {
            cache: "no-store",
          }
        );

        const verifyData = await verifyResponse.json();

        if (!verifyResponse.ok || verifyData.status !== "VOIDED") {
          throw new Error(
            "PayPal settlement completed, but final verification failed."
          );
        }

        setStatus("complete");

        const completedProposalVersion =
  parsedNegotiation?.negotiation?.agreement?.proposalVersion;

if (
  typeof completedProposalVersion === "string" &&
  completedProposalVersion
) {
  localStorage.removeItem(
    `dealdone-paypal-execution-${completedProposalVersion}`
  );
}

        // 5. Send the real IDs to the completion screen
        const params = new URLSearchParams({
  orderId: approvedOrderId,
  authorizationId,
  captureId: captureData.captureId,
  completedAt: new Date().toISOString(),
});

        router.replace(
          `/deals/dd-1048/complete?${params.toString()}`
        );
      } catch (err) {
        console.error(err);

        setStatus("error");

        setError(
          err instanceof Error
            ? err.message
            : "Something went wrong while executing the settlement."
        );
      }
    }

    completeSettlement();
  }, [paypalApproved, orderId, router]);

  async function startPayPalSettlement() {
    try {
      setStatus("creating");
      setError("");

      const savedNegotiation =
  localStorage.getItem("dealdone-negotiation");

if (!savedNegotiation) {
  throw new Error("No negotiated settlement was found.");
}

const parsedNegotiation = JSON.parse(savedNegotiation);

const proposalVersion =
  parsedNegotiation?.negotiation?.agreement?.proposalVersion;

if (!proposalVersion) {
  throw new Error("No proposal version was found.");
}

const executionStorageKey =
  `dealdone-paypal-execution-${proposalVersion}`;

let executionId =
  localStorage.getItem(executionStorageKey);

if (!executionId) {
  executionId = crypto.randomUUID();
  localStorage.setItem(executionStorageKey, executionId);
}

const response = await fetch(
  "/api/paypal/create-order",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      executionId,
    }),
  }
);

      const data = await response.json();

      if (!response.ok || !data.approvalUrl) {
        throw new Error("Could not create the PayPal order.");
      }

      window.location.href = data.approvalUrl;
    } catch (err) {
      console.error(err);

      setStatus("error");

      setError(
        err instanceof Error
          ? err.message
          : "Could not start the PayPal settlement."
      );
    }
  }

  const isProcessing =
    status === "creating" ||
    status === "authorizing" ||
    status === "capturing" ||
    status === "releasing";

  let buttonText = "Execute settlement via PayPal";

  if (status === "creating") {
    buttonText = "Opening PayPal…";
  }

  if (status === "authorizing") {
    buttonText = "Authorizing payment…";
  }

  if (status === "capturing") {
    buttonText = `Capturing $${settlementAmount.toLocaleString()}…`;
  }

  if (status === "releasing") {
    buttonText = `Releasing $${releaseAmount.toLocaleString()}…`;
  }

  if (status === "complete") {
    buttonText = "Settlement completed";
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={startPayPalSettlement}
        disabled={isProcessing || status === "complete"}
        className="flex h-[44px] min-w-[235px] items-center justify-center gap-2 rounded-[9px] bg-[#24164F] px-6 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(36,22,79,0.18)] transition hover:bg-[#302064] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isProcessing && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        )}

        {buttonText}

        {!isProcessing && status !== "complete" && (
          <span>→</span>
        )}
      </button>

      {error && (
        <p className="max-w-[330px] text-right text-[11px] font-medium text-[#D74778]">
          {error}
        </p>
      )}
    </div>
  );
}