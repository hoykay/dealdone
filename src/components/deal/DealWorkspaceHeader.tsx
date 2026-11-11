import Link from "next/link";

type DealWorkspaceHeaderProps = {
  activeTab: "evidence" | "negotiation" | "settlement";
};

export default function DealWorkspaceHeader({
  activeTab,
}: DealWorkspaceHeaderProps) {

  const status =
  activeTab === "evidence"
    ? "Evidence review"
    : activeTab === "negotiation"
      ? "Agreement reached"
      : "Awaiting approval";

  const tabs = [
    {
      id: "evidence",
      label: "Evidence",
      href: "/deals/dd-1048",
    },
    {
      id: "negotiation",
      label: "Negotiation",
      href: "/deals/dd-1048/negotiation",
    },
    {
      id: "settlement",
      label: "Settlement",
      href: "/deals/dd-1048/settlement",
    },
  ];

  return (
    <>
      <Link
        href="/deals"
        className="inline-flex items-center gap-2 text-[13px] font-medium text-[#7D7688] transition hover:text-[#2D2740]"
      >
        <span>←</span>
        Back to deals
      </Link>

      <div className="mt-3 flex flex-col gap-4 border-b border-[#ECE8F1] pb-4 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-[52px] w-[52px] items-center justify-center rounded-[10px] border border-[#E4DFEA] bg-[linear-gradient(145deg,#CEC7DA,#8E859E)] text-[11px] font-semibold text-white shadow-sm">
            NP
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="editorial text-[28px] font-semibold tracking-[-0.03em] text-[#171332]">
                DEAL-1048
              </h1>

              <span className="inline-flex items-center gap-2 rounded-[8px] bg-[#FCEAF5] px-3 py-1.5 text-[11px] font-semibold text-[#E14A99]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#FF63B1]" />
                {status}
              </span>
            </div>

            <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-[#888192]">
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

        <div className="text-right">
          <p className="text-[21px] font-semibold tracking-[-0.025em] text-[#1D1736]">
            $18,000.00
          </p>

          <p className="mt-0.5 text-[11px] text-[#8B8495]">
            Authorized via PayPal
          </p>
        </div>
      </div>

      <div className="flex overflow-x-auto border-b border-[#ECE8F1]">
        {tabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={[
                "relative flex h-[46px] items-center px-5 text-[14px] font-semibold transition",
                active
                  ? "text-[#4D35F3]"
                  : "text-[#716B7C] hover:text-[#2A243B]",
              ].join(" ")}
            >
              {tab.label}

              {active && (
                <span className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[#FF67B6]" />
              )}
            </Link>
          );
        })}
      </div>
    </>
  );
}