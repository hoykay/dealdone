"use client";

import { useEffect, useState } from "react";

type SavedAnalysis = {
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

export default function LiveSettlementBreakdown() {
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("dealdone-ai-analysis");

    if (!saved) return;

    try {
      setAnalysis(JSON.parse(saved));
    } catch {
      console.error("Could not read saved DealDone AI analysis.");
    }
  }, []);

  const orderedUnits = analysis?.aiExtraction.orderedUnits ?? 1000;
  const unitPrice = analysis?.aiExtraction.unitPrice ?? 18;

  const missingUnits =
    analysis?.deterministicAnalysis.missingUnits ?? 60;

  const acceptedDamage =
    analysis?.deterministicAnalysis.acceptedDamagedUnits ?? 55;

  const payableUnits =
    analysis?.deterministicAnalysis.payableUnits ?? 885;

  const originalAmount =
    analysis?.deterministicAnalysis.originalAmount ?? 18000;

  const missingDeduction =
    analysis?.deterministicAnalysis.missingDeduction ?? 1080;

  const damageDeduction =
    analysis?.deterministicAnalysis.damageDeduction ?? 990;

  const settlement =
    analysis?.deterministicAnalysis.settlementAmount ?? 15930;

  const release =
    analysis?.deterministicAnalysis.authorizationRelease ?? 2070;

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
            Based on the evidence and agreed resolution
          </p>
        </div>

        <span className="rounded-full bg-[#EAF8F0] px-3 py-1.5 text-[12px] font-semibold text-[#21865A]">
          {analysis ? "Live AI" : "Agreed"}
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[10px] border border-[#EEEAF2]">
        <div className="flex items-center justify-between border-b border-[#EEEAF2] px-4 py-2.5">
          <div>
            <p className="text-[14px] font-medium text-[#3E374E]">
              Original authorization
            </p>

            <p className="mt-1 text-[12px] text-[#918A99]">
              {orderedUnits.toLocaleString()} units × ${unitPrice.toFixed(2)}
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
              {missingUnits} units × ${unitPrice.toFixed(2)}
            </p>
          </div>

          <span className="text-[15px] font-semibold text-[#E14999]">
            − ${money(missingDeduction)}
          </span>
        </div>

        <div className="flex items-center justify-between border-b border-[#EEEAF2] px-4 py-2.5">
          <div>
            <p className="text-[14px] font-medium text-[#3E374E]">
              Accepted damaged units
            </p>

            <p className="mt-1 text-[12px] text-[#918A99]">
              {acceptedDamage} units × ${unitPrice.toFixed(2)}
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
              Payment for {payableUnits} accepted units
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
              PayPal execution
            </p>

            <p className="mt-1 text-[12px] text-white/60">
              Authorization → partial capture → release remainder
            </p>
          </div>

          <div className="flex h-9 w-9 items-center justify-center rounded-[9px] bg-white/10 text-[18px] font-bold">
            P
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="rounded-[8px] bg-white/7 px-3 py-2.5">
            <p className="text-[11px] text-white/55">
              Capture
            </p>

            <p className="mt-1 text-[15px] font-semibold">
              ${settlement.toLocaleString()}
            </p>
          </div>

          <div className="rounded-[8px] bg-white/7 px-3 py-2.5">
            <p className="text-[11px] text-white/55">
              Release
            </p>

            <p className="mt-1 text-[15px] font-semibold text-[#FF8FC8]">
              ${release.toLocaleString()}
            </p>
          </div>
        </div>

        {analysis && (
          <div className="mt-3 rounded-[8px] bg-white/10 px-3 py-2">
            <p className="text-[10px] font-semibold text-white/80">
              ✓ Calculated from live evidence analysis
            </p>
          </div>
        )}
      </div>
    </section>
  );
}