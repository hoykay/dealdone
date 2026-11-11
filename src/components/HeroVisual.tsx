export default function HeroVisual() {
  return (
    <div className="relative flex h-[610px] w-full max-w-[700px] items-center justify-center">
      {/* Very subtle background atmosphere */}
      <div
        aria-hidden="true"
        className="absolute right-[-5%] top-[2%] h-[420px] w-[420px] rounded-full bg-[#EDE7FF] opacity-70 blur-[85px]"
      />

      <div
        aria-hidden="true"
        className="absolute bottom-[2%] left-[8%] h-[300px] w-[300px] rounded-full bg-[#FFE7F3] opacity-60 blur-[90px]"
      />

      {/* Case preview */}
      <div className="relative z-10 w-full max-w-[650px] rounded-[18px] border border-[#E5E1EC] bg-white p-7 shadow-[0_24px_70px_rgba(35,27,73,0.10)]">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-flex rounded-[8px] bg-[#F1EDFF] px-3 py-1.5 text-[12px] font-bold text-[#6047FF]">
              DEAL-1048
            </span>

            <h2 className="mt-3 text-[25px] font-semibold tracking-[-0.035em] text-[#171332]">
              Nova Packaging
            </h2>

            <p className="mt-1 text-[13px] text-[#7A7485]">
              PO-77821
            </p>
          </div>

          <div className="inline-flex items-center gap-2 rounded-full bg-[#EAF8F0] px-4 py-2 text-[13px] font-semibold text-[#247A4E]">
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-[#33A469] text-[11px]">
              ✓
            </span>
            Resolved
          </div>
        </div>

        {/* Amount comparison */}
        <div className="mt-7 grid grid-cols-[1fr_auto_1fr] items-center rounded-[14px] border border-[#ECE9F1] bg-[#FAF9FC] px-7 py-5">
          <div>
            <p className="text-[12px] font-medium text-[#777181]">
              Disputed amount
            </p>

            <p className="mt-1 text-[31px] font-semibold tracking-[-0.045em] text-[#171332]">
              $18,000
            </p>
          </div>

          <div className="px-7 text-[28px] font-light text-[#6047FF]">
            →
          </div>

          <div className="rounded-[12px] bg-[#F3EFFF] px-5 py-3 text-right">
            <p className="text-[12px] font-semibold text-[#6047FF]">
              Agreed settlement
            </p>

            <p className="mt-1 text-[32px] font-bold tracking-[-0.045em] text-[#6047FF]">
              $15,930
            </p>
          </div>
        </div>

        {/* Evidence */}
        <div className="mt-4 flex items-center justify-between border-b border-[#ECE9F1] px-2 py-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#F1EDFF] text-[18px] text-[#6047FF]">
              ▤
            </div>

            <div>
              <p className="text-[14px] font-semibold text-[#211C37]">
                Evidence reviewed
              </p>

              <p className="mt-1 text-[12px] text-[#777181]">
                4 sources · 2 discrepancies
              </p>
            </div>
          </div>

          <span className="text-[21px] text-[#9B95A5]">
            ›
          </span>
        </div>

        {/* Approvals */}
        <div className="grid grid-cols-2 divide-x divide-[#ECE9F1] py-5">
          <div className="flex items-center gap-3 pr-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#EAF8F0] text-[17px] text-[#27895A]">
              ✓
            </div>

            <div>
              <p className="text-[13px] font-semibold text-[#211C37]">
                Buyer approval
              </p>

              <p className="mt-1 text-[12px] text-[#27895A]">
                Approved
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 pl-6">
            <div className="flex h-11 w-11 items-center justify-center rounded-[11px] bg-[#EAF8F0] text-[17px] text-[#27895A]">
              ✓
            </div>

            <div>
              <p className="text-[13px] font-semibold text-[#211C37]">
                Supplier approval
              </p>

              <p className="mt-1 text-[12px] text-[#27895A]">
                Approved
              </p>
            </div>
          </div>
        </div>

        {/* PayPal settlement */}
        <div className="rounded-[14px] bg-[#181334] px-6 py-5 text-white shadow-[0_12px_30px_rgba(24,19,52,0.16)]">
          <div className="flex items-center justify-between gap-5">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                PayPal settlement
              </p>

              <p className="mt-2 text-[15px] font-semibold">
                Payment executed
              </p>
            </div>

            <div className="h-10 w-px bg-white/15" />

            <div className="flex-1">
              <p className="text-[18px] font-semibold">
                $15,930 captured
              </p>

              <p className="mt-1 text-[13px] font-medium text-[#FF78B9]">
                $2,070 released
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#CFF4DC] text-[16px] font-bold text-[#248653]">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}