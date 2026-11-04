export default function HeroVisual() {
  return (
    <div className="relative h-[650px] w-full max-w-[760px] overflow-hidden">
      {/* Ambient scene */}
      <div className="absolute inset-x-[2%] bottom-[3%] top-[2%] overflow-hidden rounded-[34px]">
        {/* Sky */}
        <div className="absolute inset-0 bg-[linear-gradient(145deg,#F5F2FF_0%,#DDD7FF_30%,#C7B9FF_48%,#F6B6D7_73%,#FFD2B7_100%)]" />

        {/* Atmospheric glow */}
        <div className="absolute -right-[8%] top-[5%] h-[340px] w-[340px] rounded-full bg-[#FF91C8]/35 blur-[85px]" />
        <div className="absolute left-[15%] top-[12%] h-[320px] w-[320px] rounded-full bg-[#7762FF]/30 blur-[90px]" />

        {/* Horizon */}
        <div className="absolute inset-x-0 bottom-[30%] h-[1px] bg-white/40" />

        {/* Ground */}
        <div className="absolute inset-x-0 bottom-0 h-[36%] bg-[linear-gradient(180deg,rgba(74,58,120,0.14),rgba(38,29,74,0.28))]" />

        {/* Distant port silhouettes */}
        <div className="absolute bottom-[33%] right-[5%] h-[120px] w-[3px] bg-[#4D416E]/25" />
        <div className="absolute bottom-[33%] right-[5%] h-[2px] w-[130px] origin-right rotate-[-35deg] bg-[#4D416E]/20" />

        <div className="absolute bottom-[32%] left-[43%] h-[95px] w-[2px] bg-[#4D416E]/20" />
        <div className="absolute bottom-[32%] left-[43%] h-[2px] w-[95px] origin-left rotate-[32deg] bg-[#4D416E]/20" />

        {/* BUYER CONTAINER */}
        <div
          className="absolute bottom-[17%] left-[7%] h-[230px] w-[280px] origin-bottom-left overflow-hidden rounded-[9px] border border-white/20 shadow-[0_32px_55px_rgba(35,27,73,0.30)]"
          style={{
            transform: "perspective(850px) rotateY(13deg) rotateX(1deg)",
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#182C85_0%,#3C42C7_45%,#6958ED_100%)]" />

          {/* container ridges */}
          <div className="absolute inset-0 flex justify-evenly opacity-25">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-full w-[3px] bg-white shadow-[4px_0_7px_rgba(0,0,0,0.25)]"
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[12px] bg-[#1D266D]/50" />

          <div className="absolute bottom-[20px] left-[18px] text-[10px] font-semibold tracking-[0.18em] text-white/55">
            ACME · BUYER
          </div>
        </div>

        {/* SUPPLIER CONTAINER */}
        <div
          className="absolute bottom-[19%] right-[2%] h-[250px] w-[295px] origin-bottom-right overflow-hidden rounded-[9px] border border-white/20 shadow-[0_32px_55px_rgba(73,30,68,0.28)]"
          style={{
            transform: "perspective(850px) rotateY(-13deg) rotateX(1deg)",
          }}
        >
          <div className="absolute inset-0 bg-[linear-gradient(135deg,#C43B8A_0%,#EF599D_44%,#FF86B9_100%)]" />

          <div className="absolute inset-0 flex justify-evenly opacity-25">
            {Array.from({ length: 10 }).map((_, index) => (
              <div
                key={index}
                className="h-full w-[3px] bg-white shadow-[4px_0_7px_rgba(0,0,0,0.20)]"
              />
            ))}
          </div>

          <div className="absolute bottom-0 left-0 right-0 h-[12px] bg-[#A52F75]/45" />

          <div className="absolute bottom-[20px] right-[18px] text-[10px] font-semibold tracking-[0.18em] text-white/55">
            NOVA · SUPPLIER
          </div>
        </div>

        {/* Container floor shadows */}
        <div className="absolute bottom-[12%] left-[9%] h-[28px] w-[275px] rounded-full bg-[#262052]/30 blur-[15px]" />
        <div className="absolute bottom-[13%] right-[4%] h-[28px] w-[285px] rounded-full bg-[#63334F]/25 blur-[15px]" />

        {/* Violet connection arc */}
        <svg
          className="pointer-events-none absolute left-[30%] top-[30%] h-[250px] w-[290px] overflow-visible"
          viewBox="0 0 290 250"
          fill="none"
        >
          <path
            d="M15 30C80 90 65 180 145 195C214 207 218 140 275 95"
            stroke="url(#violetLine)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient
              id="violetLine"
              x1="15"
              y1="30"
              x2="275"
              y2="95"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#7057FF" stopOpacity="0.25" />
              <stop offset="0.45" stopColor="#7057FF" />
              <stop offset="1" stopColor="#FF66B5" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>

        {/* Pink connection arc */}
        <svg
          className="pointer-events-none absolute right-[5%] top-[31%] h-[230px] w-[260px] overflow-visible"
          viewBox="0 0 260 230"
          fill="none"
        >
          <path
            d="M245 25C195 70 210 145 135 175C95 192 52 180 15 150"
            stroke="url(#pinkLine)"
            strokeWidth="3"
            strokeLinecap="round"
          />

          <defs>
            <linearGradient
              id="pinkLine"
              x1="245"
              y1="25"
              x2="15"
              y2="150"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#FF69B6" stopOpacity="0.3" />
              <stop offset="0.45" stopColor="#FF69B6" />
              <stop offset="1" stopColor="#795DFF" stopOpacity="0.5" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* EVIDENCE CARD */}
      <div className="absolute left-[1%] top-[7%] z-20 w-[245px] rounded-[20px] border border-[#7762FF]/15 bg-white/95 p-4 shadow-[0_18px_50px_rgba(51,38,96,0.16)] backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[12px] bg-[#EEEAFE] text-[#654DFF]">
            <span className="text-lg">▤</span>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.13em] text-[#645E76]">
              EVIDENCE ANALYZED
            </p>

            <p className="mt-1 text-[13px] font-semibold text-[#1C1732]">
              4 sources · 2 discrepancies
            </p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <div className="h-[50px] flex-1 rounded-[8px] border border-[#E5E1EC] bg-[#FAF9FC] p-2">
            <div className="h-[4px] w-[55%] rounded-full bg-[#59536B]/25" />
            <div className="mt-2 h-[3px] w-[82%] rounded-full bg-[#59536B]/15" />
            <div className="mt-1.5 h-[3px] w-[68%] rounded-full bg-[#59536B]/15" />
            <div className="mt-1.5 h-[3px] w-[76%] rounded-full bg-[#59536B]/15" />
          </div>

          <div className="relative h-[50px] flex-1 overflow-hidden rounded-[8px] bg-[linear-gradient(145deg,#7F79A5,#DAB1C6)]">
            <div className="absolute bottom-0 left-0 h-[20px] w-full bg-[#50466E]/25" />
            <div className="absolute bottom-[9px] left-[12px] h-[16px] w-[33px] rounded-[2px] bg-[#6E5FE0]/60" />
            <div className="absolute bottom-[9px] right-[11px] h-[18px] w-[35px] rounded-[2px] bg-[#E35A9E]/60" />
          </div>

          <div className="flex h-[50px] w-[42px] items-center justify-center rounded-[8px] border border-[#E5E1EC] bg-[#FAF9FC] text-xs font-semibold text-[#6D667A]">
            +2
          </div>
        </div>
      </div>

      {/* AI NEGOTIATION CARD */}
      <div className="absolute right-[0%] top-[12%] z-20 w-[225px] rounded-[20px] border border-[#FF66B5]/20 bg-white/95 p-4 shadow-[0_18px_50px_rgba(114,45,95,0.15)] backdrop-blur-xl">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] bg-[#FDEAF5] font-bold text-[#E44C9A]">
            ↔
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-[0.13em] text-[#645E76]">
              AI NEGOTIATION
            </p>

            <p className="mt-1 text-[11px] text-[#6D6778]">
              Proposed settlement
            </p>

            <p className="mt-1 text-[24px] font-bold tracking-[-0.04em] text-[#171332]">
              $15,930.00
            </p>
          </div>
        </div>
      </div>

      {/* PAYPAL HUB */}
      <div className="absolute left-[50%] top-[41%] z-30 flex h-[115px] w-[115px] -translate-x-1/2 items-center justify-center rounded-[28px] border border-[#745BFF]/15 bg-white shadow-[0_20px_60px_rgba(90,67,221,0.25),0_0_80px_rgba(255,100,181,0.12)]">
        <div className="relative h-[65px] w-[62px]">
          <span className="absolute left-[11px] top-0 text-[54px] font-extrabold leading-none text-[#173B8F]">
            P
          </span>

          <span className="absolute left-[21px] top-[8px] text-[54px] font-extrabold leading-none text-[#168BD2] opacity-90">
            P
          </span>
        </div>
      </div>

      {/* BUYER CARD */}
      <div className="absolute bottom-[18%] left-[2%] z-20 flex w-[210px] items-center gap-3 rounded-[18px] border border-[#715BFF]/15 bg-white/95 p-3.5 shadow-[0_16px_40px_rgba(39,32,82,0.15)] backdrop-blur-xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(145deg,#D6D0FF,#8D80E8)] text-sm font-bold text-white">
          AM
        </div>

        <div>
          <p className="text-[9px] font-bold tracking-[0.14em] text-[#726B80]">
            BUYER
          </p>

          <p className="mt-1 text-[13px] font-semibold text-[#201A37]">
            Acme Manufacturing
          </p>
        </div>
      </div>

      {/* SUPPLIER CARD */}
      <div className="absolute bottom-[20%] right-[1%] z-20 flex w-[205px] items-center gap-3 rounded-[18px] border border-[#FF66B5]/20 bg-white/95 p-3.5 shadow-[0_16px_40px_rgba(88,38,73,0.14)] backdrop-blur-xl">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[linear-gradient(145deg,#FFD4E9,#E774AC)] text-sm font-bold text-white">
          NP
        </div>

        <div>
          <p className="text-[9px] font-bold tracking-[0.14em] text-[#726B80]">
            SUPPLIER
          </p>

          <p className="mt-1 text-[13px] font-semibold text-[#201A37]">
            Nova Packaging
          </p>
        </div>
      </div>

      {/* PAYMENT COMPLETE */}
      <div className="absolute bottom-[4%] left-[50%] z-30 flex w-[250px] -translate-x-1/2 items-center gap-3 rounded-[18px] border border-[#42B879]/20 bg-white/95 p-3.5 shadow-[0_18px_45px_rgba(42,128,81,0.14)] backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E7F7EE] text-sm font-bold text-[#24965E]">
          ✓
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-[0.13em] text-[#4C735E]">
            PAYMENT EXECUTED
          </p>

          <p className="mt-1 text-[12px] font-medium text-[#655F70]">
            securely via PayPal
          </p>
        </div>
      </div>
    </div>
  );
}