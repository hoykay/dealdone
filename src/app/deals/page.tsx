import Link from "next/link";
import AppShell from "@/components/AppShell";
import LiveSettlementBreakdown from "@/components/settlement/LiveSettlementBreakdown";

const deals = [
  {
    id: "DEAL-1048",
    po: "PO-77821",
    counterparty: "Nova Packaging",
    issue: "Delivery discrepancy",
    detail: "60 missing · 70 damaged",
    amount: "$18,000",
    status: "Evidence review",
updated: "Just now",
    image: "NP",
  },
  {
    id: "DEAL-1047",
    po: "PO-66532",
    counterparty: "Global Metals",
    issue: "Quality issue",
    detail: "250 below spec",
    amount: "$42,000",
    status: "Awaiting approval",
    updated: "1 day ago",
    image: "GM",
  },
  {
    id: "DEAL-1046",
    po: "PO-99711",
    counterparty: "Sunrise Textiles",
    issue: "Late delivery",
    detail: "12 days delayed",
    amount: "$28,500",
    status: "At risk",
    updated: "2 days ago",
    image: "ST",
  },
  {
    id: "DEAL-1045",
    po: "PO-44190",
    counterparty: "Vertex Components",
    issue: "Partial shipment",
    detail: "200 of 1,000 units",
    amount: "$65,000",
    status: "Evidence review",
    updated: "3 days ago",
    image: "VC",
  },
  {
    id: "DEAL-1044",
    po: "PO-33021",
    counterparty: "Pacific Electronics",
    issue: "Damaged goods",
    detail: "40 units damaged",
    amount: "$22,400",
    status: "Settled",
    updated: "3 days ago",
    image: "PE",
  },
];

function SearchIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    >
      <circle cx="11" cy="11" r="6" />
      <path d="m16 16 4 4" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    Negotiating: "bg-[#FCEAF5] text-[#E14A99]",
    "Awaiting approval": "bg-[#EEEAFE] text-[#543AF0]",
    "At risk": "bg-[#FFF0F1] text-[#F04463]",
    "Evidence review": "bg-[#F0ECFF] text-[#5A3FF4]",
    Settled: "bg-[#EAF8F1] text-[#21865A]",
  };

  const dotStyles: Record<string, string> = {
    Negotiating: "bg-[#FF63B1]",
    "Awaiting approval": "bg-[#5943F3]",
    "At risk": "bg-[#F04463]",
    "Evidence review": "bg-[#5A3FF4]",
    Settled: "bg-[#24945F]",
  };

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-[8px] px-3 py-2 text-[11px] font-semibold ${
        styles[status] ?? "bg-[#F2F0F6] text-[#625C70]"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          dotStyles[status] ?? "bg-[#8B8496]"
        }`}
      />

      {status}
    </span>
  );
}

export default function DealsPage() {
  return (
    <AppShell>
      <div className="px-5 py-7 sm:px-7 lg:px-10 lg:py-8">
        {/* Header */}
        <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <h1 className="editorial text-[42px] leading-none tracking-[-0.045em] text-[#171332]">
              Deals
            </h1>

            <p className="mt-2 text-[13px] text-[#777184]">
              Track and manage your supply chain disputes
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {/* Search */}
            <div className="flex h-[42px] w-full items-center gap-2 rounded-[9px] border border-[#E7E3ED] bg-white px-3 text-[#9A94A4] sm:w-[290px]">
              <SearchIcon />

              <input
                type="text"
                placeholder="Search deals, counterparties..."
                className="w-full bg-transparent text-[12px] text-[#29233B] outline-none placeholder:text-[#AAA4B2]"
              />
            </div>

            {/* New deal */}
            <button
              type="button"
              className="inline-flex h-[42px] items-center justify-center gap-2 rounded-[9px] bg-[#FF67B6] px-5 text-[12px] font-semibold text-white shadow-[0_8px_20px_rgba(255,103,182,0.22)] transition hover:-translate-y-[1px] hover:bg-[#F55EAE]"
            >
              <span className="text-[18px] font-light leading-none">+</span>
              New deal
            </button>
          </div>
        </div>

        {/* Filters */}
<div className="mt-7 flex flex-wrap gap-2">
  <button className="inline-flex h-[34px] items-center gap-2 rounded-[8px] bg-[#EEEAFE] px-3.5 text-[11px] font-semibold text-[#4E35EE]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#4E35EE]" />
    All (5)
  </button>

  <button className="inline-flex h-[34px] items-center gap-2 rounded-[8px] border border-[#E8E4ED] bg-white px-3.5 text-[11px] font-medium text-[#625C70]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#5A3FF4]" />
    Evidence review (2)
  </button>

  <button className="inline-flex h-[34px] items-center gap-2 rounded-[8px] border border-[#E8E4ED] bg-white px-3.5 text-[11px] font-medium text-[#625C70]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#F04463]" />
    At risk (1)
  </button>

  <button className="inline-flex h-[34px] items-center gap-2 rounded-[8px] border border-[#E8E4ED] bg-white px-3.5 text-[11px] font-medium text-[#625C70]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#6046F4]" />
    Awaiting approval (1)
  </button>

  <button className="inline-flex h-[34px] items-center gap-2 rounded-[8px] border border-[#E8E4ED] bg-white px-3.5 text-[11px] font-medium text-[#625C70]">
    <span className="h-1.5 w-1.5 rounded-full bg-[#24945F]" />
    Settled (1)
  </button>
</div>

        {/* Table */}
        <div className="mt-5 overflow-hidden rounded-[12px] border border-[#EBE7F0] bg-white">
          {/* Header row */}
          <div className="hidden grid-cols-[1.05fr_0.9fr_1.35fr_0.7fr_0.9fr_0.8fr_32px] border-b border-[#EEEAF2] px-5 py-3 text-[10px] font-medium text-[#918B9B] lg:grid">
            <div>Deal</div>
            <div>Counterparty</div>
            <div>Issue</div>
            <div>Amount (USD)</div>
            <div>Status</div>
            <div>Last updated</div>
            <div />
          </div>

          {/* Rows */}
          {deals.map((deal, index) => {
            const row = (
              <div
                className={[
                  "grid min-h-[82px] items-center gap-4 px-5 py-4 transition hover:bg-[#FBFAFD]",
                  "lg:grid-cols-[1.05fr_0.9fr_1.35fr_0.7fr_0.9fr_0.8fr_32px]",
                  index !== deals.length - 1
                    ? "border-b border-[#F0EDF3]"
                    : "",
                ].join(" ")}
              >
                {/* Deal */}
                <div className="flex items-center gap-3">
                  <div className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-[9px] border border-[#E7E2EC] bg-[linear-gradient(145deg,#E7E2EF,#B8AFC5)] text-[9px] font-semibold text-white shadow-sm">
                    {deal.image}
                  </div>

                  <div>
                    <p className="text-[12px] font-semibold text-[#27213C]">
                      {deal.id}
                    </p>

                    <p className="mt-0.5 text-[10px] text-[#928B9B]">
                      {deal.po}
                    </p>
                  </div>
                </div>

                {/* Counterparty */}
                <div className="text-[12px] font-medium text-[#3B354A]">
                  {deal.counterparty}
                </div>

                {/* Issue */}
                <div>
                  <p className="text-[12px] font-medium text-[#302A43]">
                    {deal.issue}
                  </p>

                  <p className="mt-1 text-[10px] text-[#938C9D]">
                    {deal.detail}
                  </p>
                </div>

                {/* Amount */}
                <div className="text-[12px] font-semibold text-[#211B37]">
                  {deal.amount}
                </div>

                {/* Status */}
                <div>
                  <StatusBadge status={deal.status} />
                </div>

                {/* Updated */}
                <div className="text-[11px] text-[#8A8393]">
                  {deal.updated}
                </div>

                {/* Chevron */}
                <div className="flex justify-end text-[#70697A]">
                  <ChevronRight />
                </div>
              </div>
            );

            if (deal.id === "DEAL-1048") {
              return (
                <Link
                  key={deal.id}
                  href="/deals/dd-1048"
                  className="block"
                >
                  {row}
                </Link>
              );
            }

            return <div key={deal.id}>{row}</div>;
          })}
        </div>
      </div>
    </AppShell>
  );
}