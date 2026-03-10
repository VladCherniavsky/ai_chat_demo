# AI Chat Demo

A frontend-only AI chat application. Users sign in via AWS Cognito, chat with an LLM through **OpenRouter** (streamed directly from the browser), and conversation history is persisted locally in the browser.

## Tech Stack

| Layer | Technology |
|---|---|
| UI framework | React 19 |
| State management | Redux Toolkit + redux-persist (localStorage) |
| Styling | TailwindCSS 3 |
| Routing | React Router DOM 6 |
| Auth | AWS Cognito Hosted UI — OIDC PKCE via `oidc-client-ts` |
| LLM streaming | OpenRouter API (SSE, called directly from browser) |
| Build tool | Vite 5 + TypeScript 5 |
| Infrastructure | Terraform — S3 + CloudFront + Cognito |

---

## Features

- **AI chat with streaming** — responses stream token-by-token in real time via OpenRouter
- **Multi-conversation support** — create and switch between independent chat sessions
- **Auto-titled conversations** — each conversation is automatically named from the first message
- **Conversation history** — sidebar groups past conversations by date (Today, Yesterday, This week, Older)
- **Delete conversation** — remove any conversation from history
- **Full message context** — entire conversation history is sent to the LLM on every request
- **Authentication via Cognito** — sign in/sign out using the Cognito Hosted UI (email + password, OIDC PKCE flow)
- **Persistent history** — conversations survive page reloads via `redux-persist` (localStorage)
- **Responsive layout** — collapsible sidebar with a mobile-friendly menu toggle

---

## Local Development

### Prerequisites

- Node.js 20+

### 1. Install dependencies

```bash
cd fe
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `fe/.env.local`:

```env
# OpenRouter — required; get your key at https://openrouter.ai/keys
VITE_OPENROUTER_API_KEY=sk-or-...
VITE_OPENROUTER_MODEL=anthropic/claude-3.5-sonnet

# Cognito — only needed when deploying to AWS; not required for local dev
# VITE_COGNITO_REGION=us-east-1
# VITE_COGNITO_USER_POOL_ID=us-east-1_XXXXXXXXX
# VITE_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxxxxxxxxxx
# VITE_COGNITO_DOMAIN=ai-chat-demo-dev.auth.us-east-1.amazoncognito.com
```

### 3. Start the dev server

```bash
npm run dev
# → http://localhost:5173
```

### Other scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Type-check + production build → `fe/dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Run TypeScript type-checking without building |

---

## Infrastructure

The app is hosted on S3 + CloudFront with Cognito for auth. Terraform manages all AWS resources.

### Deploy infra

```bash
cd infra
cp terraform.tfvars.example terraform.tfvars
# Edit terraform.tfvars — set cognito_callback_urls / logout_urls to match your CloudFront domain

terraform init
terraform plan
terraform apply
```

After `apply`, copy the outputs into `fe/.env.local`:

```
cloudfront_url              → your app URL
cognito_user_pool_id        → VITE_COGNITO_USER_POOL_ID
cognito_client_id           → VITE_COGNITO_CLIENT_ID
cognito_domain              → VITE_COGNITO_DOMAIN
```

### Deploy frontend

Use the deploy script — it builds, syncs to S3, and invalidates CloudFront in one step:

```bash
./scripts/deploy-fe.sh
```

To re-deploy without rebuilding (e.g. after an env-var change):

```bash
./scripts/deploy-fe.sh --skip-build
```

The script reads the S3 bucket name and CloudFront distribution ID directly from Terraform outputs, so no manual copy-paste is needed. AWS CLI credentials must be configured beforehand.

---

## Color Palette

The UI uses the [Cognizant Technology Solutions](https://www.brandcolorcode.com/cognizant-technology-solutions) brand palette — a professional, corporate-tech trio of navy, teal, and light blue that provides strong contrast and a clean, trustworthy feel for a chat application.

| Role | Color | Hex | Usage |
|---|---|---|---|
| Primary / backgrounds | Navy Blue | `#000048` | Sidebar background, dark surfaces, primary buttons |
| Accent / interactive | Teal | `#248D95` | Links, active states, highlights, focus rings |
| Secondary accent | Light Blue | `#82C7DE` | Hover states, subtle highlights, decorative elements |

The dark navy base keeps the interface focused on content, while teal provides clear interactive affordance and light blue adds depth without competing with primary actions.

---

## Project Structure

```
/
├── fe/                         React 19 frontend
│   ├── src/
│   │   ├── auth/               OIDC config, UserManager, AuthContext
│   │   ├── components/         UI components (Sidebar, ChatWindow, etc.)
│   │   ├── features/
│   │   │   ├── auth/           Redux auth slice (token, userId, email)
│   │   │   └── chat/           Redux chat slice, thunks, selectors
│   │   ├── pages/              ChatPage, CallbackPage
│   │   ├── services/           openrouter.ts — SSE streaming client
│   │   └── store/              Redux store + redux-persist config
│   └── .env.example
├── infra/                      Terraform
│   └── modules/
│       ├── cognito/            User Pool + Hosted UI App Client
│       └── frontend/           S3 (private) + CloudFront OAC
└── scripts/
    └── deploy-fe.sh            Build + S3 sync + CloudFront invalidation
```
