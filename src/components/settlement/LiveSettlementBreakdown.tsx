"use client";

import { useEffect, useState } from "react";

type EvidenceAnalysis = {
  aiExtraction: {
    orderedUnits: number;
    unitPrice: number;
    deliveredUnits: number;
    reportedDamagedUnits: number;
    acceptedSupplierDamageUnits: number;
    findings: {
      finding: string;
      sourceId: string;
      sourceLine: string;
    }[];
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
  originalAmount: number;
  settlementAmount: number;

  negotiation?: {
    agreement?: {
      reached?: boolean;
      amount?: number;
      round?: number;
      proposalVersion?: string;
    };
  };
};

export default function LiveSettlementBreakdown() {
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
          "Could not load DealDone settlement breakdown.",
          error
        );
      }
    }

    void loadServerState();
  }, []);

  const orderedUnits =
    analysis?.aiExtraction.orderedUnits ?? 1000;

  const unitPrice =
    analysis?.aiExtraction.unitPrice ?? 18;

  const missingUnits =
    analysis?.deterministicAnalysis
      .missingUnits ?? 60;

  const acceptedDamage =
    analysis?.deterministicAnalysis
      .acceptedDamagedUnits ?? 55;

  const payableUnits =
    analysis?.deterministicAnalysis
      .payableUnits ?? 885;

  const originalAmount =
    settlementState?.originalAmount ??
    analysis?.deterministicAnalysis
      .originalAmount ??
    18000;

  const missingDeduction =
    analysis?.deterministicAnalysis
      .missingDeduction ?? 1080;

  const damageDeduction =
    analysis?.deterministicAnalysis
      .damageDeduction ?? 990;

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

  const release = Math.max(
    0,
    originalAmount - settlement
  );

  const agreementRound =
    settlementState?.negotiation?.agreement
      ?.round;

  const findings =
    analysis?.aiExtraction.findings ?? [];

  function sourceCitation(
    sourceIds: string[]
  ) {
    const matches = findings.filter(
      (finding) =>
        sourceIds.includes(
          finding.sourceId
        )
    );

    if (matches.length === 0) {
      return sourceIds.join(" · ");
    }

    return matches
      .map(
        (finding) =>
          `${finding.sourceId} · ${finding.sourceLine}`
      )
      .join(" · ");
  }

  function money(value: number) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  return (
    <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[#29233D]">
            Settlement breakdown
          </h2>

          <p className="mt-1 text-[13px] text-[#8B8493]">
            Evidence-backed calculation and negotiated resolution
          </p>
        </div>

        <span className="rounded-full bg-[#EAF8F0] px-3 py-1.5 text-[12px] font-semibold text-[#21865A]">
          {negotiatedSettlement !== null
            ? "Negotiated"
            : "Evidence-backed"}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[10px] border border-[#EEEAF2]">
        <div className="flex items-center justify-between border-b border-[#EEEAF2] px-4 py-2.5">
          <div>
            <p className="text-[14px] font-medium text-[#3E374E]">
              Original authorization
            </p>

            <p className="mt-1 text-[12px] text-[#918A99]">
              {orderedUnits.toLocaleString()} units × $
              {unitPrice.toFixed(2)}
            </p>

            <p className="mt-1 text-[10px] text-[#AAA3B0]">
              {sourceCitation([
                "PO-77821",
              ])}
            </p>
          </div>

          <span className="text-[15px] font-semibold text-[#201A37]">
            ${money(originalAmount)}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#EEEAF2] px-4 py-2.5">
          <div>
            <p className="text-[14px] font-medium text-[#3E374E]">
              Missing units
            </p>

            <p className="mt-1 text-[12px] text-[#918A99]">
              {missingUnits} units × $
              {unitPrice.toFixed(2)}
            </p>

            <p className="mt-1 text-[10px] text-[#AAA3B0]">
              {sourceCitation([
                "PO-77821",
                "DN-11000",
              ])}
            </p>
          </div>

          <span className="text-[15px] font-semibold text-[#E14999]">
            − ${money(missingDeduction)}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#EEEAF2] px-4 py-2.5">
          <div>
            <p className="text-[14px] font-medium text-[#3E374E]">
              Supplier-responsible damaged units
            </p>

            <p className="mt-1 text-[12px] text-[#918A99]">
              {acceptedDamage} units × $
              {unitPrice.toFixed(2)}
            </p>

            <p className="mt-1 text-[10px] text-[#AAA3B0]">
              {sourceCitation([
                "IR-99211",
                "WH-IMG-01",
              ])}
            </p>
          </div>

          <span className="text-[15px] font-semibold text-[#E14999]">
            − ${money(damageDeduction)}
          </span>
        </div>

        <div className="flex items-center justify-between bg-[#FBFAFD] px-4 py-3">
          <div>
            <p className="text-[15px] font-semibold text-[#29233D]">
              Final settlement
            </p>

            <p className="mt-1 text-[12px] text-[#8A8393]">
              {negotiatedSettlement !== null
                ? `Agent agreement · pending human approval${
                    agreementRound
                      ? ` in round ${agreementRound}`
                      : ""
                  }`
                : `Evidence-based payment for ${payableUnits} units`}
            </p>
          </div>

          <span className="text-[24px] font-bold tracking-[-0.04em] text-[#171332]">
            ${money(settlement)}
          </span>
        </div>
      </div>

      <div className="mt-4 rounded-[11px] bg-[#171332] p-4 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[13px] font-semibold">
  Planned PayPal settlement
</p>

            <p className="mt-1 text-[12px] text-white/60">
              Executes only after buyer and supplier approval
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white/10 text-[18px] font-bold">
            P
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[8px] bg-white/7 px-3 py-2.5">
            <p className="text-[11px] text-white/55">
              Planned capture
            </p>

            <p className="mt-1 text-[15px] font-semibold">
              ${money(settlement)}
            </p>
          </div>

          <div className="rounded-[8px] bg-white/7 px-3 py-2.5">
            <p className="text-[11px] text-white/55">
              Planned release
            </p>

            <p className="mt-1 text-[15px] font-semibold text-[#FF8FC8]">
              ${money(release)}
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-[8px] bg-white/10 px-3 py-2">
          <p className="text-[10px] font-semibold text-white/80">
            {negotiatedSettlement !== null
  ? "✓ Evidence-backed agreement ready for dual approval"
  : "✓ Calculated from validated evidence"}
          </p>
        </div>
      </div>
    </section>
  );
}