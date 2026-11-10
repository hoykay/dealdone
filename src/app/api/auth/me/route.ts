import { connection, NextResponse } from "next/server";
import { createClient as createAuthClient } from "@/lib/supabase/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
    await connection();
    
  try {
    const { searchParams } = new URL(request.url);
    const dealId = searchParams.get("dealId");

    if (!dealId) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing dealId.",
        },
        { status: 400 }
      );
    }

    const authClient = await createAuthClient();

    const { data: claimsData, error: claimsError } =
      await authClient.auth.getClaims();

    const userId = claimsData?.claims?.sub;
    const email = claimsData?.claims?.email;

    if (claimsError || !userId) {
      return NextResponse.json({
        success: true,
        authenticated: false,
        user: null,
        role: null,
      });
    }

    const { data: participant } = await supabaseServer
      .from("deal_participants")
      .select("role")
      .eq("deal_id", dealId)
      .eq("user_id", userId)
      .maybeSingle();

    return NextResponse.json({
      success: true,
      authenticated: true,
      user: {
        id: userId,
        email: email ?? null,
      },
      role:
        participant?.role === "buyer" ||
        participant?.role === "supplier"
          ? participant.role
          : null,
    });
  } catch (error) {
    console.error("Auth identity lookup failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Could not load authenticated identity.",
      },
      { status: 500 }
    );
  }
}