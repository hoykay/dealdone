import Link from "next/link";
import AppShell from "@/components/AppShell";
import AIEvidenceFindings from "@/components/evidence/AIEvidenceFindings";

const evidenceItems = [
  {
    title: "Purchase Order",
    meta1: "PO-77821",
    meta2: "Oct 1, 2026",
    active: true,
  },
  {
    title: "Delivery Note",
    meta1: "DN-11000",
    meta2: "Oct 15, 2026",
  },
  {
    title: "Inspection Report",
    meta1: "IR-99211",
    meta2: "Oct 16, 2026",
  },
  {
    title: "Warehouse Photos",
    meta1: "6 images",
    meta2: "Oct 16, 2026",
  },
  {
    title: "Email Thread",
    meta1: "12 messages",
    meta2: "Oct 10 – 16, 2026",
  },
];

function FileIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M7 3.5h7l4 4V20H7z" />
      <path d="M14 3.5V8h4" />
      <path d="M10 12h5" />
      <path d="M10 15.5h5" />
    </svg>
  );
}

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
    "relative flex h-[40px] items-center px-4 text-[12px] font-medium transition",
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

export default function DealDetailPage() {
  return (
    <AppShell>
      <div className="px-5 py-3 sm:px-7 lg:px-8">
        {/* Back */}
        <Link
          href="/deals"
          className="inline-flex items-center gap-2 text-[12px] font-medium text-[#7D7688] transition hover:text-[#2D2740]"
        >
          <span>←</span>
          Back to deals
        </Link>

        {/* Deal header */}
        <div className="mt-2 flex flex-col gap-4 border-b border-[#ECE8F1] pb-3 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border border-[#E4DFEA] bg-[linear-gradient(145deg,#CEC7DA,#8E859E)] text-[11px] font-semibold text-white shadow-sm">
              NP
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="editorial text-[27px] font-semibold tracking-[-0.03em] text-[#171332]">
                  DEAL-1048
                </h1>

                <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#FCEAF5] px-3 py-1.5 text-[10px] font-semibold text-[#E14A99]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#FF63B1]" />
                  Negotiating
                </span>
              </div>

              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-[#888192]">
                <span className="font-medium text-[#686172]">
                  Nova Packaging
                </span>
                <span>•</span>
                <span>PO-77821</span>
                <span>•</span>
                <span>Created Oct 26, 2026</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-[20px] font-semibold tracking-[-0.025em] text-[#1D1736]">
                $18,000.00
              </p>

              <p className="mt-0.5 text-[10px] text-[#8B8495]">
                Authorized via PayPal
              </p>
            </div>

            <button className="flex h-[40px] items-center justify-center rounded-[9px] border border-[#E3DFE9] bg-white px-4 text-[11px] font-medium text-[#514B5D] transition hover:bg-[#FAF9FC]">
              Share
            </button>

            <button className="flex h-[40px] w-[40px] items-center justify-center rounded-[9px] border border-[#E3DFE9] bg-white text-[#676171] transition hover:bg-[#FAF9FC]">
              •••
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-[#ECE8F1]">
          <Tab label="Overview" />
          <Tab label="Evidence" active />
          <Tab
            label="Negotiation"
            href="/deals/dd-1048/negotiation"
          />
          <Tab
            label="Settlement"
            href="/deals/dd-1048/settlement"
          />
          <Tab label="Activity" />
        </div>

        {/* Main evidence workspace */}
        <div className="grid h-[calc(100vh-270px)] min-h-[500px] grid-cols-1 gap-4 pt-3 xl:grid-cols-[230px_minmax(0,1fr)_290px]">
          {/* LEFT: Evidence list */}
          <aside className="rounded-[12px] border border-[#E9E5EE] bg-white p-3">
            <div className="flex items-center justify-between px-1 pb-3">
              <h2 className="text-[13px] font-semibold text-[#24203A]">
                Evidence (5)
              </h2>

              <button className="rounded-[7px] bg-[#33218C] px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-[#291B74]">
                + Upload
              </button>
            </div>

            <div className="space-y-1.5">
              {evidenceItems.map((item) => (
                <button
                  key={item.title}
                  className={[
                    "flex w-full items-start gap-3 rounded-[9px] p-3 text-left transition",
                    item.active
                      ? "bg-[#F1EDFF] text-[#4C35E9]"
                      : "text-[#686172] hover:bg-[#FAF9FC]",
                  ].join(" ")}
                >
                  <span
                    className={
                      item.active
                        ? "mt-0.5 text-[#4D35F3]"
                        : "mt-0.5 text-[#8A8494]"
                    }
                  >
                    <FileIcon />
                  </span>

                  <span>
                    <span
                      className={[
                        "block text-[11px] font-semibold",
                        item.active
                          ? "text-[#4935D8]"
                          : "text-[#40394E]",
                      ].join(" ")}
                    >
                      {item.title}
                    </span>

                    <span className="mt-1 block text-[9px] text-[#8F8898]">
                      {item.meta1}
                    </span>

                    <span className="mt-0.5 block text-[9px] text-[#A09AAA]">
                      {item.meta2}
                    </span>
                  </span>
                </button>
              ))}
            </div>
          </aside>

          {/* CENTER: Document viewer */}
          <section className="min-w-0 rounded-[12px] border border-[#E9E5EE] bg-white">
            {/* Viewer toolbar */}
            <div className="flex h-[50px] items-center justify-between border-b border-[#ECE8F1] px-4">
              <div className="flex items-center gap-3 text-[10px] text-[#777182]">
                <button className="text-[#6A6375]">‹</button>
                <span className="font-medium text-[#4B4557]">
                  1 / 3
                </span>
                <button className="text-[#6A6375]">›</button>

                <span className="h-4 w-px bg-[#E6E1EA]" />

                <span>100%</span>
              </div>

              <div className="flex items-center gap-2">
                {["↗", "⇩", "⎙"].map((icon) => (
                  <button
                    key={icon}
                    className="flex h-8 w-8 items-center justify-center rounded-[7px] text-[12px] text-[#777181] transition hover:bg-[#F7F5F9]"
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Document canvas */}
            <div className="flex h-[calc(100%-50px)] items-start justify-center overflow-hidden bg-[#F5F4F8] px-5 py-4">
              <div className="h-full max-h-[500px] w-full max-w-[470px] bg-white px-9 py-7 shadow-[0_4px_18px_rgba(34,27,53,0.10)]">
                {/* Document heading */}
                <div className="flex items-start justify-between border-b border-[#E9E5EC] pb-6">
                  <div>
                    <p className="editorial text-[29px] font-semibold tracking-[-0.035em] text-[#171332]">
                      ACME
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-[10px] font-bold tracking-[0.08em] text-[#2E2944]">
                      PURCHASE ORDER
                    </p>
                  </div>
                </div>

                {/* Metadata */}
                <div className="mt-6 grid grid-cols-[110px_1fr] gap-y-3 text-[10px]">
                  <span className="font-medium text-[#797383]">
                    PO Number
                  </span>
                  <span className="font-semibold text-[#2D2740]">
                    PO-77821
                  </span>

                  <span className="font-medium text-[#797383]">
                    Date
                  </span>
                  <span className="font-semibold text-[#2D2740]">
                    Oct 1, 2026
                  </span>

                  <span className="font-medium text-[#797383]">
                    Supplier
                  </span>
                  <span className="font-semibold text-[#2D2740]">
                    Nova Packaging
                  </span>
                </div>

                {/* Table */}
                <div className="mt-7 border-t border-[#E5E1E8]">
                  <div className="grid grid-cols-[0.65fr_1.7fr_0.6fr_0.8fr_0.9fr] gap-2 border-b border-[#E5E1E8] py-3 text-[8px] font-semibold text-[#777083]">
                    <span>Item</span>
                    <span>Description</span>
                    <span>Qty</span>
                    <span>Unit Price</span>
                    <span>Total</span>
                  </div>

                  <div className="grid grid-cols-[0.65fr_1.7fr_0.6fr_0.8fr_0.9fr] gap-2 py-4 text-[9px] text-[#373047]">
                    <span>A001</span>
                    <span>Electronics Component</span>
                    <span>1,000</span>
                    <span>$18.00</span>
                    <span>$18,000.00</span>
                  </div>
                </div>

                <div className="mt-16 flex justify-end border-t border-[#E5E1E8] pt-5">
                  <div className="grid grid-cols-[80px_1fr] gap-4 text-[11px]">
                    <span className="font-semibold text-[#5D5767]">
                      Total
                    </span>

                    <span className="font-bold text-[#1D1736]">
                      $18,000.00
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* RIGHT: AI findings */}
<AIEvidenceFindings />
        </div>
      </div>
    </AppShell>
  );
}