import {
  connection,
  NextRequest,
  NextResponse,
} from "next/server";

import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  await connection();

  try {
    const dealId =
      request.nextUrl.searchParams.get("dealId");

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
      data: analysis,
      error,
    } = await supabaseServer
      .from("deal_evidence_analyses")
      .select(
        `
          deal_id,
          analysis_version,
          generation_mode,
          ai_extraction,
          deterministic_analysis,
          architecture,
          created_at
        `
      )
      .eq("deal_id", dealId)
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Could not load evidence analysis:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Could not load the evidence analysis.",
        },
        { status: 500 }
      );
    }

    if (!analysis) {
      return NextResponse.json(
        {
          success: false,
          message:
            "No evidence analysis exists for this deal.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,

      analysis: {
        dealId:
          analysis.deal_id,

        analysisVersion:
          analysis.analysis_version,

        generationMode:
          analysis.generation_mode,

        aiExtraction:
          analysis.ai_extraction,

        deterministicAnalysis:
          analysis.deterministic_analysis,

        architecture:
          analysis.architecture,

        createdAt:
          analysis.created_at,
      },
    });
  } catch (error) {
    console.error(
      "Evidence analysis lookup failed:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Failed to load the evidence analysis.",
      },
      { status: 500 }
    );
  }
}