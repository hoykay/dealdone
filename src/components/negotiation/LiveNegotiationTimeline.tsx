"use client";

import { useEffect, useState } from "react";

type NegotiationRound = {
  round: number;

  buyer: {
    amount: number;
    type: string;
    reasoning?: string;
    constraint?: string;
    citations?: {
      sourceId: string;
      sourceLine: string;
    }[];
  };

  supplier: {
    amount: number;
    type: string;
    reasoning?: string;
    constraint?: string;
    citations?: {
      sourceId: string;
      sourceLine: string;
    }[];
  };
};

type NegotiationResult = {
  success: boolean;
  resolved: boolean;

  negotiation?: {
    rounds: NegotiationRound[];

    agreement: {
      reached: boolean;
      amount: number;
      round: number;
    };
  };

  nextStage?: {
    status: string;
    settlementAmount: number;
  };

  error?: string;
};

function formatMoney(value: number) {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  });
}

export default function LiveNegotiationTimeline() {
  const [result, setResult] =
    useState<NegotiationResult | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    async function runNegotiation() {
      try {
        const response = await fetch("/api/ai/negotiate", {
          method: "POST",
        });

        const data =
          (await response.json()) as NegotiationResult;

        if (!response.ok || !data.success) {
          throw new Error(
            data.error || "Negotiation failed."
          );
        }

        setResult(data);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not run negotiation."
        );
      } finally {
        setLoading(false);
      }
    }

    runNegotiation();
  }, []);

  if (loading) {
    return (
      <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#29233D]">
            Agent negotiation
          </h2>

          <span className="rounded-full bg-[#F3EEFF] px-2.5 py-1 text-[11px] font-semibold text-[#5D43E8]">
            Running agents…
          </span>
        </div>

        <p className="mt-4 text-[12px] text-[#817A89]">
          Buyer and supplier agents are negotiating within their authorized mandates.
        </p>
      </section>
    );
  }

  if (error || !result?.negotiation) {
    return (
      <section className="rounded-[12px] border border-[#F0D7DF] bg-white p-4">
        <h2 className="text-[16px] font-semibold text-[#29233D]">
          Agent negotiation
        </h2>

        <p className="mt-3 text-[12px] text-[#B24E6B]">
          {error || "Negotiation data unavailable."}
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[12px] border border-[#E9E5EE] bg-white p-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[16px] font-semibold text-[#29233D]">
            Agent negotiation
          </h2>

          <p className="mt-1 text-[12px] text-[#8A8493]">
            Buyer and supplier AI agents negotiate within evidence-backed mandates
          </p>
        </div>

        <span className="rounded-full bg-[#EAF8F0] px-2.5 py-1 text-[11px] font-semibold text-[#21865A]">
          ✓ Agreement reached
        </span>
      </div>

      <div className="mt-5 space-y-4">
        {result.negotiation.rounds.map((round) => (
          <div
            key={round.round}
            className="rounded-[11px] border border-[#EEEAF2] bg-[#FCFBFD] p-3"
          >
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#8A8392]">
                Round {round.round}
              </p>

              {round.round ===
                result.negotiation?.agreement.round && (
                <span className="text-[11px] font-semibold text-[#21865A]">
                  Agreement
                </span>
              )}
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div className="rounded-[9px] bg-[#FFF1F8] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-[#D94893]">
                    Buyer agent
                  </p>

                  <p className="text-[16px] font-bold text-[#171332]">
                    {formatMoney(round.buyer.amount)}
                  </p>
                </div>

                <p className="mt-1 text-[11px] text-[#8A7180]">
                  {round.buyer.type}
                </p>

                {round.buyer.reasoning && (
  <p className="mt-2 text-[12px] leading-[1.5] text-[#6F687A]">
    {round.buyer.reasoning}
  </p>
)}

                {round.buyer.constraint && (
                  <p className="mt-2 text-[11px] font-medium text-[#B15B85]">
                    {round.buyer.constraint}
                  </p>
                )}
              </div>

              <div className="rounded-[9px] bg-[#F2EFFF] p-3">
                <div className="flex items-center justify-between">
                  <p className="text-[12px] font-semibold text-[#543CE5]">
                    Supplier agent
                  </p>

                  <p className="text-[16px] font-bold text-[#171332]">
                    {formatMoney(round.supplier.amount)}
                  </p>
                </div>

                <p className="mt-1 text-[11px] text-[#777088]">
                  {round.supplier.type}
                </p>

                {round.supplier.reasoning && (
  <p className="mt-2 text-[12px] leading-[1.5] text-[#6F687A]">
    {round.supplier.reasoning}
  </p>
)}

                {round.supplier.constraint && (
                  <p className="mt-2 text-[11px] font-medium text-[#6354AE]">
                    {round.supplier.constraint}
                  </p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-[11px] bg-[#171332] px-4 py-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#BEB8D1]">
              Negotiated agreement
            </p>

            <p className="mt-1 text-[12px] text-[#D8D3E5]">
              Pending dual human approval
            </p>
          </div>

          <p className="text-[22px] font-semibold text-white">
            {formatMoney(
              result.negotiation.agreement.amount
            )}
          </p>
        </div>
      </div>
    </section>
  );
}