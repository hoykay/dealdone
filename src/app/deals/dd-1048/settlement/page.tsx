import Link from "next/link";
import AppShell from "@/components/AppShell";
import SettlementApprovals from "@/components/approvals/SettlementApprovals";
import LiveSettlementBreakdown from "@/components/settlement/LiveSettlementBreakdown";

function Tab({
  label,
  active,
  href,
}: {
  label: string;
  active?: boolean;
  href?: string;
}) {
  const classes = [
    "relative flex h-[46px] items-center px-5 text-[16px] font-semibold transition",
    active
      ? "text-[#4D35F3]"
      : "text-[#716B7C] hover:text-[#2A243B]",
  ].join(" ");

  const content = (
    <>
      {label}

      {active && (
        <span className="absolute inset-x-4 bottom-0 h-[3px] rounded-full bg-[#FF67B6]" />
      )}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}

export default function SettlementPage() {
  return (
    <AppShell>
      <div className="px-5 py-3 sm:px-7 lg:px-8">
        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-[#ECE8F1]">
          <Tab label="Overview" href="/deals/dd-1048" />
          <Tab label="Evidence" href="/deals/dd-1048" />
          <Tab
            label="Negotiation"
            href="/deals/dd-1048/negotiation"
          />
          <Tab label="Settlement" active />
          <Tab label="Activity" />
        </div>

        {/* Heading */}
        <div className="mt-3 flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="editorial text-[34px] leading-none tracking-[-0.04em] text-[#171332]">
              Settlement & approval
            </h1>

            <p className="mt-2 text-[14px] text-[#777181]">
              Review the final settlement before PayPal executes the agreed payment.
            </p>
          </div>

          <div className="rounded-[9px] bg-[#FCEAF5] px-4 py-2 text-[13px] font-semibold text-[#E14999]">
            Proposed settlement · $15,930.00
          </div>
        </div>

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
            Source: DN-11000 · Oct 15
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
            Source: IR-99211 · Finding 3
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4 rounded-[10px] border border-[#ECE8F1] px-3 py-2">
        <div className="relative h-[52px] w-[58px] shrink-0 overflow-hidden rounded-[8px] bg-[linear-gradient(145deg,#776A73,#C5A79F)]">
          <div className="absolute bottom-2 left-2 h-[17px] w-[20px] rounded-[3px] bg-[#755DE7]/50" />
          <div className="absolute bottom-2 right-2 h-[20px] w-[22px] rounded-[3px] bg-[#E15F9A]/55" />
        </div>

        <div>
          <p className="text-[14px] font-semibold text-[#352F46]">
            Warehouse Photos
          </p>

          <p className="mt-1 text-[12px] text-[#837C8C]">
            Visual evidence of damaged packaging
          </p>

          <p className="mt-1 text-[11px] text-[#A09AA7]">
            6 images · Oct 16
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
            DealDone matched the delivery, inspection and warehouse evidence
            to calculate the final accepted quantity.
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