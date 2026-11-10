# DealDone

**AI-native commercial dispute resolution that turns evidence into executable PayPal settlements.**

DealDone helps businesses resolve commercial disputes from evidence to payment.

It analyzes commercial documents, establishes an evidence-backed financial baseline, lets independent buyer and supplier AI agents negotiate within hard monetary limits, requires authenticated approval from both parties, and executes the approved settlement through PayPal.

> **AI proposes and negotiates. Deterministic code controls money. Authenticated humans authorize. PayPal executes.**

## The Problem

Commercial disputes rarely start with a clean number.

A single disagreement can involve:

- purchase orders
- delivery records
- inspection reports
- missing quantities
- damaged goods
- conflicting claims
- negotiation
- internal approvals
- payment execution

Even after businesses understand what went wrong, turning that evidence into an agreed and executable financial outcome is still highly manual.

DealDone connects the full resolution workflow:

```text
Evidence
   ↓
AI Analysis
   ↓
Deterministic Financial Baseline
   ↓
Buyer ↔ Supplier Agent Negotiation
   ↓
Authenticated Dual Approval
   ↓
PayPal Settlement
   ↓
Verification + Audit Trail
```

## Demo Scenario

A buyer placed an order worth:

```text
$18,000
```

The evidence later showed:

```text
1,000 units ordered
940 units delivered
60 units missing
55 units confirmed as supplier-responsible damage
```

DealDone calculates:

```text
Original disputed amount      $18,000
Missing-goods deduction        $1,080
Accepted damage deduction        $990
--------------------------------------
Evidence-backed settlement    $15,930
Released remainder             $2,070
```

## How DealDone Works

### 1. Evidence-Grounded AI Analysis

DealDone uses Google Gemini to extract structured facts from commercial evidence together with source citations.

The AI identifies information such as:

- ordered quantity
- delivered quantity
- unit price
- missing units
- inspection findings
- supplier-responsible damage

The extracted facts remain linked to their source documents.

### 2. Deterministic Financial Controls

AI does **not** calculate or authorize the settlement amount.

DealDone validates the extracted evidence and uses deterministic application code to calculate the financial baseline.

This separates probabilistic AI reasoning from financial authority.

### 3. Independent Negotiation Agents

DealDone runs separate buyer and supplier agents with opposing commercial objectives.

In the demo:

```text
BUYER AGENT

Opening proposal:     $15,660
Maximum authorized:   $15,930


SUPPLIER AGENT

Opening proposal:     $16,200
Minimum authorized:   $15,930
```

The agents negotiate through bounded concessions.

Final agreement:

```text
$15,930
```

Neither agent can cross its monetary mandate because those boundaries are enforced by application code.

### 4. Proposal Provenance

Each settlement proposal receives a unique fingerprint tied to:

- the deal
- the evidence analysis
- the active resolution run
- the buyer's authorized boundary
- the supplier's authorized boundary
- the final agreed amount

This links every approval and payment back to the exact settlement proposal that produced it.

### 5. Authenticated Dual Approval

An AI agreement is **not permission to move money**.

Each party signs in through Supabase authentication.

DealDone maps the authenticated user to a server-authoritative role:

```text
Buyer
or
Supplier
```

The browser cannot choose which party it is approving for.

The server derives approval authority from:

```text
Authenticated User
        +
Deal Participant Mapping
        ↓
Authorized Role
```

PayPal execution remains blocked until both independently authenticated parties approve the exact proposal.

### 6. PayPal Settlement Execution

After dual approval, DealDone executes the commercial outcome through PayPal Sandbox.

For the demo:

```text
Original amount authorized     $18,000
Approved settlement captured   $15,930
Uncaptured remainder released   $2,070
```

PayPal is therefore part of the resolution workflow itself rather than simply a checkout button added after the AI process.

### 7. Verification and Audit Trail

DealDone stores an auditable record of the resolution process, including:

- evidence-analysis fingerprints
- negotiation proposal fingerprints
- buyer approval timestamps
- supplier approval timestamps
- PayPal order IDs
- PayPal authorization IDs
- PayPal capture IDs
- settlement completion timestamps
- PayPal webhook events

PayPal webhook signatures are verified before events are persisted.

Duplicate webhook events are handled idempotently.

## Architecture

```text
                   COMMERCIAL EVIDENCE
                           │
                           ▼
                  Gemini AI Extraction
                           │
                           ▼
                   Citation Validation
                           │
                           ▼
             Deterministic Financial Engine
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
        Buyer Agent                 Supplier Agent
             │                           │
             └──────── Negotiation ──────┘
                           │
                           ▼
                 Proposal Fingerprint
                           │
                 ┌─────────┴─────────┐
                 ▼                   ▼
           Buyer Approval      Supplier Approval
            Supabase Auth       Supabase Auth
                 └─────────┬─────────┘
                           ▼
                    PayPal Sandbox
                           │
              ┌────────────┼────────────┐
              ▼            ▼            ▼
          Authorize      Capture      Release
                           │
                           ▼
                 PayPal Verification
                           │
                           ▼
                     Audit Trail
                           │
                           ▼
                        Supabase
```

## Safety Model

DealDone intentionally separates AI capability from financial authority.

| Layer | Responsibility |
| --- | --- |
| Gemini | Extract evidence and citations |
| Deterministic code | Validate facts and calculate monetary outcomes |
| Buyer Agent | Negotiate within buyer mandate |
| Supplier Agent | Negotiate within supplier mandate |
| Supabase Auth | Establish party identity |
| Human Approvers | Authorize the exact settlement |
| PayPal | Execute the approved transaction |
| Webhook Audit | Verify and persist payment events |

### Core principle

> **AI can recommend and negotiate. It cannot unilaterally move money.**

## Repeatable Demo Architecture

Hackathon demonstrations often require the same workflow to be performed multiple times.

DealDone therefore includes a protected demo-run mechanism.

Instead of deleting completed settlements, each reset generates a new server-side run ID.

That run ID becomes part of the next proposal fingerprint.

```text
Run 1
Proposal A
Completed
   │
   ▼
New Run ID
   │
   ▼
Run 2
Proposal B
Fresh approvals
```

Historical records remain untouched.

The system preserves:

- previous settlement records
- PayPal transaction IDs
- approval timestamps
- evidence versions
- webhook events
- audit history

The reset endpoint is protected by a server-only secret.

## Successfully Demonstrated End-to-End

DealDone has successfully completed the following flow using PayPal Sandbox:

1. Evidence analysis with cited facts
2. Deterministic settlement calculation
3. Independent buyer and supplier AI negotiation
4. Bounded agent mandates
5. Proposal fingerprinting
6. Authenticated buyer approval
7. Authenticated supplier approval
8. PayPal authorization of **$18,000**
9. PayPal capture of **$15,930**
10. Release of the remaining **$2,070**
11. Server-side settlement verification
12. Persistent payment record
13. Verified PayPal webhook receipt
14. Idempotent webhook handling

## Tech Stack

### Application

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4

### AI

- Google Gemini
- Independent buyer and supplier negotiation agents
- Deterministic financial validation layer

### Payments

- PayPal REST APIs
- PayPal Sandbox
- Authorization
- Partial capture
- Release of uncaptured funds
- Webhook verification

### Infrastructure

- Supabase PostgreSQL
- Supabase Auth
- Vercel

## Running Locally

### Requirements

You will need:

- Node.js
- npm
- PayPal Developer Sandbox credentials
- Google Gemini API key
- Supabase project

### Installation

```bash
git clone https://github.com/hoykay/dealdone.git

cd dealdone

npm install
```

### Environment Variables

Create:

```text
.env.local
```

Add:

```env
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_BASE_URL=https://api-m.sandbox.paypal.com
PAYPAL_WEBHOOK_ID=

GEMINI_API_KEY=

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SECRET_KEY=

APP_BASE_URL=http://localhost:3000

DEMO_RESET_SECRET=
```

Never expose server-side secrets through variables prefixed with:

```text
NEXT_PUBLIC_
```

## Supabase Data Model

DealDone uses server-side tables including:

```text
deal_evidence_analyses
deal_settlements
deal_participants
deal_demo_state
paypal_webhook_events
```

Row Level Security is enabled.

Sensitive database operations are performed from server-side application routes.

## Start Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## Production Build

```bash
npm run build
npm start
```

## Live Application

```text
https://dealdone-seven.vercel.app
```

DealDone currently uses PayPal Sandbox for demonstration purposes.

## Why DealDone

Many AI products stop after producing an answer.

DealDone is designed to go further.

It turns evidence into a controlled commercial resolution and connects:

```text
Understanding
→ Negotiation
→ Authorization
→ Execution
→ Verification
```

**Evidence in. Agreement reached. Humans authorize. Money moves. Deal done.**

## License

DealDone is open source for the PayPal AI Hackathon.

See the `LICENSE` file for licensing details.