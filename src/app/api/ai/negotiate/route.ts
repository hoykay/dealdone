import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";


type BuyerAgentResponse = {
  success: boolean;
  agent: {
    role: string;
    party: string;
  };
  mandate: {
    preferredAmount: number;
    maximumAuthorizedAmount: number;
  };
  proposal: {
    proposedAmount: number;
    reasoning: string;
    citations: {
      sourceId: string;
      sourceLine: string;
    }[];
  };
};

type SupplierAgentResponse = {
  success: boolean;
  agent: {
    role: string;
    party: string;
  };
  mandate: {
    preferredAmount: number;
    minimumAuthorizedAmount: number;
  };
  proposal: {
    proposedAmount: number;
    reasoning: string;
    citations: {
      sourceId: string;
      sourceLine: string;
    }[];
  };
};

function money(value: number) {
  return Math.round(value * 100) / 100;
}

export async function POST(request: Request) {
  try {
    const origin = new URL(request.url).origin;

    /*
     * STEP 1
     * Run the two independent negotiation agents.
     */
    const [buyerResponse, supplierResponse] = await Promise.all([
      fetch(`${origin}/api/ai/buyer-agent`, {
        method: "POST",
        cache: "no-store",
      }),

      fetch(`${origin}/api/ai/supplier-agent`, {
        method: "POST",
        cache: "no-store",
      }),
    ]);

    const buyer =
      (await buyerResponse.json()) as BuyerAgentResponse;

    const supplier =
      (await supplierResponse.json()) as SupplierAgentResponse;

    if (!buyerResponse.ok || !buyer.success) {
      throw new Error("Buyer negotiation agent failed.");
    }

    if (!supplierResponse.ok || !supplier.success) {
      throw new Error("Supplier negotiation agent failed.");
    }

    /*
     * STEP 2
     * Read each agent's hard authorization boundary.
     *
     * These boundaries come from DealDone code,
     * not from the AI's discretion.
     */
    const buyerMaximum =
      buyer.mandate.maximumAuthorizedAmount;

    const supplierMinimum =
      supplier.mandate.minimumAuthorizedAmount;

    /*
     * STEP 3
     * Check whether the mandates overlap.
     */
    if (buyerMaximum < supplierMinimum) {
      return NextResponse.json({
        success: true,
        resolved: false,

        reason:
          "The buyer and supplier mandates do not currently overlap.",

        buyer: {
          openingProposal: buyer.proposal.proposedAmount,
          maximumAuthorizedAmount: buyerMaximum,
        },

        supplier: {
          openingProposal: supplier.proposal.proposedAmount,
          minimumAuthorizedAmount: supplierMinimum,
        },

        nextAction:
          "Human approval is required to expand one or both negotiation mandates.",
      });
    }

    /*
     * STEP 4
     * Build bounded concessions.
     *
     * Each side moves toward its authorization boundary,
     * but DealDone never allows the agent to cross it.
     */

    const buyerOpening = buyer.proposal.proposedAmount;
    const supplierOpening = supplier.proposal.proposedAmount;

    const buyerCounter = money(
      Math.min(
        buyerMaximum,
        buyerOpening + (buyerMaximum - buyerOpening) / 2
      )
    );

    const supplierCounter = money(
      Math.max(
        supplierMinimum,
        supplierOpening -
          (supplierOpening - supplierMinimum) / 2
      )
    );

    /*
     * STEP 5
     * Final authorized offers.
     */
    const buyerFinal = money(buyerMaximum);
    const supplierFinal = money(supplierMinimum);

    /*
     * STEP 6
     * Agreement exists only if both authorized positions meet.
     */
    const agreementReached =
      buyerFinal >= supplierFinal;

    if (!agreementReached) {
      return NextResponse.json({
        success: true,
        resolved: false,
        reason:
          "Negotiation finished without an authorized overlap.",
      });
    }

    const agreedAmount = money(supplierFinal);

    const {
  data: evidenceAnalysis,
  error: evidenceAnalysisError,
} = await supabaseServer
  .from("deal_evidence_analyses")
  .select("analysis_version")
  .eq("deal_id", "DEAL-1048")
  .order("created_at", {
    ascending: false,
  })
  .limit(1)
  .maybeSingle();

if (evidenceAnalysisError) {
  throw new Error(
    `Could not load evidence provenance: ${evidenceAnalysisError.message}`
  );
}

if (!evidenceAnalysis?.analysis_version) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Evidence analysis must exist before negotiation can begin.",
    },
    { status: 409 }
  );
}

const evidenceAnalysisVersion =
  evidenceAnalysis.analysis_version;

  const {
  data: demoState,
  error: demoStateError,
} = await supabaseServer
  .from("deal_demo_state")
  .select("active_run_id, run_number")
  .eq("deal_id", "DEAL-1048")
  .single();

if (demoStateError || !demoState?.active_run_id) {
  throw new Error(
    demoStateError?.message ??
      "Could not load the active DealDone demo run."
  );
}

const demoRunId = demoState.active_run_id;
const demoRunNumber = demoState.run_number;

    const proposalVersion = createHash("sha256")
  .update(
    JSON.stringify({
      dealId: "DEAL-1048",
      demoRunId,
      evidenceAnalysisVersion,
      buyerFinal,
      supplierFinal,
      agreedAmount,
    })
  )
  .digest("hex")
  .slice(0, 12);

  const negotiationPayload = {
  dealId: "DEAL-1048",
  demoRunId,
demoRunNumber,
  evidenceAnalysisVersion,

  buyer: {
    openingProposal: buyerOpening,
    counterProposal: buyerCounter,
    finalAuthorizedOffer: buyerFinal,
    maximumAuthorizedAmount: buyerMaximum,
  },

  supplier: {
    openingProposal: supplierOpening,
    counterProposal: supplierCounter,
    finalAuthorizedOffer: supplierFinal,
    minimumAuthorizedAmount: supplierMinimum,
  },

  agreement: {
    reached: true,
    amount: agreedAmount,
    proposalVersion,
  },

  controls: {
    buyerMaximumAuthorized: buyerMaximum,
    supplierMinimumAuthorized: supplierMinimum,
    enforcement:
      "DealDone code enforces both mandates. AI agents cannot authorize settlement outside these limits.",
  },
};

const { error: settlementError } = await supabaseServer
  .from("deal_settlements")
  .upsert(
    {
      deal_id: "DEAL-1048",
      proposal_version: proposalVersion,
      evidence_analysis_version:
  evidenceAnalysisVersion,
      original_amount: 18000,
      settlement_amount: agreedAmount,
      negotiation_payload: negotiationPayload,
    },
    {
      onConflict: "deal_id,proposal_version",
      ignoreDuplicates: true,
    }
  );

if (settlementError) {
  throw new Error(
    `Could not persist negotiated settlement: ${settlementError.message}`
  );
}

    /*
     * STEP 7
     * Return an auditable negotiation transcript.
     */
    return NextResponse.json({
      success: true,
      resolved: true,

      negotiation: {
        rounds: [
          {
            round: 1,

            buyer: {
              amount: buyerOpening,
              type: "Opening proposal",
              reasoning: buyer.proposal.reasoning,
              citations: buyer.proposal.citations,
            },

            supplier: {
              amount: supplierOpening,
              type: "Opening proposal",
              reasoning: supplier.proposal.reasoning,
              citations: supplier.proposal.citations,
            },
          },

          {
            round: 2,

            buyer: {
              amount: buyerCounter,
              type: "Bounded counteroffer",
              constraint: `Cannot exceed $${buyerMaximum.toLocaleString()}`,
            },

            supplier: {
              amount: supplierCounter,
              type: "Bounded counteroffer",
              constraint: `Cannot go below $${supplierMinimum.toLocaleString()}`,
            },
          },

          {
            round: 3,

            buyer: {
              amount: buyerFinal,
              type: "Final authorized offer",
            },

            supplier: {
              amount: supplierFinal,
              type: "Final authorized offer",
            },
          },
        ],

        agreement: {
  reached: true,
  amount: agreedAmount,
  round: 3,
  proposalVersion,
  evidenceAnalysisVersion,
},
      },

      controls: {
        buyerMaximumAuthorized: buyerMaximum,
        supplierMinimumAuthorized: supplierMinimum,

        enforcement:
          "DealDone code enforces both mandates. AI agents cannot authorize settlement outside these limits.",
      },

      nextStage: {
        status: "Pending dual human approval",
        settlementAmount: agreedAmount,
      },
    });
  } catch (error) {
    console.error("DealDone negotiation failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Negotiation failed.",
      },
      { status: 500 }
    );
  }
}