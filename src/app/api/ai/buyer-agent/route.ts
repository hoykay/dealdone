import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const buyerAgentSchema = {
  type: "object",
  properties: {
    proposedAmount: {
      type: "number",
      description: "Buyer's proposed settlement amount in USD",
    },
    reasoning: {
      type: "string",
      description:
        "Concise explanation of why the buyer is making this proposal",
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

    // Buyer mandate:
    // Buyer initially claims all 70 reported damaged units.
    // Buyer prefers $15,660.
    // Buyer may negotiate upward, but cannot exceed $15,930.
    const preferredAmount = 15660;
    const maximumAuthorizedAmount = 15930;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: `
You are the BUYER negotiation agent for DealDone.

You represent Acme Manufacturing in a commercial dispute with Nova Packaging.

Your authority is LIMITED.

Evidence:
- PO-77821 LINE 3: Quantity ordered: 1,000 units
- PO-77821 LINE 4: Unit price: $18.00
- DN-11000 LINE 2: Quantity received: 940 units
- IR-99211 LINE 1: Buyer initially reported 70 damaged units
- IR-99211 LINE 2: Inspection confirmed 55 units as supplier-responsible damage
- IR-99211 LINE 3: 15 reported damaged units were not supported by inspection evidence

Buyer mandate:
- Preferred settlement: $15,660
- Maximum authorized settlement: $15,930
- You MUST NOT propose more than $15,930.
- Protect the buyer's commercial position.
- Every factual claim must be backed by the evidence above.
- Do not invent evidence.
- Do not claim authority beyond the mandate.
- Return one settlement proposal.

The buyer's preferred position reflects:
1,000 ordered
- 60 missing
- 70 initially reported damaged
= 870 payable units
870 × $18 = $15,660.
`,
      config: {
        responseMimeType: "application/json",
        responseJsonSchema: buyerAgentSchema,
      },
    });

    if (!response.text) {
      throw new Error("Gemini returned no buyer-agent response.");
    }

    const proposal = JSON.parse(response.text);

    if (proposal.proposedAmount > maximumAuthorizedAmount) {
      throw new Error(
        `Buyer agent exceeded its authority: $${proposal.proposedAmount}`
      );
    }

    if (proposal.proposedAmount <= 0) {
      throw new Error("Buyer agent returned an invalid settlement amount.");
    }

    return NextResponse.json({
      success: true,

      agent: {
        role: "Buyer",
        party: "Acme Manufacturing",
      },

      mandate: {
        preferredAmount,
        maximumAuthorizedAmount,
      },

      proposal,
    });
  } catch (error) {
    console.error("DealDone buyer agent failed:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Buyer negotiation agent failed.",
      },
      { status: 500 }
    );
  }
}