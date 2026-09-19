# Relay — AI-Powered Customer Support Platform

Relay is a multi-tenant SaaS platform that lets businesses embed an AI support widget on any website. It handles customer conversations autonomously using a RAG-powered AI agent, escalates to human operators when needed, and supports voice calls via Vapi — all manageable from a real-time operator dashboard.

---

## Features

- **Embeddable Chat Widget** — Drop a single `<script>` tag into any website (HTML, React, Next.js, or plain JavaScript) to go live instantly.
- **AI Support Agent** — Powered by Google Gemini, the agent searches your knowledge base to answer customer questions automatically.
- **Knowledge Base (RAG)** — Upload PDFs, CSVs, and text files. The agent retrieves relevant context at query time using vector search.
- **Voice Calls** — Integrate with Vapi to enable web-based voice calls and display a phone number for customers to call directly.
- **Operator Dashboard** — Real-time inbox for human operators to view, respond to, escalate, or resolve conversations.
- **AI Message Enhancement** — Operators can enhance their draft responses using AI before sending.
- **Contact Intelligence** — See browser, device, location, and session metadata for every conversation.
- **Conversation Lifecycle** — Conversations flow through `unresolved → escalated → resolved` with full operator control.
- **Billing & Subscriptions** — Clerk-powered pricing table with plan gating on premium features.
- **Multi-Tenant** — Each organization gets isolated data, its own widget configuration, and its own knowledge base.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Monorepo | Turborepo + pnpm workspaces |
| Frontend (Dashboard) | Next.js 16, React 19, Tailwind CSS v4 |
| Frontend (Widget) | Next.js 16, React 19 |
| Embed Script | Vite (IIFE bundle) |
| Backend | Convex (real-time database + serverless functions) |
| AI | Google Gemini 2.5 Flash Lite via AI SDK |
| RAG | `@convex-dev/rag` + Gemini text embeddings |
| AI Agent | `@convex-dev/agent` |
| Auth & Billing | Clerk |
| Voice | Vapi |
| Secrets | AWS Secrets Manager |
| UI Components | shadcn/ui |
| State Management | Jotai |
| Error Tracking | Sentry |

---

## Project Structure

```
relay/
├── apps/
│   ├── web/          # Operator dashboard (Next.js)
│   ├── widget/       # Embeddable chat UI (Next.js)
│   └── embed/        # Widget loader script (Vite IIFE)
└── packages/
    ├── backend/      # Convex functions, schema, AI agents
    ├── ui/           # Shared component library (shadcn/ui)
    ├── eslint-config/
    └── typescript-config/
```

---

## Getting Started

### Prerequisites

- Node.js >= 20
- pnpm >= 10

### Installation

```bash
git clone https://github.com/your-username/relay
cd relay
pnpm install
```

### Environment Variables

Copy `.env.example` files in each app and package:

```bash
cp apps/web/.env.example apps/web/.env.local
cp apps/widget/.env.example apps/widget/.env.local
cp packages/backend/.env.example packages/backend/.env.local
```

Required variables:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=
CONVEX_DEPLOYMENT=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
CLERK_JWT_ISSUER_DOMAIN=

# Google AI
GOOGLE_GENERATIVE_AI_API_KEY=

# AWS (for secrets manager)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=
```

### Development

```bash
# Start all apps
pnpm dev

# Or individually
pnpm --filter web dev        # Dashboard on :3000
pnpm --filter widget dev     # Widget on :3001
pnpm --filter embed dev      # Embed demo on :3002
pnpm --filter @workspace/backend dev  # Convex backend
```

### Build

```bash
pnpm build
```

---

## Embedding the Widget

Add one script tag to any webpage:

```html
<script
  src="https://your-domain.com/widget.js"
  data-organization-id="YOUR_ORG_ID"
></script>
```

Optional attributes:

| Attribute | Values | Default |
|---|---|---|
| `data-organization-id` | Your Clerk org ID | required |
| `data-position` | `bottom-right`, `bottom-left` | `bottom-right` |

---

## Architecture Overview

```
Customer Browser
  └── Embed Script (IIFE)
        └── Widget iframe (Next.js /widget)
              └── Convex (public API)
                    ├── Contact session management
                    ├── AI agent (Gemini + RAG)
                    └── Conversation store

Operator Browser
  └── Dashboard (Next.js /web)
        └── Convex (private API, Clerk auth)
              ├── Real-time conversation inbox
              ├── Knowledge base management
              └── Plugin/secret management
```

---

## License

MIT
