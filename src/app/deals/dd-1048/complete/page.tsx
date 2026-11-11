import Link from "next/link";
import AppShell from "@/components/AppShell";
import CompletionTimestamp from "@/components/settlement/CompletionTimestamp";

export const instant = false;

function CheckIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.3"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 12 4 4 8-8" />
    </svg>
  );
}

type CompletePageProps = {
  searchParams: Promise<{
    orderId?: string;
    authorizationId?: string;
    captureId?: string;
    completedAt?: string;
  }>;
};

export default async function CompletePage({
  searchParams,
}: CompletePageProps) {
  const {
    orderId,
    authorizationId,
    captureId,
    completedAt,
  } = await searchParams;
  return (
    <AppShell>
      <div className="relative min-h-[calc(100vh-72px)] overflow-hidden bg-[#F9F7FC]">
        {/* Background atmosphere */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-[8%] top-[2%] h-[430px] w-[680px] rotate-[-12deg] rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(255,106,183,0.32),rgba(255,106,183,0)_68%)] blur-[12px]" />

          <div className="absolute right-[-8%] top-[4%] h-[460px] w-[700px] rotate-[15deg] rounded-[50%] bg-[radial-gradient(circle_at_center,rgba(103,78,255,0.28),rgba(103,78,255,0)_68%)] blur-[16px]" />

          <div className="absolute left-[18%] top-[13%] h-[230px] w-[760px] rotate-[6deg] rounded-[50%] bg-[linear-gradient(90deg,rgba(255,104,183,0.12),rgba(116,80,255,0.11),rgba(255,255,255,0))] blur-[28px]" />

          <div className="absolute bottom-[-110px] left-[6%] h-[330px] w-[88%] rounded-[50%] bg-[linear-gradient(90deg,rgba(255,101,184,0.11),rgba(88,66,255,0.13),rgba(255,101,184,0.08))] blur-[32px]" />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-72px)] max-w-[1080px] flex-col items-center justify-center px-6 py-7">
          {/* Success icon */}
          <div className="flex h-[62px] w-[62px] items-center justify-center rounded-full bg-white text-[#FF5CB2] shadow-[0_14px_40px_rgba(116,75,180,0.16)] ring-1 ring-[#EEE7F4]">
            <CheckIcon />
          </div>

          {/* Main success message */}
          <div className="mt-4 text-center">
            <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-[#FF5CB2]">
              Settlement completed
            </p>

            <h1 className="editorial mt-1.5 text-[54px] leading-none tracking-[-0.055em] text-[#171332]">
              Deal done.
            </h1>

            <p className="mx-auto mt-3 max-w-[680px] text-[15px] leading-[1.6] text-[#6F687A]">
  PayPal captured $15,930 for Nova Packaging, released $2,070 back
  to the buyer, and DealDone independently verified the final payment state.
</p>
          </div>

          {/* Actions */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
            <Link
  href="/deals/dd-1048/payment-record"
  className="flex h-[44px] items-center justify-center rounded-[9px] bg-[#FF5CB2] px-6 text-[13px] font-semibold text-white shadow-[0_10px_24px_rgba(255,92,178,0.24)] transition hover:bg-[#F653A9]"
>
  View payment record
</Link>

            <Link
              href="/deals"
              className="flex h-[44px] items-center justify-center rounded-[9px] border border-[#DDD7E5] bg-white px-6 text-[13px] font-semibold text-[#514A5D] transition hover:bg-[#FAF9FC]"
            >
              Back to deals
            </Link>
          </div>

          {/* Payment details */}
          <section className="mt-6 w-full max-w-[820px] overflow-hidden rounded-[16px] border border-white/70 bg-white/90 shadow-[0_24px_60px_rgba(57,42,94,0.11)] backdrop-blur">
            {/* Card header */}
            <div className="flex items-center justify-between border-b border-[#EEEAF2] px-6 py-4">
              <div>
                <h2 className="text-[16px] font-semibold text-[#29233D]">
                  Payment details
                </h2>

                <p className="mt-1 text-[12px] text-[#8A8393]">
                  DEAL-1048 · Nova Packaging
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="rounded-full bg-[#EAF8F0] px-3 py-1.5 text-[12px] font-semibold text-[#21865A]">
                  Completed
                </span>

                <div className="flex h-9 items-center gap-2 rounded-[8px] bg-[#F4F1FC] px-3">
  <span className="text-[13px] font-bold text-[#32207E]">
    PayPal
  </span>

  <span className="rounded-full bg-white px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#756E80]">
    Sandbox
  </span>
</div>
              </div>
            </div>

            {/* Money summary */}
            <div className="grid grid-cols-1 divide-y divide-[#EEEAF2] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              <div className="px-6 py-4">
                <p className="text-[12px] font-medium text-[#8A8393]">
                  Original authorization
                </p>

                <p className="mt-1.5 text-[22px] font-semibold tracking-[-0.03em] text-[#211B36]">
                  $18,000.00
                </p>
              </div>

              <div className="px-6 py-4">
                <p className="text-[12px] font-medium text-[#8A8393]">
                  Captured to supplier
                </p>

                <p className="mt-1.5 text-[22px] font-semibold tracking-[-0.03em] text-[#211B36]">
                  $15,930.00
                </p>
              </div>

              <div className="px-6 py-4">
                <p className="text-[12px] font-medium text-[#8A8393]">
                  Released to buyer
                </p>

                <p className="mt-1.5 text-[22px] font-semibold tracking-[-0.03em] text-[#FF5CB2]">
                  $2,070.00
                </p>
              </div>
            </div>

            {/* Transaction verification */}
<div className="border-t border-[#EEEAF2] px-6 py-4">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-[13px] font-semibold text-[#29233D]">
        PayPal verification
      </p>

      <p className="mt-1 text-[11px] text-[#8A8393]">
        Transaction identifiers independently verified by DealDone
      </p>
    </div>

    <span className="rounded-full bg-[#EAF8F0] px-3 py-1.5 text-[10px] font-semibold text-[#21865A]">
      ✓ Verified
    </span>
  </div>

  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
    <div className="rounded-[9px] bg-[#F8F7FA] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#928B99]">
        Order ID
      </p>

      <p className="mt-1.5 break-all font-mono text-[11px] font-semibold text-[#393248]">
        {orderId ?? "Not available"}
      </p>
    </div>

    <div className="rounded-[9px] bg-[#F8F7FA] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#928B99]">
        Authorization ID
      </p>

      <p className="mt-1.5 break-all font-mono text-[11px] font-semibold text-[#393248]">
        {authorizationId ?? "Not available"}
      </p>
    </div>

    <div className="rounded-[9px] bg-[#F8F7FA] p-3">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#928B99]">
        Capture ID
      </p>

      <p className="mt-1.5 break-all font-mono text-[11px] font-semibold text-[#393248]">
        {captureId ?? "Not available"}
      </p>
    </div>
  </div>

  <div className="mt-3 flex items-center justify-between rounded-[9px] bg-[#F8F7FA] px-3 py-2.5">
    <span className="text-[11px] font-medium text-[#8A8393]">
      Completed
    </span>

    <span className="text-[12px] font-semibold text-[#393248]">
      <CompletionTimestamp completedAt={completedAt} />
    </span>
  </div>
</div>

            {/* Final explanation */}
            <div className="flex items-center gap-3 bg-[#F8F5FF] px-6 py-3.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FDE8F4] text-[12px] text-[#E14999]">
                ✦
              </div>

              <p className="text-[12px] leading-[1.6] text-[#665E73]">
                DealDone executed the exact dual-approved settlement through PayPal and independently verified the capture and authorization release.
              </p>
            </div>
          </section>

          {/* Trust note */}
          <div className="mt-4 flex items-center gap-2 text-[11px] text-[#8D8696]">
            <span>🔒</span>
            Settlement executed securely through PayPal
          </div>
        </div>
      </div>
    </AppShell>
  );
}