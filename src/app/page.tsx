import HeroVisual from "@/components/HeroVisual";

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#F9F8FC] text-[#171332]">
      {/* Header */}
      <header className="relative z-30 border-b border-[#EAE7F2] bg-white/95">
        <div className="mx-auto flex h-[82px] max-w-[1360px] items-center justify-between px-8">
          {/* Logo */}
          <a href="/" className="flex items-center">
  <img
    src="/dealdone-logo.png"
    alt="DealDone"
    className="h-[58px] w-auto object-contain"
  />
</a>

          {/* Login */}
          <a
            href="/login"
className="text-[16px] font-semibold text-[#4F4A61] transition hover:text-[#171332]"          >
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

<div className="mx-auto grid min-h-[760px] max-w-[1360px] grid-cols-1 items-center gap-10 px-8 py-12 lg:grid-cols-[0.96fr_1.04fr]">          {/* Left */}
<div className="relative z-10 max-w-[610px]">
  <div className="mb-7 inline-flex items-center gap-2 rounded-full bg-[#F2EEFF] px-4 py-2 text-[13px] font-semibold text-[#6047FF]">
    <span className="text-[15px]">✦</span>
    AI-powered dispute resolution
  </div>

<h1 className="text-[44px] font-semibold leading-[1.04] tracking-[-0.05em] text-[#171332] xl:text-[48px]">
  <span className="block">When deals go wrong,</span>

  <span className="mt-2 block whitespace-nowrap">
    <span className="text-[#6047FF]">DealDone</span> makes them{" "}
    <span className="text-[#F04492]">right.</span>
  </span>
</h1>

  <p className="mt-7 max-w-[570px] text-[18px] leading-[1.55] text-[#625E70]">
    Resolve commercial disputes with evidence-backed AI and settle securely
    through PayPal.
  </p>

  <div className="mt-9">
    <a
      href="/deals/dd-1048"
      className="inline-flex h-[54px] items-center justify-center gap-4 rounded-[10px] bg-[#6047FF] px-7 text-[15px] font-semibold text-white shadow-[0_10px_30px_rgba(96,71,255,0.20)] transition hover:-translate-y-[1px] hover:bg-[#5339F5]"
    >
      Open demo case
      <span aria-hidden="true">→</span>
    </a>
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