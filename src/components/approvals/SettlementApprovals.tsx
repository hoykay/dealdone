"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import ExecutePayPalSettlement from "@/components/settlement/ExecutePayPalSettlement";

type ApprovalRole = "buyer" | "supplier";

type SettlementState = {
  dealId: string;
  proposalVersion: string;
  evidenceAnalysisVersion: string | null;
  originalAmount: number;
  settlementAmount: number;
  buyerApproved: boolean;
  supplierApproved: boolean;
  buyerApprovedAt: string | null;
  supplierApprovedAt: string | null;
  status:
    | "pending_approval"
    | "approved"
    | "executing"
    | "completed"
    | "failed";
  negotiation?: {
    agreement?: {
      reached?: boolean;
      amount?: number;
      proposalVersion?: string;
    };
  };
};

type AuthState = {
  authenticated: boolean;
  email: string | null;
  role: ApprovalRole | null;
};

function CheckIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 12 4 4 8-8" />
    </svg>
  );
}

export default function SettlementApprovals() {
  const [settlement, setSettlement] =
    useState<SettlementState | null>(null);

  const [auth, setAuth] = useState<AuthState>({
    authenticated: false,
    email: null,
    role: null,
  });

  const [loaded, setLoaded] = useState(false);
  const [authLoaded, setAuthLoaded] =
    useState(false);
  const [error, setError] = useState("");
  const [approving, setApproving] =
    useState(false);

  const loadSettlement = useCallback(async () => {
    try {
      setError("");

      const response = await fetch(
        "/api/settlements/current?dealId=DEAL-1048",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 404) {
          setSettlement(null);
          return;
        }

        throw new Error(
          data.message ??
            "Could not load the settlement."
        );
      }

      setSettlement(data.settlement);
    } catch (err) {
      console.error(
        "Could not load authoritative settlement:",
        err
      );

      setError(
        "DealDone could not load the current settlement state."
      );
    } finally {
      setLoaded(true);
    }
  }, []);

  const loadAuth = useCallback(async () => {
    try {
      const response = await fetch(
        "/api/auth/me?dealId=DEAL-1048",
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Could not load authenticated identity."
        );
      }

      setAuth({
        authenticated:
          data.authenticated === true,
        email: data.user?.email ?? null,
        role:
          data.role === "buyer" ||
          data.role === "supplier"
            ? data.role
            : null,
      });
    } catch (err) {
      console.error(
        "Could not load authenticated identity:",
        err
      );

      setAuth({
        authenticated: false,
        email: null,
        role: null,
      });
    } finally {
      setAuthLoaded(true);
    }
  }, []);

  useEffect(() => {
    void Promise.all([
      loadSettlement(),
      loadAuth(),
    ]);
  }, [loadSettlement, loadAuth]);

  async function approve() {
    if (!settlement?.proposalVersion) {
      return;
    }

    try {
      setApproving(true);
      setError("");

      const response = await fetch(
        "/api/settlements/approve",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            dealId: settlement.dealId,
            proposalVersion:
              settlement.proposalVersion,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message ??
            "Could not record approval."
        );
      }

      await Promise.all([
        loadSettlement(),
        loadAuth(),
      ]);
    } catch (err) {
      console.error(
        "Could not record approval:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Could not record approval."
      );
    } finally {
      setApproving(false);
    }
  }

  if (!loaded || !authLoaded) {
    return (
      <div className="mt-3 rounded-[12px] border border-[#E8E4EE] bg-white px-5 py-5">
        <p className="text-[13px] text-[#837C8C]">
          Loading authoritative settlement state…
        </p>
      </div>
    );
  }

  if (!settlement) {
    return (
      <div className="mt-3 rounded-[12px] border border-[#E8E4EE] bg-white px-5 py-5">
        <p className="text-[14px] font-semibold text-[#302A42]">
          Negotiated proposal required
        </p>

        <p className="mt-1 text-[12px] text-[#837C8C]">
          Complete the AI negotiation before either
          party can approve a settlement.
        </p>

        <Link
          href="/deals/dd-1048/negotiation"
          className="mt-4 inline-flex h-[40px] items-center rounded-[9px] bg-[#4D35F3] px-4 text-[12px] font-semibold text-white"
        >
          Open negotiation
        </Link>
      </div>
    );
  }

  const agreementReached =
    settlement.negotiation?.agreement?.reached ===
    true;

  const hasValidProposal =
    agreementReached &&
    settlement.proposalVersion !== "";

  const buyerApproved =
    settlement.buyerApproved;

  const supplierApproved =
    settlement.supplierApproved;

  const bothApproved =
    buyerApproved && supplierApproved;

  const isCompleted =
    settlement.status === "completed";

  const isExecuting =
    settlement.status === "executing";

  const canExecute =
    hasValidProposal &&
    bothApproved &&
    settlement.status === "approved";

  const buyerCanApprove =
    auth.authenticated &&
    auth.role === "buyer" &&
    !buyerApproved &&
    hasValidProposal &&
    !approving &&
    !isExecuting &&
    !isCompleted;

  const supplierCanApprove =
    auth.authenticated &&
    auth.role === "supplier" &&
    !supplierApproved &&
    hasValidProposal &&
    !approving &&
    !isExecuting &&
    !isCompleted;

  return (
    <>
      <div className="mt-3 rounded-[12px] border border-[#E8E4EE] bg-white px-5 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#918A98]">
              Server-authoritative proposal
            </p>

            <p className="mt-1 text-[14px] font-semibold text-[#302A42]">
              $
              {settlement.settlementAmount.toLocaleString(
                "en-US",
                {
                  minimumFractionDigits: 2,
                }
              )}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {settlement.evidenceAnalysisVersion && (
              <span className="rounded-[8px] bg-[#FFF2F8] px-3 py-2 font-mono text-[10px] font-semibold text-[#D94893]">
                Evidence{" "}
                {
                  settlement.evidenceAnalysisVersion
                }
              </span>
            )}

            <span className="rounded-[8px] bg-[#F4F1FC] px-3 py-2 font-mono text-[10px] font-semibold text-[#4D35F3]">
              Proposal{" "}
              {settlement.proposalVersion}
            </span>
          </div>
        </div>
      </div>

      {!auth.authenticated &&
        !isCompleted && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#E8E4EE] bg-[#FAF9FC] px-5 py-3">
            <div>
              <p className="text-[13px] font-semibold text-[#302A42]">
                Authentication required
              </p>

              <p className="mt-1 text-[12px] text-[#837C8C]">
                Sign in as the buyer or supplier
                assigned to this deal to approve.
              </p>
            </div>

            <Link
              href="/login"
              className="flex h-[40px] items-center rounded-[9px] bg-[#4D35F3] px-4 text-[12px] font-semibold text-white"
            >
              Sign in to approve
            </Link>
          </div>
        )}

      {auth.authenticated && (
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[12px] border border-[#E8E4EE] bg-[#FAF9FC] px-5 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#918A98]">
              Authenticated identity
            </p>

            <p className="mt-1 text-[13px] font-semibold text-[#302A42]">
              {auth.email ??
                "Authenticated user"}
            </p>
          </div>

          <span className="rounded-[8px] bg-[#EEEAFE] px-3 py-2 text-[11px] font-semibold capitalize text-[#4D35F3]">
            {auth.role
              ? `${auth.role} role`
              : "No deal role"}
          </span>
        </div>
      )}

      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
        <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FCEAF5] text-[12px] font-semibold text-[#E14999]">
                AC
              </div>

              <div>
                <p className="text-[14px] font-semibold text-[#302A42]">
                  Buyer approval
                </p>

                <p className="mt-0.5 text-[12px] text-[#837C8C]">
                  Amanda Chen · Acme Manufacturing
                </p>
              </div>
            </div>

            {buyerApproved ? (
              <span className="flex items-center gap-2 rounded-[8px] bg-[#EAF8F0] px-3 py-2 text-[12px] font-semibold text-[#21865A]">
                <CheckIcon />
                Approved
              </span>
            ) : auth.role === "buyer" ? (
              <button
                type="button"
                onClick={() => void approve()}
                disabled={!buyerCanApprove}
                className="h-[40px] rounded-[9px] bg-[#FF67B6] px-4 text-[12px] font-semibold text-white transition hover:bg-[#F45DAD] disabled:cursor-not-allowed disabled:bg-[#DDD9E4] disabled:text-[#8B8495]"
              >
                {approving
                  ? "Approving…"
                  : "Approve"}
              </button>
            ) : (
              <span className="rounded-[8px] bg-[#F4F2F6] px-3 py-2 text-[11px] font-semibold text-[#8B8495]">
                Buyer only
              </span>
            )}
          </div>
        </section>

        <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EEEAFE] text-[12px] font-semibold text-[#4D35F3]">
                NP
              </div>

              <div>
                <p className="text-[14px] font-semibold text-[#302A42]">
                  Supplier approval
                </p>

                <p className="mt-0.5 text-[12px] text-[#837C8C]">
                  Nova Packaging
                </p>
              </div>
            </div>

            {supplierApproved ? (
              <span className="flex items-center gap-2 rounded-[8px] bg-[#EAF8F0] px-3 py-2 text-[12px] font-semibold text-[#21865A]">
                <CheckIcon />
                Approved
              </span>
            ) : auth.role ===
              "supplier" ? (
              <button
                type="button"
                onClick={() => void approve()}
                disabled={
                  !supplierCanApprove
                }
                className="h-[40px] rounded-[9px] bg-[#4D35F3] px-4 text-[12px] font-semibold text-white transition hover:bg-[#3E29DB] disabled:cursor-not-allowed disabled:bg-[#DDD9E4] disabled:text-[#8B8495]"
              >
                {approving
                  ? "Approving…"
                  : "Approve"}
              </button>
            ) : (
              <span className="rounded-[8px] bg-[#F4F2F6] px-3 py-2 text-[11px] font-semibold text-[#8B8495]">
                Supplier only
              </span>
            )}
          </div>
        </section>
      </div>

      {error && (
        <p className="mt-3 text-[12px] font-medium text-[#C53E66]">
          {error}
        </p>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-4 rounded-[12px] border border-[#E8E4EE] bg-white px-5 py-3">
        <div>
          <p className="text-[14px] font-semibold text-[#302A42]">
            {isCompleted
              ? "Settlement completed"
              : isExecuting
                ? "Settlement executing"
                : canExecute
                  ? "Ready to execute"
                  : "Waiting for both parties"}
          </p>

          <p className="mt-1 text-[12px] text-[#837C8C]">
            {isCompleted
              ? "The approved settlement was executed and independently verified through PayPal."
              : isExecuting
                ? "DealDone is executing the approved proposal through PayPal."
                : canExecute
                  ? "Both authenticated parties approved the exact server-authoritative proposal. It is ready for PayPal execution."
                  : "The authenticated buyer and supplier must independently approve the exact proposal stored by DealDone before payment execution."}
          </p>
        </div>

        {isCompleted ? (
          <Link
            href="/deals/dd-1048/payment-record"
            className="flex h-[44px] min-w-[210px] items-center justify-center rounded-[9px] bg-[#4D35F3] px-6 text-[13px] font-semibold text-white transition hover:bg-[#3E29DB]"
          >
            View payment record
          </Link>
        ) : canExecute ? (
          <ExecutePayPalSettlement
            dealId={settlement.dealId}
            proposalVersion={
              settlement.proposalVersion
            }
            settlementAmount={
              settlement.settlementAmount
            }
            originalAmount={
              settlement.originalAmount
            }
          />
        ) : (
          <button
            type="button"
            disabled
            className="flex h-[44px] min-w-[235px] cursor-not-allowed items-center justify-center rounded-[9px] bg-[#DDD9E4] px-6 text-[13px] font-semibold text-[#8B8495]"
          >
            {isExecuting
              ? "Settlement in progress"
              : "Execute settlement via PayPal"}
          </button>
        )}
      </div>
    </>
  );
}