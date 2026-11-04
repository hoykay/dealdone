"use client";

import Link from "next/link";
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

export default function LiveDealDoneProposal() {
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

  const settlement =
    analysis?.deterministicAnalysis.settlementAmount ?? 15930;

  const release =
    analysis?.deterministicAnalysis.authorizationRelease ?? 2070;

  const payableUnits =
    analysis?.deterministicAnalysis.payableUnits ?? 885;

  const missingUnits =
    analysis?.deterministicAnalysis.missingUnits ?? 60;

  const acceptedDamage =
    analysis?.deterministicAnalysis.acceptedDamagedUnits ?? 55;

  const reportedDamage =
    analysis?.aiExtraction.reportedDamagedUnits ?? 70;

  const unitPrice =
    analysis?.aiExtraction.unitPrice ?? 18;

  return (
    <>
      {/* DEALDONE PROPOSAL */}
      <section className="relative overflow-hidden rounded-[14px] border border-[#E8DDF2] bg-[linear-gradient(145deg,#FFF9FC_0%,#F5EEFF_55%,#FFF7FB_100%)] p-4 shadow-[0_12px_32px_rgba(74,45,130,0.08)]">
        <div className="absolute right-4 top-4 rounded-full bg-[#EAF8F0] px-2.5 py-1 text-[9px] font-semibold text-[#21865A]">
          {analysis ? "Live AI" : "AI"}
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
              Evidence-backed settlement
            </p>
          </div>
        </div>

        <div className="mt-5 text-center">
          <p className="text-[38px] font-semibold tracking-[-0.045em] text-[#171332]">
            ${settlement.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="mt-2 text-[12px] text-[#756E80]">
            {payableUnits} accepted units × ${unitPrice.toFixed(2)} per unit
          </p>
        </div>

        <div className="mt-5 rounded-[10px] bg-white/80 p-3">
          <div className="flex items-center justify-between text-[12px]">
            <span className="text-[#837C8C]">Captured</span>

            <span className="font-semibold text-[#262038]">
              ${settlement.toLocaleString()}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[12px]">
            <span className="text-[#837C8C]">Released</span>

            <span className="font-semibold text-[#E14999]">
              ${release.toLocaleString()}
            </span>
          </div>
        </div>

        {analysis && (
          <div className="mt-3 rounded-[9px] bg-[#EAF8F0] px-3 py-2">
            <p className="text-[10px] font-semibold text-[#21865A]">
              ✓ Generated from live evidence analysis
            </p>
          </div>
        )}

        <div className="mt-5 grid grid-cols-[1fr_auto] gap-2">
          <Link
            href="/deals/dd-1048/settlement"
            className="flex h-[42px] items-center justify-center gap-2 rounded-[9px] bg-[#FF67B6] px-4 text-[14px] font-semibold text-white shadow-[0_8px_20px_rgba(255,103,182,0.20)] transition hover:bg-[#F55EAE]"
          >
            Accept proposal
            <span>→</span>
          </Link>

          <button
            type="button"
            className="flex h-[42px] items-center justify-center rounded-[9px] border border-[#DDD8E5] bg-white px-3 text-[14px] font-semibold text-[#5B5467]"
          >
            View breakdown
          </button>
        </div>
      </section>
    </>
  );
}