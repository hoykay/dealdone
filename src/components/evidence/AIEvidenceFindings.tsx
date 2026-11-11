"use client";

import { useState } from "react";
import Link from "next/link";

type AIResult = {
  success: boolean;
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
    summary: string;
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

export default function AIEvidenceFindings() {
  const [result, setResult] = useState<AIResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  async function analyzeEvidence() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/ai/analyze-evidence", {
        method: "POST",
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Evidence analysis failed.");
      }

      setResult(data);
      
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Evidence analysis failed."
      );
    } finally {
      setLoading(false);
    }
  }

  const missingUnits =
    result?.deterministicAnalysis.missingUnits ?? 60;

  const reportedDamaged =
    result?.aiExtraction.reportedDamagedUnits ?? 70;

  const acceptedDamaged =
    result?.aiExtraction.acceptedSupplierDamageUnits ?? 55;

  return (
    <aside className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-[13px] font-semibold text-[#24203A]">
          AI findings
        </h2>

        {result && (
          <span className="rounded-full bg-[#EAF8F0] px-2.5 py-1 text-[11px] font-semibold text-[#21865A]">
            Live analysis
          </span>
        )}
      </div>

      <div className="mt-3 rounded-[12px] bg-[#FDEAF5] px-3 py-2.5">
        <div className="flex items-center gap-2 text-[13px] font-semibold text-[#D63D8E]">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#FF67B6] text-[12px] text-white">
            ✦
          </span>

          {result
            ? "2 discrepancies detected by AI"
            : "Evidence ready for AI analysis"}
        </div>
      </div>

      {!result ? (
  <div className="mt-5 rounded-[10px] border border-dashed border-[#DCD6E8] bg-[#FAF9FC] px-4 py-6 text-center">
    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-[#F1EDFF] text-[18px] text-[#4D35F3]">
      ✦
    </div>

    <h3 className="mt-3 text-[13px] font-semibold text-[#352D48]">
      Evidence ready for analysis
    </h3>

    <p className="mx-auto mt-2 max-w-[240px] text-[11px] leading-[1.6] text-[#817A8B]">
      DealDone will compare the purchase order, delivery records,
      inspection evidence, photos, and communications to identify
      supported discrepancies.
    </p>

    <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-medium text-[#777181]">
      <span>5 evidence sources</span>
      <span className="text-[#C2BBC9]">•</span>
      <span>Ready</span>
    </div>
  </div>
) : (
  <>
    <div className="mt-4">
      <div className="flex gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FCEAF5] text-[11px] font-semibold text-[#E14999]">
          1
        </div>

        <div>
          <h3 className="text-[11px] font-semibold text-[#352D48]">
            Missing units
          </h3>

          <p className="mt-1 text-[10px] leading-[1.45] text-[#777181]">
            {result.deterministicAnalysis.missingUnits} units not delivered
          </p>

          <p className="mt-0.5 text-[9px] text-[#9B94A2]">
            PO-77821 → DN-11000 · {result.aiExtraction.orderedUnits} expected ·{" "}
            {result.aiExtraction.deliveredUnits} received
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-[8px] bg-[#F8F6FA] px-3 py-2.5">
        <p className="text-[9px] leading-[1.5] text-[#746D7D]">
          Source-backed mismatch: purchase order records{" "}
          {result.aiExtraction.orderedUnits} units while delivery evidence
          confirms {result.aiExtraction.deliveredUnits}.
        </p>
      </div>
    </div>

    <div className="my-5 h-px bg-[#EEEAF2]" />

    <div>
      <div className="flex gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#FCEAF5] text-[11px] font-semibold text-[#E14999]">
          2
        </div>

        <div>
          <h3 className="text-[11px] font-semibold text-[#352D48]">
            Damaged units
          </h3>

          <p className="mt-1 text-[10px] leading-[1.45] text-[#777181]">
            {result.aiExtraction.reportedDamagedUnits} reported ·{" "}
            {result.aiExtraction.acceptedSupplierDamageUnits} supported
          </p>

          <p className="mt-0.5 text-[9px] text-[#9B94A2]">
            IR-99211 · inspection evidence
          </p>
        </div>
      </div>

      <div className="mt-3 rounded-[8px] bg-[#F8F6FA] px-3 py-2.5">
        <p className="text-[9px] leading-[1.5] text-[#746D7D]">
          {result.aiExtraction.reportedDamagedUnits} units were reported
          damaged, but only{" "}
          {result.aiExtraction.acceptedSupplierDamageUnits} are supported as
          supplier-responsible.
        </p>
      </div>
    </div>

    <div className="my-5 h-px bg-[#EEEAF2]" />

    <div className="rounded-[9px] bg-[#F6F2FF] p-3">
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-semibold text-[#4935D8]">
          Deterministic settlement
        </p>

        <span className="text-[13px] font-bold text-[#241C47]">
          ${result.deterministicAnalysis.settlementAmount.toLocaleString()}
        </span>
      </div>

      <p className="mt-1.5 text-[9px] leading-[1.5] text-[#746D7D]">
        {result.deterministicAnalysis.payableUnits} payable units · $
        {result.deterministicAnalysis.authorizationRelease.toLocaleString()}{" "}
        authorization release
      </p>
    </div>
  </>
)}

      {result && (
        <>
          <div className="my-5 h-px bg-[#EEEAF2]" />

          <div className="rounded-[11px] bg-[#F6F2FF] p-3">
            <div className="flex items-center justify-between">
              <p className="text-[12px] font-semibold text-[#4935D8]">
                Deterministic settlement
              </p>

              <span className="text-[13px] font-bold text-[#241C47]">
                $
                {result.deterministicAnalysis.settlementAmount.toLocaleString()}
              </span>
            </div>

            <p className="mt-1.5 text-[11px] leading-[1.5] text-[#746D7D]">
              {result.deterministicAnalysis.payableUnits} payable units · $
              {result.deterministicAnalysis.authorizationRelease.toLocaleString()}{" "}
              authorization release
            </p>
          </div>
        </>
      )}

      {error && (
        <div className="mt-4 rounded-[8px] bg-[#FFF1F1] px-3 py-2.5 text-[11px] leading-[1.5] text-[#B84545]">
          {error}
        </div>
      )}

      <div className="mt-6 space-y-2.5">
        <button
          type="button"
          onClick={analyzeEvidence}
          disabled={loading}
          className="flex h-[40px] w-full items-center justify-center gap-2 rounded-[11px] border border-[#DDD8E5] bg-white text-[13px] font-semibold text-[#4B4558] transition hover:border-[#CFC8DC] hover:bg-[#FAF9FC] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading
            ? "Analyzing evidence…"
            : result
              ? "Run analysis again"
              : "Analyze evidence with AI"}

          {!loading && <span>✦</span>}
        </button>

        {result && (
  <Link
    href="/deals/dd-1048/negotiation"
    className="flex h-[42px] w-full items-center justify-center gap-2 rounded-[9px] bg-[#FF67B6] text-[11px] font-semibold text-white shadow-[0_8px_20px_rgba(255,103,182,0.20)] transition hover:bg-[#F55EAE]"
  >
    Continue to negotiation
    <span>→</span>
  </Link>
)}
      </div>
    </aside>
  );
}