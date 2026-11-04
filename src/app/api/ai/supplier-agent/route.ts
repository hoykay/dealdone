import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const supplierAgentSchema = {
  type: "object",
  properties: {
    proposedAmount: {
      type: "number",
      description: "Supplier's proposed settlement amount in USD",
    },
    reasoning: {
      type: "string",
      description:
        "Concise explanation of why the supplier is making this proposal",
    },
    citations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          sourceId: {
            type: "string",
          },
          sourceLine: {
            type: "string",
          },
        },
        required: ["sourceId", "sourceLine"],
      },
    },
  },
  required: ["proposedAmount", "reasoning", "citations"],
};

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

    // Supplier mandate:
    // Supplier prefers a higher commercial settlement.
    // It may negotiate downward, but cannot accept less than $15,930.
    const preferredAmount = 16200;
    const minimumAuthorizedAmount = 15930;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
You are the SUPPLIER negotiation agent for DealDone.

You represent Nova Packaging in a commercial dispute with Acme Manufacturing.

Your authority is LIMITED.

Evidence:
- PO-77821 LINE 3: Quantity ordered: 1,000 units
- PO-77821 LINE 4: Unit price: $18.00
- DN-11000 LINE 2: Quantity received: 940 units
- IR-99211 LINE 1: Buyer initially reported 70 damaged units
- IR-99211 LINE 2: Inspection confirmed 55 units as supplier-responsible damage
- IR-99211 LINE 3: 15 reported damaged units were not supported by inspection evidence

Supplier mandate:
- Preferred commercial settlement: $16,200
- Minimum authorized settlement: $15,930
- You MUST NOT propose less than $15,930.
- Protect the supplier's commercial position.
- You may use $16,200 as the supplier's opening negotiation position.
- Do NOT claim that $16,200 is proven by the evidence.
- The supplier's preferred amount is a commercial negotiation position, not an evidence finding.
- Every factual claim about the transaction must be supported by the evidence above.
- Do not invent evidence.
- Do not claim authority beyond the mandate.
- Return one settlement proposal.

Important:
The evidence-backed deterministic settlement is $15,930.
The supplier may negotiate above that amount because its mandate allows a higher opening position,
but it must clearly distinguish commercial preference from evidence-supported facts.
`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: supplierAgentSchema,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned no supplier-agent response.");
    }

    const proposal = JSON.parse(response.text);

    if (proposal.proposedAmount < minimumAuthorizedAmount) {
      throw new Error(
        `Supplier agent exceeded its authority: $${proposal.proposedAmount}`
      );
    }

    if (proposal.proposedAmount <= 0) {
      throw new Error(
        "Supplier agent returned an invalid settlement amount."
      );
    }

    return NextResponse.json({
      success: true,

      agent: {
        role: "Supplier",
        party: "Nova Packaging",
      },

      mandate: {
        preferredAmount,
        minimumAuthorizedAmount,
      },

      proposal,
    });
  } catch (error) {
    console.error("DealDone supplier agent failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Supplier negotiation agent failed.",
      },
      { status: 500 }
    );
  }
}