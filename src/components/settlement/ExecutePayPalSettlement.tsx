"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

type Status =
  | "idle"
  | "creating"
  | "authorizing"
  | "capturing"
  | "releasing"
  | "verifying"
  | "complete"
  | "error";

type ExecutePayPalSettlementProps = {
  dealId: string;
  proposalVersion: string;
  settlementAmount: number;
  originalAmount: number;
};

export default function ExecutePayPalSettlement({
  dealId,
  proposalVersion,
  settlementAmount,
  originalAmount,
}: ExecutePayPalSettlementProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const startedRef = useRef(false);

  const [status, setStatus] =
    useState<Status>("idle");

  const [error, setError] = useState("");

  const releaseAmount =
    originalAmount - settlementAmount;

  const paypalApproved =
    searchParams.get("paypal") === "approved";

  const orderId = searchParams.get("token");

  useEffect(() => {
    if (
      !paypalApproved ||
      !orderId ||
      startedRef.current
    ) {
      return;
    }

    startedRef.current = true;

    async function completeSettlement() {
      try {
        setError("");

        // 1. Authorize the PayPal order.
        setStatus("authorizing");

        const authorizeResponse = await fetch(
          "/api/paypal/authorize-order",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
  orderId,
  dealId,
  proposalVersion,
}),
          }
        );

        const authorizeData =
          await authorizeResponse.json();

        if (
          !authorizeResponse.ok ||
          !authorizeData.authorizationId
        ) {
          throw new Error(
            "PayPal authorization failed."
          );
        }

        const authorizationId =
          authorizeData.authorizationId;

        // 2. Capture the exact settlement amount
        // stored server-side for this proposal.
        setStatus("capturing");

        const captureResponse = await fetch(
          "/api/paypal/capture-authorization",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              authorizationId,
              dealId,
              proposalVersion,
            }),
          }
        );

        const captureData =
          await captureResponse.json();

        if (
          !captureResponse.ok ||
          !captureData.captureId
        ) {
          throw new Error(
            captureData.message ??
              "PayPal capture failed."
          );
        }

        // 3. Release the unused authorization.
        setStatus("releasing");

        const voidResponse = await fetch(
          "/api/paypal/void-authorization",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
  authorizationId,
  dealId,
  proposalVersion,
}),
          }
        );

        const voidData =
          await voidResponse.json();

        if (
          !voidResponse.ok ||
          voidData.status !== "VOIDED"
        ) {
          throw new Error(
            "The settlement was captured, but the remaining authorization could not be released."
          );
        }

        // 4. Ask DealDone's server to independently
        // verify the final PayPal state.
        setStatus("verifying");

        const completeResponse = await fetch(
          "/api/settlements/complete",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify({
              dealId,
              proposalVersion,
            }),
          }
        );

        const completeData =
          await completeResponse.json();

        if (
          !completeResponse.ok ||
          !completeData.success
        ) {
          throw new Error(
            completeData.message ??
              "Final settlement verification failed."
          );
        }

        setStatus("complete");

        // 5. Completion screen receives IDs that
        // were verified and persisted by the server.
        const params = new URLSearchParams({
          orderId:
            completeData.orderId ?? orderId,

          authorizationId:
            completeData.authorizationId ??
            authorizationId,

          captureId:
            completeData.captureId ??
            captureData.captureId,

          completedAt:
            completeData.completedAt ??
            new Date().toISOString(),

          proposalVersion,
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

    void completeSettlement();
  }, [
    dealId,
    orderId,
    paypalApproved,
    proposalVersion,
    router,
  ]);

  async function startPayPalSettlement() {
    try {
      setStatus("creating");
      setError("");

      /*
       * The proposal fingerprint itself acts as the
       * deterministic execution key.
       *
       * No browser storage is required.
       */
      const executionId =
        `settlement-${proposalVersion}`;

      const response = await fetch(
        "/api/paypal/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            executionId,
            dealId,
            proposalVersion,
          }),
        }
      );

      const data = await response.json();

      if (
        !response.ok ||
        !data.approvalUrl
      ) {
        throw new Error(
          data.message ??
            "Could not create the PayPal order."
        );
      }

      window.location.href =
        data.approvalUrl;
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
    status === "releasing" ||
    status === "verifying";

  let buttonText =
    "Execute settlement via PayPal";

  if (status === "creating") {
    buttonText = "Opening PayPal…";
  }

  if (status === "authorizing") {
    buttonText =
      "Authorizing payment…";
  }

  if (status === "capturing") {
    buttonText =
      `Capturing $${settlementAmount.toLocaleString()}…`;
  }

  if (status === "releasing") {
    buttonText =
      `Releasing $${releaseAmount.toLocaleString()}…`;
  }

  if (status === "verifying") {
    buttonText =
      "Verifying settlement…";
  }

  if (status === "complete") {
    buttonText =
      "Settlement completed";
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <button
        type="button"
        onClick={() =>
          void startPayPalSettlement()
        }
        disabled={
          isProcessing ||
          status === "complete"
        }
        className="flex h-[44px] min-w-[235px] items-center justify-center gap-2 rounded-[9px] bg-[#24164F] px-6 text-[13px] font-semibold text-white shadow-[0_8px_20px_rgba(36,22,79,0.18)] transition hover:bg-[#302064] disabled:cursor-not-allowed disabled:opacity-65"
      >
        {isProcessing && (
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/35 border-t-white" />
        )}

        {buttonText}

        {!isProcessing &&
          status !== "complete" && (
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