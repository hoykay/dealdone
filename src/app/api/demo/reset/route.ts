import {
  randomUUID,
  timingSafeEqual,
} from "node:crypto";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

function validResetSecret(request: Request) {
  const configuredSecret =
    process.env.DEMO_RESET_SECRET;

  const authorization =
    request.headers.get("authorization");

  const suppliedSecret =
    authorization?.startsWith("Bearer ")
      ? authorization.slice(7)
      : null;

  if (!configuredSecret || !suppliedSecret) {
    return false;
  }

  const configuredBuffer = Buffer.from(
    configuredSecret
  );
  const suppliedBuffer = Buffer.from(
    suppliedSecret
  );

  if (
    configuredBuffer.length !==
    suppliedBuffer.length
  ) {
    return false;
  }

  return timingSafeEqual(
    configuredBuffer,
    suppliedBuffer
  );
}

export async function POST(request: Request) {
  try {
    if (!validResetSecret(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized demo reset.",
        },
        { status: 401 }
      );
    }

    const body = await request.json();
    const dealId = body?.dealId;

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
      data: latestSettlement,
      error: settlementError,
    } = await supabaseServer
      .from("deal_settlements")
      .select(
        `
          proposal_version,
          status,
          completed_at
        `
      )
      .eq("deal_id", dealId)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (settlementError) {
      throw new Error(
        `Could not inspect settlement state: ${settlementError.message}`
      );
    }

    if (
      latestSettlement &&
      latestSettlement.status !== "completed"
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "The current demo run must be completed before a new run can begin.",
        },
        { status: 409 }
      );
    }

    const {
      data: currentState,
      error: stateError,
    } = await supabaseServer
      .from("deal_demo_state")
      .select(
        `
          active_run_id,
          run_number
        `
      )
      .eq("deal_id", dealId)
      .single();

    if (stateError || !currentState) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Demo state could not be found for this deal.",
        },
        { status: 404 }
      );
    }

    const nextRunId = randomUUID();
    const nextRunNumber =
      Number(currentState.run_number) + 1;

    const now = new Date().toISOString();

    const {
      data: updatedState,
      error: updateError,
    } = await supabaseServer
      .from("deal_demo_state")
      .update({
        active_run_id: nextRunId,
        run_number: nextRunNumber,
        updated_at: now,
      })
      .eq("deal_id", dealId)
      .eq(
        "active_run_id",
        currentState.active_run_id
      )
      .select(
        `
          deal_id,
          active_run_id,
          run_number,
          updated_at
        `
      )
      .single();

    if (updateError || !updatedState) {
      throw new Error(
        updateError?.message ??
          "Could not create the next demo run."
      );
    }

    return NextResponse.json({
      success: true,
      message:
        "A fresh DealDone demo run is ready.",
      demo: {
        dealId: updatedState.deal_id,
        runId: updatedState.active_run_id,
        runNumber: updatedState.run_number,
        updatedAt: updatedState.updated_at,
      },
      historyPreserved: true,
      previousSettlement: latestSettlement
        ? {
            proposalVersion:
              latestSettlement.proposal_version,
            status:
              latestSettlement.status,
            completedAt:
              latestSettlement.completed_at,
          }
        : null,
      nextStage:
        "Run the evidence and negotiation flow to create a fresh proposal.",
    });
  } catch (error) {
    console.error("Demo reset failed:", error);

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Could not reset the demo.",
      },
      { status: 500 }
    );
  }
}