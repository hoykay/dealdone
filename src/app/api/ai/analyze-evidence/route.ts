import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";
import { createHash } from "crypto";
import { supabaseServer } from "@/lib/supabase-server";

const evidenceBundle = `
SOURCE: PO-77821
TYPE: Purchase Order
LINE 1: Buyer: Acme Manufacturing
LINE 2: Supplier: Nova Packaging
LINE 3: Quantity ordered: 1,000 units
LINE 4: Unit price: $18.00
LINE 5: Total order value: $18,000.00

SOURCE: DN-11000
TYPE: Delivery Note
LINE 1: Shipment received by Acme Manufacturing
LINE 2: Quantity received: 940 units
LINE 3: Delivery date: October 15, 2026

SOURCE: IR-99211
TYPE: Inspection Report
LINE 1: Buyer initially reported 70 damaged units
LINE 2: Inspection confirmed 55 units as supplier-responsible damage
LINE 3: 15 reported damaged units were not supported by inspection evidence

SOURCE: WH-IMG-01
TYPE: Warehouse Evidence
LINE 1: Warehouse photographs show damaged outer packaging
LINE 2: Evidence is consistent with the 55 units confirmed in IR-99211
`;
const evidenceIndex: Record<string, Record<string, string>> = {
  "PO-77821": {
    "LINE 1": "Buyer: Acme Manufacturing",
    "LINE 2": "Supplier: Nova Packaging",
    "LINE 3": "Quantity ordered: 1,000 units",
    "LINE 4": "Unit price: $18.00",
    "LINE 5": "Total order value: $18,000.00",
  },

  "DN-11000": {
    "LINE 1": "Shipment received by Acme Manufacturing",
    "LINE 2": "Quantity received: 940 units",
    "LINE 3": "Delivery date: October 15, 2026",
  },

  "IR-99211": {
    "LINE 1": "Buyer initially reported 70 damaged units",
    "LINE 2":
      "Inspection confirmed 55 units as supplier-responsible damage",
    "LINE 3":
      "15 reported damaged units were not supported by inspection evidence",
  },

  "WH-IMG-01": {
    "LINE 1": "Warehouse photographs show damaged outer packaging",
    "LINE 2":
      "Evidence is consistent with the 55 units confirmed in IR-99211",
  },
};

function validateFindingCitations(
  findings: {
    finding: string;
    sourceId: string;
    sourceLine: string;
  }[]
) {
  for (const finding of findings) {
    const source = evidenceIndex[finding.sourceId];

    if (!source) {
      throw new Error(
        `AI cited an unknown evidence source: ${finding.sourceId}`
      );
    }

    const citedLines =
      finding.sourceLine.match(/LINE \d+/g);

    if (!citedLines || citedLines.length === 0) {
      throw new Error(
        `AI finding has no valid source line: ${finding.finding}`
      );
    }

    for (const line of citedLines) {
      if (!source[line]) {
        throw new Error(
          `AI cited a line that does not exist: ${finding.sourceId} ${line}`
        );
      }
    }
  }

  return true;
}

const evidenceSchema = {
  type: "object",
  properties: {
    orderedUnits: {
      type: "integer",
      description: "Number of units ordered in the purchase order",
    },
    unitPrice: {
      type: "number",
      description: "Price per unit in USD",
    },
    deliveredUnits: {
      type: "integer",
      description: "Number of units actually received",
    },
    reportedDamagedUnits: {
      type: "integer",
      description: "Number of units initially reported damaged by the buyer",
    },
    acceptedSupplierDamageUnits: {
      type: "integer",
      description:
        "Number of damaged units supported by evidence as supplier-responsible",
    },
    findings: {
      type: "array",
      items: {
        type: "object",
        properties: {
          finding: {
            type: "string",
          },
          sourceId: {
            type: "string",
          },
          sourceLine: {
            type: "string",
          },
        },
        required: ["finding", "sourceId", "sourceLine"],
      },
    },
    summary: {
      type: "string",
      description:
        "Concise explanation of what the evidence establishes without calculating the settlement",
    },
  },
  required: [
    "orderedUnits",
    "unitPrice",
    "deliveredUnits",
    "reportedDamagedUnits",
    "acceptedSupplierDamageUnits",
    "findings",
    "summary",
  ],
};


type EvidenceExtraction = {
  orderedUnits: number;
  unitPrice: number;
  deliveredUnits: number;
  reportedDamagedUnits: number;
  acceptedSupplierDamageUnits: number;
  findings: {
    finding: string;
    sourceId: string;
    sourceLine: string;
  }[];
  summary: string;
};

function isTransientGeminiError(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "status" in error &&
    (error as { status?: number }).status === 503
  ) {
    return true;
  }

  const message =
    error instanceof Error ? error.message : String(error);

  return (
    message.includes("503") ||
    message.includes("UNAVAILABLE") ||
    message.includes("high demand")
  );
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDeterministicFallbackExtraction(): EvidenceExtraction {
  return {
    orderedUnits: 1000,
    unitPrice: 18,
    deliveredUnits: 940,
    reportedDamagedUnits: 70,
    acceptedSupplierDamageUnits: 55,
    findings: [
      {
        finding: "The purchase order was for 1,000 units.",
        sourceId: "PO-77821",
        sourceLine: "LINE 3",
      },
      {
        finding: "The unit price was $18.00.",
        sourceId: "PO-77821",
        sourceLine: "LINE 4",
      },
      {
        finding: "The buyer received 940 units.",
        sourceId: "DN-11000",
        sourceLine: "LINE 2",
      },
      {
        finding: "The buyer initially reported 70 damaged units.",
        sourceId: "IR-99211",
        sourceLine: "LINE 1",
      },
      {
        finding:
          "Inspection evidence supports 55 units as supplier-responsible damage.",
        sourceId: "IR-99211",
        sourceLine: "LINE 2",
      },
      {
        finding:
          "15 reported damaged units were not supported by inspection evidence.",
        sourceId: "IR-99211",
        sourceLine: "LINE 3",
      },
    ],
    summary:
      "The evidence establishes a 1,000-unit order, 940 units received, 70 units initially reported damaged, and 55 units supported as supplier-responsible damage.",
  };
}

export async function POST() {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          error: "GEMINI_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
    });

    let extracted: EvidenceExtraction | null = null;
    let generationMode: "gemini" | "deterministic_fallback" =
      "gemini";
    let lastGeminiError: unknown = null;

    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash-lite",
          contents: `
You are the evidence analysis engine for DealDone, a B2B commercial
dispute-resolution platform.

Your job is ONLY to extract facts supported by the supplied evidence.

Rules:
1. Do not invent facts.
2. Do not calculate or recommend a settlement amount.
3. Every finding must cite a SOURCE ID and exact source line.
4. Distinguish buyer-reported damage from evidence-supported damage.
5. Return only information supported by the evidence.

EVIDENCE:

${evidenceBundle}
`,
          config: {
            responseMimeType: "application/json",
            responseJsonSchema: evidenceSchema,
          },
        });

        if (!response.text) {
          throw new Error("Gemini returned no response.");
        }

        const parsed =
          JSON.parse(response.text) as EvidenceExtraction;

        validateFindingCitations(parsed.findings);
        extracted = parsed;
        break;
      } catch (error) {
        lastGeminiError = error;

        if (!isTransientGeminiError(error)) {
          throw error;
        }

        console.warn(
          `Gemini evidence analysis attempt ${attempt} failed with a transient error.`,
          error
        );

        if (attempt < 3) {
          await wait(500 * attempt);
        }
      }
    }

    if (!extracted) {
      console.warn(
        "Gemini evidence analysis unavailable after retries; using deterministic fallback.",
        lastGeminiError
      );

      extracted = getDeterministicFallbackExtraction();
      generationMode = "deterministic_fallback";
      validateFindingCitations(extracted.findings);
    }

    // Deterministic DealDone financial engine.
    // The AI extracts evidence; it does NOT decide the money.
    const missingUnits =
      extracted.orderedUnits - extracted.deliveredUnits;

    const payableUnits =
      extracted.deliveredUnits -
      extracted.acceptedSupplierDamageUnits;

    const originalAmountCents =
      extracted.orderedUnits *
      Math.round(extracted.unitPrice * 100);

    const missingDeductionCents =
      missingUnits *
      Math.round(extracted.unitPrice * 100);

    const damageDeductionCents =
      extracted.acceptedSupplierDamageUnits *
      Math.round(extracted.unitPrice * 100);

    const settlementCents =
      payableUnits *
      Math.round(extracted.unitPrice * 100);

    const releaseCents =
      originalAmountCents - settlementCents;

    const deterministicAnalysis = {
  missingUnits,
  acceptedDamagedUnits:
    extracted.acceptedSupplierDamageUnits,
  payableUnits,

  originalAmount: originalAmountCents / 100,
  missingDeduction: missingDeductionCents / 100,
  damageDeduction: damageDeductionCents / 100,
  settlementAmount: settlementCents / 100,
  authorizationRelease: releaseCents / 100,
};

const architecture = {
  aiRole:
    "Extract evidence-backed facts and citations",
  dealDoneRole:
    "Calculate financial outcome deterministically",
  humanRole:
    "Buyer and supplier approve the settlement",
  paypalRole:
    "Execute the approved financial settlement",
};

const analysisVersion = createHash("sha256")
  .update(
    JSON.stringify({
      dealId: "DEAL-1048",
      aiExtraction: extracted,
      deterministicAnalysis,
    })
  )
  .digest("hex")
  .slice(0, 12);

const { error: persistError } =
  await supabaseServer
    .from("deal_evidence_analyses")
    .insert({
      deal_id: "DEAL-1048",
      analysis_version: analysisVersion,
      generation_mode: generationMode,
      ai_extraction: extracted,
      deterministic_analysis:
        deterministicAnalysis,
      architecture,
    });

if (
  persistError &&
  persistError.code !== "23505"
) {
  throw new Error(
    `Could not persist evidence analysis: ${persistError.message}`
  );
}

return NextResponse.json({
  success: true,
  generationMode,
  analysisVersion,
  aiExtraction: extracted,
  deterministicAnalysis,
  architecture,
});
  } catch (error) {
    console.error("DealDone evidence analysis failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Evidence analysis failed.",
      },
      { status: 500 }
    );
  }
}