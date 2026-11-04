"use client";

import { useEffect, useState } from "react";
import ExecutePayPalSettlement from "@/components/settlement/ExecutePayPalSettlement";

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
  const [buyerApproved, setBuyerApproved] = useState(false);
  const [supplierApproved, setSupplierApproved] = useState(false);
  const [settlementAmount, setSettlementAmount] = useState(15930);
  const [proposalVersion, setProposalVersion] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let currentSettlement = 15930;
    let currentProposalVersion = "";

    const savedNegotiation =
      localStorage.getItem("dealdone-negotiation");

    if (savedNegotiation) {
      try {
        const parsed = JSON.parse(savedNegotiation);

        const negotiatedAmount =
          parsed?.negotiation?.agreement?.amount;

          const negotiatedProposalVersion =
  parsed?.negotiation?.agreement?.proposalVersion;

if (typeof negotiatedProposalVersion === "string") {
  currentProposalVersion = negotiatedProposalVersion;
}

        if (
          typeof negotiatedAmount === "number" &&
          Number.isFinite(negotiatedAmount)
        ) {
          currentSettlement = negotiatedAmount;
        }
      } catch {
        console.error(
          "Could not read DealDone negotiated settlement."
        );
      }
    }

    setSettlementAmount(currentSettlement);

    const currentApprovalFingerprint =
  `${currentSettlement}:${currentProposalVersion}`;

const savedBuyerApproval = localStorage.getItem(
  "dealdone-buyer-approved-proposal"
);

const savedSupplierApproval = localStorage.getItem(
  "dealdone-supplier-approved-proposal"
);

setBuyerApproved(
  currentProposalVersion !== "" &&
    savedBuyerApproval === currentApprovalFingerprint
);

setSupplierApproved(
  currentProposalVersion !== "" &&
    savedSupplierApproval === currentApprovalFingerprint
);

    setProposalVersion(currentProposalVersion);
    setLoaded(true);
  }, []);

  function approveBuyer() {
    setBuyerApproved(true);

    localStorage.setItem(
  "dealdone-buyer-approved-proposal",
  `${settlementAmount}:${proposalVersion}`
);
  }

  function approveSupplier() {
    setSupplierApproved(true);

    localStorage.setItem(
  "dealdone-supplier-approved-proposal",
  `${settlementAmount}:${proposalVersion}`
);
  }

  const bothApproved = buyerApproved && supplierApproved;

  if (!loaded) {
    return null;
  }

  return (
    <>
      {/* Approval cards */}
      <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-2">
        {/* Buyer approval */}
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
            ) : (
              <button
                type="button"
                onClick={approveBuyer}
                className="h-[40px] rounded-[9px] bg-[#FF67B6] px-4 text-[12px] font-semibold text-white transition hover:bg-[#F45DAD]"
              >
                Approve
              </button>
            )}
          </div>
        </section>

        {/* Supplier approval */}
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
            ) : (
              <button
                type="button"
                onClick={approveSupplier}
                className="h-[40px] rounded-[9px] bg-[#4D35F3] px-4 text-[12px] font-semibold text-white transition hover:bg-[#3E29DB]"
              >
                Approve
              </button>
            )}
          </div>
        </section>
      </div>

      {/* Execution bar */}
      <div className="mt-3 flex items-center justify-between rounded-[12px] border border-[#E8E4EE] bg-white px-5 py-3">
        <div>
          <p className="text-[14px] font-semibold text-[#302A42]">
            {bothApproved
              ? "Ready to execute"
              : "Waiting for both parties"}
          </p>

          <p className="mt-1 text-[12px] text-[#837C8C]">
            {bothApproved
              ? "Both parties approved. The agreed settlement is ready for PayPal execution."
              : "Both buyer and supplier must approve the exact settlement before PayPal execution."}
          </p>
        </div>

        {bothApproved ? (
          <ExecutePayPalSettlement />
        ) : (
          <button
            type="button"
            disabled
            className="flex h-[44px] min-w-[235px] cursor-not-allowed items-center justify-center rounded-[9px] bg-[#DDD9E4] px-6 text-[13px] font-semibold text-[#8B8495]"
          >
            Execute settlement via PayPal
          </button>
        )}
      </div>
    </>
  );
}