import {
  connection,
  NextRequest,
  NextResponse,
} from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
    await connection();

  try {
    const dealId = request.nextUrl.searchParams.get("dealId");

    if (!dealId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing dealId.",
        },
        { status: 400 }
      );
    }

    const {
  data: demoState,
  error: demoStateError,
} = await supabaseServer
  .from("deal_demo_state")
  .select("active_run_id")
  .eq("deal_id", dealId)
  .single();

if (demoStateError || !demoState?.active_run_id) {
  return NextResponse.json(
    {
      success: false,
      message:
        "Could not load the active demo run.",
    },
    { status: 500 }
  );
}

const activeRunId = demoState.active_run_id;

    const { data: settlement, error } = await supabaseServer
      .from("deal_settlements")
      .select(
        `
          deal_id,
          proposal_version,
          original_amount,
          settlement_amount,
          negotiation_payload,
          buyer_approved_at,
          supplier_approved_at,
          status,
          paypal_order_id,
          paypal_authorization_id,
          paypal_capture_id,
          created_at,
          updated_at,
          evidence_analysis_version,
          completed_at
        `
      )
      .eq("deal_id", dealId)
.eq(
  "negotiation_payload->>demoRunId",
  activeRunId
)
.order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Could not load current settlement:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Could not load the current settlement.",
        },
        { status: 500 }
      );
    }

    if (!settlement) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No settlement proposal exists for this deal.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      settlement: {
        dealId: settlement.deal_id,
        proposalVersion:
          settlement.proposal_version,

          evidenceAnalysisVersion:
  settlement.evidence_analysis_version,

        originalAmount: Number(
          settlement.original_amount
        ),

        settlementAmount: Number(
          settlement.settlement_amount
        ),

        negotiation:
          settlement.negotiation_payload,

        buyerApproved:
          Boolean(
            settlement.buyer_approved_at
          ),

        supplierApproved:
          Boolean(
            settlement.supplier_approved_at
          ),

        buyerApprovedAt:
          settlement.buyer_approved_at,

        supplierApprovedAt:
          settlement.supplier_approved_at,

        status: settlement.status,

        paypal: {
          orderId:
            settlement.paypal_order_id,

          authorizationId:
            settlement.paypal_authorization_id,

          captureId:
            settlement.paypal_capture_id,
        },

        createdAt:
          settlement.created_at,

        updatedAt:
          settlement.updated_at,

        completedAt:
          settlement.completed_at,
      },
    });
  } catch (error) {
    console.error(
      "Current settlement lookup failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load the current settlement.",
      },
      { status: 500 }
    );
  }
}