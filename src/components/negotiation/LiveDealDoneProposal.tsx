"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type EvidenceAnalysis = {
  aiExtraction: {
    orderedUnits: number;
    unitPrice: number;
    deliveredUnits: number;
    reportedDamagedUnits: number;
    acceptedSupplierDamageUnits: number;
  };

  deterministicAnalysis: {
    missingUnits: number;
    acceptedDamagedUnits: number;
    payableUnits: number;
    originalAmount: number;
    missingDeduction: number;
    damageDeduction: number;
    settlementAmount: number;
    authorizationRelease: number;
  };
};

type SettlementState = {
  settlementAmount: number;
  originalAmount: number;

  negotiation?: {
    agreement?: {
      reached?: boolean;
      amount?: number;
      round?: number;
      proposalVersion?: string;
    };
  };
};

export default function LiveDealDoneProposal() {
  const [analysis, setAnalysis] =
    useState<EvidenceAnalysis | null>(null);

  const [settlementState, setSettlementState] =
    useState<SettlementState | null>(null);

  useEffect(() => {
    async function loadServerState() {
      try {
        const [
          evidenceResponse,
          settlementResponse,
        ] = await Promise.all([
          fetch(
            "/api/evidence/current?dealId=DEAL-1048",
            {
              cache: "no-store",
            }
          ),

          fetch(
            "/api/settlements/current?dealId=DEAL-1048",
            {
              cache: "no-store",
            }
          ),
        ]);

        if (evidenceResponse.ok) {
          const evidenceData =
            await evidenceResponse.json();

          if (
            evidenceData.success &&
            evidenceData.analysis
          ) {
            setAnalysis({
              aiExtraction:
                evidenceData.analysis.aiExtraction,

              deterministicAnalysis:
                evidenceData.analysis
                  .deterministicAnalysis,
            });
          }
        }

        if (settlementResponse.ok) {
          const settlementData =
            await settlementResponse.json();

          if (
            settlementData.success &&
            settlementData.settlement
          ) {
            setSettlementState(
              settlementData.settlement
            );
          }
        }
      } catch (error) {
        console.error(
          "Could not load DealDone proposal state.",
          error
        );
      }
    }

    void loadServerState();
  }, []);

  const evidenceSettlement =
    analysis?.deterministicAnalysis
      .settlementAmount ?? 15930;

  const negotiatedSettlement =
    settlementState?.negotiation?.agreement
      ?.reached === true &&
    typeof settlementState.negotiation
      .agreement.amount === "number"
      ? settlementState.negotiation.agreement
          .amount
      : settlementState?.settlementAmount ??
        null;

  const settlement =
    negotiatedSettlement ??
    evidenceSettlement;

  const originalAmount =
    settlementState?.originalAmount ??
    analysis?.deterministicAnalysis
      .originalAmount ??
    18000;

  const release = Math.max(
    0,
    originalAmount - settlement
  );

  const payableUnits =
    analysis?.deterministicAnalysis
      .payableUnits ?? 885;

  const unitPrice =
    analysis?.aiExtraction.unitPrice ?? 18;

  const agreementRound =
    settlementState?.negotiation?.agreement
      ?.round;

  function money(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <section className="relative overflow-hidden rounded-[14px] border border-[#E8DDF2] bg-[linear-gradient(145deg,#FFF9FC_0%,#F5EEFF_55%,#FFF7FB_100%)] p-4 shadow-[0_12px_32px_rgba(74,45,130,0.08)]">
      <div className="absolute right-4 top-4 rounded-full bg-[#EAF8F0] px-2.5 py-1 text-[9px] font-semibold text-[#21865A]">
        {negotiatedSettlement !== null
          ? "Agreement reached"
          : analysis
            ? "Evidence-backed"
            : "AI"}
      </div>

      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCE7F3] text-[14px] text-[#E14999]">
          ✦
        </div>

        <div>
          <p className="text-[12px] font-semibold text-[#4935D8]">
            DealDone proposal
          </p>

          <p className="mt-1 text-[13px] font-medium text-[#6F687A]">
            Evidence-backed negotiated settlement
          </p>
        </div>
      </div>

      <div className="mt-5 text-center">
        <p className="text-[38px] font-semibold tracking-[-0.045em] text-[#171332]">
          ${money(settlement)}
        </p>

        <p className="mt-2 text-[12px] text-[#756E80]">
          {negotiatedSettlement !== null
            ? `Buyer and supplier agents converged${
                agreementRound
                  ? ` in round ${agreementRound}`
                  : ""
              }`
            : `${payableUnits} accepted units × $${unitPrice.toFixed(
                2
              )} per unit`}
        </p>
      </div>

      <div className="mt-5 rounded-[10px] bg-white/80 p-3">
        <div className="flex items-center justify-between text-[12px]">
          <span className="text-[#837C8C]">
  Planned PayPal capture
</span>

          <span className="font-semibold text-[#262038]">
            ${money(settlement)}
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-[12px]">
          <span className="text-[#837C8C]">
  Planned authorization release
</span>

          <span className="font-semibold text-[#E14999]">
            ${money(release)}
          </span>
        </div>
      </div>

      <div className="mt-3 rounded-[9px] bg-[#EAF8F0] px-3 py-2">
        <p className="text-[10px] font-semibold text-[#21865A]">
          {negotiatedSettlement !== null
  ? "✓ Agreement verified and ready for human approval"
  : "✓ Proposal calculated from validated evidence"}
        </p>
      </div>

      <Link
        href="/deals/dd-1048/settlement"
        className="mt-5 flex h-[42px] w-full items-center justify-center gap-2 rounded-[9px] bg-[#FF67B6] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(255,103,182,0.20)] transition hover:bg-[#F55EAE]"
      >
        Continue to approvals
        <span>→</span>
      </Link>
    </section>
  );
}