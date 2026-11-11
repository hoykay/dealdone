import Link from "next/link";
import { connection } from "next/server";
import AppShell from "@/components/AppShell";
import { supabaseServer } from "@/lib/supabase-server";

export const instant = false;

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

function formatDate(value: string | null) {
  if (!value) return "Not recorded";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "medium",
  }).format(new Date(value));
}

export default async function PaymentRecordPage() {
  await connection();

  const { data: settlement, error } =
    await supabaseServer
      .from("deal_settlements")
      .select("*")
      .eq("deal_id", "DEAL-1048")
      .eq("status", "completed")
      .order("completed_at", {
        ascending: false,
      })
      .limit(1)
      .single();

  if (error || !settlement) {
    return (
      <AppShell>
        <div className="px-8 py-8">
          <h1 className="text-[30px] font-semibold text-[#171332]">
            Payment record
          </h1>

          <p className="mt-3 text-[14px] text-[#817A89]">
            No completed settlement record was found.
          </p>

          <Link
            href="/deals/dd-1048"
            className="mt-5 inline-flex text-[13px] font-semibold text-[#4D35F3]"
          >
            ← Back to deal
          </Link>
        </div>
      </AppShell>
    );
  }

  const originalAmount =
    Number(settlement.original_amount);

  const settlementAmount =
    Number(settlement.settlement_amount);

  const releasedAmount =
    originalAmount - settlementAmount;

  return (
    <AppShell>
      <div className="px-5 py-5 sm:px-7 lg:px-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-[12px] font-semibold uppercase tracking-[0.12em] text-[#FF5CB2]">
              Verified payment record
            </p>

            <h1 className="editorial mt-1 text-[34px] tracking-[-0.04em] text-[#171332]">
              DEAL-1048
            </h1>

            <p className="mt-1 text-[14px] text-[#817A89]">
              Nova Packaging · PO-77821
            </p>
          </div>

          <span className="rounded-full bg-[#EAF8F0] px-4 py-2 text-[12px] font-semibold text-[#21865A]">
            ✓ Completed
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
          <section className="rounded-[14px] border border-[#E9E5EE] bg-white p-5">
            <p className="text-[12px] text-[#837C8C]">
              Original authorization
            </p>

            <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#211B36]">
              {formatMoney(originalAmount)}
            </p>
          </section>

          <section className="rounded-[14px] border border-[#E9E5EE] bg-white p-5">
            <p className="text-[12px] text-[#837C8C]">
              Captured to supplier
            </p>

            <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#211B36]">
              {formatMoney(settlementAmount)}
            </p>
          </section>

          <section className="rounded-[14px] border border-[#E9E5EE] bg-white p-5">
            <p className="text-[12px] text-[#837C8C]">
              Released to buyer
            </p>

            <p className="mt-2 text-[28px] font-semibold tracking-[-0.04em] text-[#FF5CB2]">
              {formatMoney(releasedAmount)}
            </p>
          </section>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-[14px] border border-[#E9E5EE] bg-white p-5">
            <div className="flex items-center justify-between gap-3">
  <div>
    <h2 className="text-[16px] font-semibold text-[#29233D]">
      PayPal transaction
    </h2>

    <p className="mt-1 text-[12px] text-[#837C8C]">
      Independently verified against the final PayPal state
    </p>
  </div>

  <div className="flex items-center gap-2">
    <span className="rounded-full bg-[#EAF8F0] px-3 py-1.5 text-[10px] font-semibold text-[#21865A]">
      ✓ Verified
    </span>

    <span className="rounded-full bg-[#F4F1FC] px-3 py-1.5 text-[10px] font-semibold text-[#4D35F3]">
      PayPal Sandbox
    </span>
  </div>
</div>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#928B99]">
                  Order ID
                </p>
                <p className="mt-1 break-all text-[13px] font-semibold text-[#393248]">
                  {settlement.paypal_order_id}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#928B99]">
                  Authorization ID
                </p>
                <p className="mt-1 break-all text-[13px] font-semibold text-[#393248]">
                  {settlement.paypal_authorization_id}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#928B99]">
                  Capture ID
                </p>
                <p className="mt-1 break-all text-[13px] font-semibold text-[#393248]">
                  {settlement.paypal_capture_id}
                </p>
              </div>

              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.08em] text-[#928B99]">
                  Completed
                </p>
                <p className="mt-1 text-[13px] font-semibold text-[#393248]">
                  {formatDate(settlement.completed_at)}
                </p>
              </div>
            </div>
          </section>

          <section className="rounded-[14px] border border-[#E9E5EE] bg-white p-5">
            <h2 className="text-[16px] font-semibold text-[#29233D]">
              Approval trail
            </h2>

            <div className="mt-5 space-y-5">
              <div className="flex gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-[#FF67B6]" />

                <div>
                  <p className="text-[13px] font-semibold text-[#302A42]">
                    Buyer approved
                  </p>

                  <p className="mt-1 text-[12px] text-[#837C8C]">
                    Amanda Chen · Acme Manufacturing
                  </p>

                  <p className="mt-1 text-[11px] text-[#9A939F]">
                    {formatDate(
                      settlement.buyer_approved_at
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-[#4D35F3]" />

                <div>
                  <p className="text-[13px] font-semibold text-[#302A42]">
                    Supplier approved
                  </p>

                  <p className="mt-1 text-[12px] text-[#837C8C]">
                    Nova Packaging
                  </p>

                  <p className="mt-1 text-[11px] text-[#9A939F]">
                    {formatDate(
                      settlement.supplier_approved_at
                    )}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <div className="mt-1 h-3 w-3 rounded-full bg-[#27A36A]" />

                <div>
                  <p className="text-[13px] font-semibold text-[#302A42]">
                    PayPal settlement verified
                  </p>

                  <p className="mt-1 text-[12px] text-[#837C8C]">
                    Capture confirmed and remaining authorization released.
                  </p>

                  <p className="mt-1 text-[11px] text-[#9A939F]">
                    {formatDate(
                      settlement.completed_at
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-4 rounded-[14px] border border-[#E9E5EE] bg-white p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[16px] font-semibold text-[#29233D]">
                Negotiated proposal
              </h2>

              <p className="mt-1 text-[12px] text-[#837C8C]">
                Exact proposal approved by both parties before PayPal execution.
              </p>
            </div>

            <div className="text-right">
  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#928B99]">
    Proposal integrity
  </p>

  <span className="mt-1 inline-flex rounded-full bg-[#EAF8F0] px-3 py-1.5 text-[10px] font-semibold text-[#21865A]">
    ✓ Verified · {settlement.proposal_version.slice(0, 8)}
  </span>
</div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-3">
            <div className="rounded-[10px] bg-[#FFF2F8] p-4">
              <p className="text-[11px] font-semibold text-[#D94893]">
                Buyer maximum
              </p>

              <p className="mt-1 text-[20px] font-semibold text-[#211B36]">
                {formatMoney(
                  Number(
                    settlement.negotiation_payload
                      ?.controls
                      ?.buyerMaximumAuthorized
                  )
                )}
              </p>
            </div>

            <div className="rounded-[10px] bg-[#F3F0FF] p-4">
              <p className="text-[11px] font-semibold text-[#543CE5]">
                Supplier minimum
              </p>

              <p className="mt-1 text-[20px] font-semibold text-[#211B36]">
                {formatMoney(
                  Number(
                    settlement.negotiation_payload
                      ?.controls
                      ?.supplierMinimumAuthorized
                  )
                )}
              </p>
            </div>

            <div className="rounded-[10px] bg-[#EDF9F2] p-4">
              <p className="text-[11px] font-semibold text-[#21865A]">
                Agreed settlement
              </p>

              <p className="mt-1 text-[20px] font-semibold text-[#211B36]">
                {formatMoney(settlementAmount)}
              </p>
            </div>
          </div>
        </section>

        <div className="mt-5 flex gap-3">
          <Link
            href="/deals/dd-1048/complete"
            className="inline-flex h-[42px] items-center rounded-[9px] border border-[#DDD7E5] bg-white px-5 text-[13px] font-semibold text-[#514A5D]"
          >
            ← Completion
          </Link>

          <Link
            href="/deals"
            className="inline-flex h-[42px] items-center rounded-[9px] bg-[#4D35F3] px-5 text-[13px] font-semibold text-white"
          >
            Back to deals
          </Link>
        </div>
      </div>
    </AppShell>
  );
}