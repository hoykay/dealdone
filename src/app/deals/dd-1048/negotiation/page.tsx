import Link from "next/link";
import AppShell from "@/components/AppShell";
import LiveDealDoneProposal from "@/components/negotiation/LiveDealDoneProposal";
import LiveNegotiationTimeline from "@/components/negotiation/LiveNegotiationTimeline";
import DealWorkspaceHeader from "@/components/deal/DealWorkspaceHeader";

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
        <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[#FF67B6]" />
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

function EvidenceLine({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 text-[12px] text-[#817A89]">
      <span className="text-[#A39CAA]">▤</span>
      {children}
    </div>
  );
}

export default function NegotiationPage() {
  return (
    <AppShell>
      <div className="px-5 py-4 sm:px-7 lg:px-8">

      <DealWorkspaceHeader activeTab="negotiation" />
        {/* Main layout */}
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_0.92fr]">
          {/* BUYER POSITION */}
          <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FCE7F3] text-[12px] font-semibold text-[#E24C99]">
                AM
              </div>

              <div>
                <p className="text-[12px] font-semibold text-[#E14A99]">
                  Buyer position
                </p>

                <p className="mt-0.5 text-[12px] text-[#8A8493]">
                  Acme Manufacturing
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[32px] font-semibold tracking-[-0.04em] text-[#171332]">
                $15,660.00
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-[14px] text-[#625C70]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF67B6]" />
                60 missing units
              </div>

              <div className="flex items-center gap-2 text-[14px] text-[#625C70]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF67B6]" />
                70 damaged units not accepted
              </div>
            </div>

            <div className="mt-5 border-t border-[#EEEAF2] pt-4">
              <p className="mb-2 text-[12px] font-semibold text-[#4A4458]">
                Key evidence
              </p>

              <div className="space-y-2">
  <EvidenceLine>DN-11000 · 940 units received</EvidenceLine>
  <EvidenceLine>IR-99211 · damaged units inspected</EvidenceLine>
  <EvidenceLine>WH-IMG-01 · warehouse photo evidence</EvidenceLine>
</div>
            </div>
          </section>

          {/* SUPPLIER POSITION */}
          <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EEEAFE] text-[12px] font-semibold text-[#4E35EE]">
                NP
              </div>

              <div>
                <p className="text-[12px] font-semibold text-[#4D35F3]">
                  Supplier position
                </p>

                <p className="mt-0.5 text-[12px] text-[#8A8493]">
                  Nova Packaging
                </p>
              </div>
            </div>

            <div className="mt-5">
              <p className="text-[32px] font-semibold tracking-[-0.04em] text-[#171332]">
                $16,200.00
              </p>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center gap-2 text-[14px] text-[#625C70]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#2A9D68]" />
                Accepts 60 missing units
              </div>

              <div className="flex items-center gap-2 text-[14px] text-[#625C70]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#6046F4]" />
                Disputes 30 of 70 damaged units initially
              </div>
            </div>

            <div className="mt-5 border-t border-[#EEEAF2] pt-4">
              <p className="mb-2 text-[12px] font-semibold text-[#4A4458]">
                Key evidence
              </p>

              <div className="space-y-2">
  <EvidenceLine>DN-11000 · 940 units received</EvidenceLine>
  <EvidenceLine>IR-99211 · 55 supplier-responsible units</EvidenceLine>
  <EvidenceLine>WH-IMG-01 · warehouse photo evidence</EvidenceLine>
</div>
            </div>
          </section>

          <LiveDealDoneProposal />
        </div>

        {/* Lower section */}
        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          
          <LiveNegotiationTimeline />

          {/* AI reasoning */}
          <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FCEAF5] text-[11px] text-[#E14999]">
                ✦
              </span>

              <h2 className="text-[14px] font-semibold text-[#29233D]">
                Why this proposal?
              </h2>
            </div>

            <p className="mt-3 text-[12px] leading-[1.6] text-[#777082]">
              The evidence supports 60 missing units and 55 supplier-responsible
damaged units. The buyer initially claimed all 70 damaged units, while
the supplier initially accepted 40. Their bounded negotiation converged
on the evidence-supported 55 units.
            </p>

            <Link
              href="/deals/dd-1048"
              className="mt-4 inline-flex items-center gap-2 text-[12px] font-semibold text-[#4D35F3]"
            >
              Review supporting evidence
              <span>→</span>
            </Link>
          </section>
        </div>
      </div>
    </AppShell>
  );
}