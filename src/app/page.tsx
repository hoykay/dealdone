import HeroVisual from "@/components/HeroVisual";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F9F8FC] text-[#171332]">
      {/* Header */}
      <header className="relative z-30 border-b border-[#EAE7F2] bg-white/95">
        <div className="mx-auto flex h-[82px] max-w-[1360px] items-center justify-between px-8">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#6047FF] text-sm font-bold text-white">
              D
            </div>

            <span className="text-[21px] font-semibold tracking-[-0.04em] text-[#171332]">
              DealDone
            </span>
          </a>

          {/* Navigation */}
          <nav className="hidden items-center gap-10 text-[14px] font-medium text-[#615D72] lg:flex">
            <a href="#product" className="transition hover:text-[#171332]">
              Product
            </a>

            <a href="#use-cases" className="transition hover:text-[#171332]">
              Use cases
            </a>

            <a href="#integrations" className="transition hover:text-[#171332]">
              Integrations
            </a>

            <a href="#resources" className="transition hover:text-[#171332]">
              Resources
            </a>
          </nav>

          {/* Login */}
          <a
            href="/deals"
            className="text-[14px] font-medium text-[#4F4A61] transition hover:text-[#171332]"
          >
            Log in
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="relative">
        {/* Background atmosphere */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-[-180px] top-[80px] h-[420px] w-[420px] rounded-full bg-[#C9C2FF]/25 blur-[100px]"
        />

        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-[-120px] top-[170px] h-[420px] w-[420px] rounded-full bg-[#FFB5DA]/20 blur-[110px]"
        />

        <div className="mx-auto grid min-h-[760px] max-w-[1360px] grid-cols-1 items-center gap-10 px-8 py-12 lg:grid-cols-[0.84fr_1.16fr]">
          {/* Left */}
          <div className="relative z-10 max-w-[570px]">
            {/* Badge */}
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#E2DDEA] bg-white px-4 py-2 text-[13px] font-medium text-[#655F73] shadow-[0_5px_20px_rgba(37,29,70,0.05)]">
              <span className="h-2 w-2 rounded-full bg-[#FF66B2]" />
              AI-powered dispute resolution
            </div>

            {/* Headline */}
            <h1 className="editorial text-[64px] leading-[0.98] tracking-[-0.055em] text-[#171332] xl:text-[70px]">
              When supply chain
              <br />
              deals go wrong,
              <span className="mt-1 block text-[#FF67B6]">
                DealDone makes
                <br />
                them right.
              </span>
            </h1>

            {/* Description */}
            <p className="mt-7 max-w-[540px] text-[17px] leading-[1.65] text-[#625E70]">
              Evidence-backed AI helps buyers and suppliers resolve disputed
              deliveries, agree on fair terms, and execute the final settlement
              securely through PayPal.
            </p>

            {/* CTA */}
            <div className="mt-8">
              <a
                href="#product"
                className="inline-flex h-[52px] items-center justify-center gap-3 rounded-[10px] border border-[#D7D2E0] bg-white px-6 text-[14px] font-semibold text-[#211C37] shadow-[0_4px_14px_rgba(41,31,76,0.04)] transition hover:-translate-y-[1px] hover:border-[#BBB2D1] hover:shadow-[0_8px_22px_rgba(41,31,76,0.08)]"
              >
                See how it works
                <span aria-hidden="true">↓</span>
              </a>
            </div>

            {/* Benefits */}
            <div className="mt-10 flex flex-wrap gap-x-8 gap-y-4">
              <div className="flex items-center gap-2.5 text-[14px] text-[#686375]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EEEAFE] text-[12px] font-bold text-[#654DFF]">
                  ✓
                </span>
                Evidence-backed
              </div>

              <div className="flex items-center gap-2.5 text-[14px] text-[#686375]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FDEAF4] text-[12px] font-bold text-[#DB4E98]">
                  ↔
                </span>
                Faster resolution
              </div>

              <div className="flex items-center gap-2.5 text-[14px] text-[#686375]">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#EAF8F0] text-[12px] font-bold text-[#24965E]">
                  ✓
                </span>
                PayPal settlement
              </div>
            </div>
          </div>

          {/* Right visual */}
          <div
            id="product"
            className="relative z-10 flex min-w-0 items-center justify-center"
          >
            <HeroVisual />
          </div>
        </div>
      </section>
    </main>
  );
}