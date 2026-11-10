import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { createClient as createAuthClient } from "@/lib/supabase/server";

type ApprovalParty = "buyer" | "supplier";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const dealId = searchParams.get("dealId");
    const proposalVersion = searchParams.get("proposalVersion");

    if (!dealId || !proposalVersion) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing dealId or proposalVersion.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseServer
      .from("deal_settlements")
      .select(
        `
          deal_id,
          proposal_version,
          settlement_amount,
          buyer_approved_at,
          supplier_approved_at,
          status
        `
      )
      .eq("deal_id", dealId)
      .eq("proposal_version", proposalVersion)
      .single();

    if (error || !data) {
      return NextResponse.json(
        {
          success: false,
          message: "Settlement not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      settlement: {
        dealId: data.deal_id,
        proposalVersion: data.proposal_version,
        settlementAmount: Number(data.settlement_amount),
        buyerApproved: Boolean(data.buyer_approved_at),
        supplierApproved: Boolean(
          data.supplier_approved_at
        ),
        buyerApprovedAt: data.buyer_approved_at,
        supplierApprovedAt: data.supplier_approved_at,
        status: data.status,
      },
    });
  } catch (error) {
    console.error(
      "Settlement status lookup failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Could not read settlement approval state.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const dealId = body?.dealId;
    const proposalVersion = body?.proposalVersion;

    if (!dealId || !proposalVersion) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid approval request.",
        },
        { status: 400 }
      );
    }

    // 1. Verify the authenticated Supabase user.
    const authClient = await createAuthClient();

    const { data: claimsData, error: claimsError } =
      await authClient.auth.getClaims();

    const userId = claimsData?.claims?.sub;

    if (claimsError || !userId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You must be signed in to approve this settlement.",
        },
        { status: 401 }
      );
    }

    // 2. Derive the user's role from the server-side mapping.
    const { data: participant, error: participantError } =
      await supabaseServer
        .from("deal_participants")
        .select("role")
        .eq("deal_id", dealId)
        .eq("user_id", userId)
        .single();

    if (
      participantError ||
      !participant ||
      (participant.role !== "buyer" &&
        participant.role !== "supplier")
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to approve this deal.",
        },
        { status: 403 }
      );
    }

    const party = participant.role as ApprovalParty;

    // 3. Load the exact server-authoritative proposal.
    const { data: existing, error: lookupError } =
      await supabaseServer
        .from("deal_settlements")
        .select(
          `
            buyer_approved_at,
            supplier_approved_at,
            status
          `
        )
        .eq("deal_id", dealId)
        .eq("proposal_version", proposalVersion)
        .single();

    if (lookupError || !existing) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Settlement proposal not found.",
        },
        { status: 404 }
      );
    }

    if (
      existing.status === "executing" ||
      existing.status === "completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "This settlement can no longer be modified.",
        },
        { status: 409 }
      );
    }

    // 4. Make repeated approval by the same party idempotent.
    if (
      (party === "buyer" &&
        existing.buyer_approved_at) ||
      (party === "supplier" &&
        existing.supplier_approved_at)
    ) {
      return NextResponse.json({
        success: true,
        alreadyApproved: true,
        party,
      });
    }

    const approvedAt = new Date().toISOString();

    const update =
      party === "buyer"
        ? {
            buyer_approved_at: approvedAt,
            status: existing.supplier_approved_at
              ? "approved"
              : "pending_approval",
            updated_at: approvedAt,
          }
        : {
            supplier_approved_at: approvedAt,
            status: existing.buyer_approved_at
              ? "approved"
              : "pending_approval",
            updated_at: approvedAt,
          };

    const { data: updated, error: updateError } =
      await supabaseServer
        .from("deal_settlements")
        .update(update)
        .eq("deal_id", dealId)
        .eq("proposal_version", proposalVersion)
        .select(
          `
            deal_id,
            proposal_version,
            settlement_amount,
            buyer_approved_at,
            supplier_approved_at,
            status
          `
        )
        .single();

    if (updateError || !updated) {
      throw new Error(
        updateError?.message ??
          "Settlement approval could not be saved."
      );
    }

    return NextResponse.json({
      success: true,
      party,
      settlement: {
        dealId: updated.deal_id,
        proposalVersion: updated.proposal_version,
        settlementAmount: Number(
          updated.settlement_amount
        ),
        buyerApproved: Boolean(
          updated.buyer_approved_at
        ),
        supplierApproved: Boolean(
          updated.supplier_approved_at
        ),
        buyerApprovedAt:
          updated.buyer_approved_at,
        supplierApprovedAt:
          updated.supplier_approved_at,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error(
      "Settlement approval failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Could not record settlement approval.",
      },
      { status: 500 }
    );
  }
}