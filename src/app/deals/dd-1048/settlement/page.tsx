import Link from "next/link";
import AppShell from "@/components/AppShell";
import SettlementApprovals from "@/components/approvals/SettlementApprovals";
import LiveSettlementBreakdown from "@/components/settlement/LiveSettlementBreakdown";
import DealWorkspaceHeader from "@/components/deal/DealWorkspaceHeader";

export default function SettlementPage() {
  return (
    <AppShell>
      <div className="px-5 py-3 sm:px-7 lg:px-8">

<DealWorkspaceHeader activeTab="settlement" />

        {/* Main upper grid */}
<div className="mt-3 grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
  {/* Settlement breakdown */}
  <LiveSettlementBreakdown />

  {/* Supporting evidence */}
  <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
    <div className="flex items-start justify-between">
      <div>
        <h2 className="text-[16px] font-semibold text-[#29233D]">
          Supporting evidence
        </h2>

        <p className="mt-1 text-[13px] text-[#8B8493]">
          Evidence supporting the agreed deductions
        </p>
      </div>

      <Link
        href="/deals/dd-1048"
        className="text-[12px] font-semibold text-[#4D35F3]"
      >
        View all →
      </Link>
    </div>

    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-4 rounded-[10px] border border-[#ECE8F1] px-3 py-2">
        <div className="flex h-[52px] w-[58px] shrink-0 items-center justify-center rounded-[8px] bg-[linear-gradient(145deg,#A6A0B0,#D1B8B7)] text-[11px] font-semibold text-white">
          DN
        </div>

        <div>
          <p className="text-[14px] font-semibold text-[#352F46]">
            Delivery Note
          </p>

          <p className="mt-1 text-[12px] text-[#837C8C]">
            Confirms 940 units received
          </p>

          <p className="mt-1 text-[11px] text-[#A09AA7]">
            Source: DN-11000
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-[10px] border border-[#ECE8F1] px-3 py-2">
        <div className="flex h-[52px] w-[58px] shrink-0 items-center justify-center rounded-[8px] bg-[linear-gradient(145deg,#8B635E,#C89182)] text-[11px] font-semibold text-white">
          IR
        </div>

        <div>
          <p className="text-[14px] font-semibold text-[#352F46]">
            Inspection Report
          </p>

          <p className="mt-1 text-[12px] text-[#837C8C]">
            55 units confirmed supplier-responsible
          </p>

          <p className="mt-1 text-[11px] text-[#A09AA7]">
            Source: IR-99211
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-[10px] border border-[#ECE8F1] px-3 py-2">
        <div className="h-[52px] w-[58px] shrink-0 overflow-hidden rounded-[8px]">
  <img
    src="/evidence/deal-1048/warehouse-photo.png"
    alt="Warehouse damage evidence"
    className="h-full w-full object-cover"
  />
</div>

        <div>
          <p className="text-[14px] font-semibold text-[#352F46]">
            Warehouse Photos
          </p>

          <p className="mt-1 text-[12px] text-[#837C8C]">
            Visual evidence of damaged packaging
          </p>

          <p className="mt-1 text-[11px] text-[#A09AA7]">
            Source: WH-IMG-01
          </p>
        </div>
      </div>
    </div>

    <div className="mt-3 rounded-[10px] bg-[#F6F2FF] p-4">
      <div className="flex gap-3">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FCEAF5] text-[#E14999]">
          ✦
        </span>

        <div>
          <p className="text-[13px] font-semibold text-[#4935D8]">
            Evidence-backed settlement
          </p>

          <p className="mt-1.5 text-[12px] leading-[1.6] text-[#6F687A]">
            DealDone validated the delivery, inspection and warehouse evidence
to determine the accepted quantity and settlement inputs.
          </p>
        </div>
      </div>
    </div>
  </section>
</div>

<SettlementApprovals />
      </div>
    </AppShell>
  );
}