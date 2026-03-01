# CommitChain — Technical Documentation

> **AI-Powered Decentralized Open Source Contribution Protocol on Polygon**

CommitChain is a full-stack Web3 application that records open-source contributions on-chain with AI-powered code analysis and decentralized IPFS storage. Contributors submit git diffs which are analyzed by Google Gemini AI, pinned to IPFS via Pinata, and permanently recorded on the Polygon Amoy blockchain with an on-chain reputation system.

---

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Smart Contract](#smart-contract)
5. [Backend API](#backend-api)
6. [Frontend Dashboard](#frontend-dashboard)
7. [CLI Tool](#cli-tool)
8. [Deployment](#deployment)
9. [Environment Variables](#environment-variables)
10. [API Reference](#api-reference)
11. [Data Flow](#data-flow)
12. [Getting Started](#getting-started)

---

## Architecture Overview

```
┌──────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  CLI (cc)    │────▶│  Backend API     │────▶│  Google Gemini   │
│  or Frontend │     │  (Express/Node)  │     │  (AI Analysis)   │
└──────────────┘     └────────┬─────────┘     └─────────────────┘
                              │
                   ┌──────────▼─────────┐
                   │    Pinata IPFS     │
                   │  (JSON Pinning)    │
                   └──────────┬─────────┘
                              │ CID
                   ┌──────────▼─────────┐
                   │  Polygon Amoy      │
                   │  CommitChain.sol   │
                   │  (On-Chain Record) │
                   └────────────────────┘
```

**Flow:** Code Diff → AI Analysis (Gemini) → Pin to IPFS (Pinata) → Record on-chain (Polygon Amoy) → Earn Reputation (+10 REP per contribution)

---

## Tech Stack

### Languages & Runtimes

| Technology    | Version  | Purpose                              |
|:-------------|:---------|:-------------------------------------|
| TypeScript   | ~5.8.0   | Primary language across all packages |
| Solidity     | ^0.8.20  | Smart contract language              |
| Node.js      | ≥18      | Backend & CLI runtime                |

### Frontend

| Package            | Version  | Purpose                                      |
|:-------------------|:---------|:---------------------------------------------|
| Next.js            | 16.1.6   | React framework (App Router, SSR, RSC)       |
| React              | 19.2.3   | UI library                                   |
| React DOM          | 19.2.3   | React DOM renderer                           |
| Tailwind CSS       | ^4       | Utility-first CSS framework                  |
| @tailwindcss/postcss | ^4     | PostCSS integration for Tailwind             |
| ethers.js          | ^6.16.0  | Ethereum provider / wallet / contract calls  |
| ESLint             | ^9       | Code linting                                 |
| eslint-config-next | 16.1.6   | Next.js-specific ESLint rules                |

### Backend

| Package            | Version  | Purpose                                      |
|:-------------------|:---------|:---------------------------------------------|
| Express            | ^4.21.0  | HTTP server framework                        |
| Helmet             | ^7.1.0   | Security headers middleware                  |
| CORS               | ^2.8.5   | Cross-origin resource sharing                |
| express-rate-limit | ^7.4.0   | API rate limiting (30 req / 15 min default)  |
| Zod                | ^3.23.0  | Runtime schema validation                    |
| dotenv             | ^16.4.0  | Environment variable loading                 |
| tsx                | ^4.0.0   | TypeScript execution (dev mode)              |

### CLI

| Package      | Version  | Purpose                                    |
|:-------------|:---------|:-------------------------------------------|
| Commander    | ^12.0.0  | CLI argument parsing & command framework   |
| simple-git   | ^3.27.0  | Programmatic git operations (diff, branch) |
| ethers.js    | ^6.13.0  | On-chain transaction signing               |
| Chalk        | ^5.3.0   | Terminal output coloring                   |
| Ora          | ^8.0.0   | Terminal spinners                          |
| Inquirer     | ^9.3.0   | Interactive CLI prompts                    |

### Smart Contract / Web3

| Package                           | Version  | Purpose                         |
|:----------------------------------|:---------|:--------------------------------|
| Hardhat                           | ^2.22.0  | Ethereum development framework  |
| @nomicfoundation/hardhat-toolbox  | ^5.0.0   | Hardhat plugins (ethers, chai)  |
| ts-node                           | ^10.9.0  | TypeScript execution for Hardhat|
| dotenv                            | ^16.4.0  | Env variable loading            |

### External Services

| Service              | Purpose                                          |
|:---------------------|:-------------------------------------------------|
| Google Gemini AI     | Code diff analysis (model: `gemini-2.5-flash`)   |
| Pinata Cloud         | IPFS pinning (JSON payloads via `pinJSONToIPFS`)  |
| Polygon Amoy Testnet | EVM blockchain (Chain ID: 80002)                 |
| PolygonScan Amoy     | Block explorer (`amoy.polygonscan.com`)           |

### Deployment Platforms

| Platform   | Component | Configuration               |
|:-----------|:----------|:----------------------------|
| Render     | Backend   | Github /backend
| Vercel     | Frontend  | Github /frontend       |
| npm        | CLI       | Published as `@commitchain/cli` |

---

## Project Structure

```
commitchain-monorepo/
├── package.json                 # Root monorepo config
├── hardhat.config.ts            # Root Hardhat 3 config (Sepolia)
├── tsconfig.json                # Root TypeScript config
│
├── contracts/
│   └── CommitChain.sol          # Solidity smart contract
│
├── web3/                        # Hardhat 2 project (Polygon Amoy deployment)
│   ├── package.json
│   ├── hardhat.config.ts        # Amoy network config (Chain ID 80002)
│   ├── scripts/
│   │   └── deploy.ts            # Deployment script
│   ├── artifacts/               # Compiled contract artifacts
│   ├── typechain-types/         # Auto-generated TypeScript bindings
│   └── cache/
│
├── backend/                     # Express API server
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile               # Multi-stage Docker build (node:20-alpine)
│   ├── railway.toml             # Railway deployment config
│   ├── vercel.json              # Vercel serverless config
│   └── src/
│       ├── server.ts            # Entry point — dotenv, boot Express
│       ├── types.ts             # Shared TypeScript interfaces
│       ├── api/
│       │   ├── app.ts           # Express app factory (middleware stack)
│       │   └── routes/
│       │       ├── health.ts    # GET /api/health
│       │       └── submitDiff.ts# POST /api/submit-diff
│       ├── config/
│       │   └── index.ts         # Zod-validated env config
│       ├── middleware/
│       │   └── index.ts         # Rate limiter, API key auth, size guard, error handler
│       ├── services/
│       │   ├── gemini.ts        # Google Gemini AI analysis service
│       │   └── pinata.ts        # Pinata IPFS pinning service
│       └── validation/
│           └── schemas.ts       # Zod request validation schemas
│
├── frontend/                    # Next.js 16 dashboard
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   ├── postcss.config.mjs
│   ├── eslint.config.mjs
│   └── src/
│       ├── app/
│       │   ├── layout.tsx       # Root layout
│       │   ├── page.tsx         # Main dashboard page
│       │   └── globals.css      # Tailwind CSS imports
│       ├── components/
│       │   ├── ContributionCard.tsx   # Contribution card with IPFS data
│       │   └── ContributionModal.tsx  # Detail modal for contributions
│       └── hooks/
│           └── useContract.ts   # React hook — wallet, contract, on-chain data
│
└── cli/                         # CLI tool
    ├── package.json             # Published as @commitchain/cli
    ├── tsconfig.json
    └── src/
        ├── index.ts             # CLI entry point (Commander setup)
        └── commands/
            ├── submit.ts        # submit command — diff → API → on-chain
            ├── commit.ts        # commit command — standalone (with API keys)
            └── config.ts        # config command — view env vars
```

---

## Smart Contract

**File:** `contracts/CommitChain.sol`
**Solidity:** ^0.8.20
**Network:** Polygon Amoy Testnet (Chain ID 80002)
**Deployed Address:** `0x0B1b8155545a3A63C163bf21C5dD70596Fe9A32C`
**Gas per submit:** ~55,000

### Contract Interface

```solidity
contract CommitChain {
    struct Contribution {
        address contributor;
        string  title;
        string  ipfsCID;
        uint256 timestamp;
    }

    Contribution[] public contributions;
    mapping(address => uint256) public reputation;

    // Write — costs gas, awards +10 REP
    function submitContribution(string calldata _title, string calldata _ipfsCID) external;

    // Views — gas-free reads
    function getContributionCount() external view returns (uint256);
    function getContribution(uint256 _id) external view returns (address, string, string, uint256);
    function getAllContributions() external view returns (Contribution[] memory);
    function getReputation(address _user) external view returns (uint256);

    // Events
    event ContributionSubmitted(
        uint256 indexed id, address indexed contributor,
        string title, string ipfsCID, uint256 timestamp, uint256 newReputation
    );
}
```

### Deployment

```bash
cd web3
npx hardhat run scripts/deploy.ts --network amoy
```

Requires `PRIVATE_KEY` and `RPC_URL` in the root `.env` file.

---

## Backend API

**Runtime:** Node.js ≥18 + Express 4
**Port:** 4000 (configurable)
**Base URL:** `https://phantasia-blockchain.onrender.com`

### Middleware Stack (in order)

1. **Helmet** — Security headers (CSP, HSTS, etc.)
2. **CORS** — Configurable origins (`CORS_ORIGINS` env var)
3. **Body Parser** — JSON, 2MB limit
4. **Rate Limiter** — 30 requests per 15 minutes per IP
5. **API Key Auth** — Optional (`API_SECRET_KEY` env var, header: `X-API-Key`)
6. **Diff Size Guard** — 500KB max diff size
7. **Error Handler** — Structured JSON error responses

### AI Analysis Engine (Gemini)

The backend sends diffs to `gemini-2.5-flash` with a deterministic security-auditor system prompt. The AI returns structured scores:

| Score            | Range | Description                          |
|:-----------------|:------|:-------------------------------------|
| `impactScore`    | 0–10  | Functional significance              |
| `qualityScore`   | 0–10  | Code quality & maintainability       |
| `securityScore`  | 0–10  | Security relevance (0 = N/A)         |
| `complexityScore`| 0–10  | Architectural complexity             |
| `sizeScore`      | 0–10  | Lines changed & logical weight       |
| `confidenceScore`| 0–10  | AI confidence in its own analysis    |

Additional fields: `riskLevel`, `contributionType`, `isSecurityRelevant`, `hasSecurityRisk`, `hasBreakingChange`, `introducesVulnerability`, `fixesVulnerability`, `issues[]`, `suggestions[]`.

Diffs are truncated to 15,000 characters before analysis. JSON output is sanitized (trailing commas, comments, unquoted values removed) before parsing.

### IPFS Storage (Pinata)

Contribution payloads are pinned as JSON to IPFS via Pinata's `pinJSONToIPFS` endpoint. The returned CID is stored on-chain.

**Pinned payload schema:**
```json
{
  "title": "Fix auth race condition",
  "diff": "--- a/auth.ts\n+++ b/auth.ts\n...",
  "analysis": { "impactScore": 7, "riskLevel": "low", ... },
  "contributor": "0x1234...abcd",
  "timestamp": 1709312400000,
  "gitBranch": "main"
}
```

**Gateway URL:** `https://gateway.pinata.cloud/ipfs/{CID}`

---

## Frontend Dashboard

**Framework:** Next.js 16.1.6 (App Router)
**Styling:** Tailwind CSS v4
**Wallet:** MetaMask via `window.ethereum` + ethers.js v6

### Key Components

| Component              | File                          | Purpose                                    |
|:-----------------------|:------------------------------|:-------------------------------------------|
| Dashboard (main page)  | `src/app/page.tsx`            | Stats, submit form, contribution feed      |
| ContributionCard       | `src/components/ContributionCard.tsx` | Card with IPFS-fetched AI analysis  |
| ContributionModal      | `src/components/ContributionModal.tsx`| Detail view of a contribution      |
| useContract hook       | `src/hooks/useContract.ts`    | Wallet connection, contract reads/writes   |

### Wallet Integration

The `useContract` hook handles:
- MetaMask connection (`eth_requestAccounts`)
- Automatic network switching to Polygon Amoy (Chain ID 80002)
- Adding the Amoy network if not present (`wallet_addEthereumChain`)
- Read-only provider for fetching contributions without a wallet
- Listening to `ContributionSubmitted` events for real-time updates

### Frontend Submit Flow

1. User fills in title + description + GitHub URL
2. Client-side Gemini analysis (via `NEXT_PUBLIC_GEMINI_API_KEY`)
3. Pin JSON payload to IPFS (via `NEXT_PUBLIC_PINATA_JWT`)
4. Call `submitContribution(title, cid)` on-chain via MetaMask
5. Reset form on success

---

## CLI Tool

**Package:** `@commitchain/cli` (v1.0.5)
**Binary names:** `commitchain`, `cc`
**Architecture:** CLI → Backend API (AI + IPFS) → On-chain TX (user's wallet)

### Commands

#### `commitchain submit`

The primary command. Extracts your git diff, sends it to the backend for AI analysis + IPFS pinning, then records the result on-chain.

```bash
commitchain submit --title "Fix auth race condition"
commitchain submit -t "Add IPFS pinning" -m "Implements Pinata integration"
```

**Options:**

| Flag               | Default                                      | Description                     |
|:-------------------|:---------------------------------------------|:--------------------------------|
| `-t, --title`      | (required)                                   | Contribution title              |
| `-m, --message`    | —                                            | Optional description            |
| `-b, --branch`     | auto-detected                                | Git branch name                 |
| `--api <url>`      | `https://phantasia-blockchain.onrender.com`  | Backend API URL                 |
| `--rpc <url>`      | `https://rpc-amoy.polygon.technology`        | Polygon Amoy RPC                |
| `--contract <addr>`| `0x0B1b...9A32C`                             | Contract address                |
| `--private-key`    | `$PRIVATE_KEY`                               | Wallet private key              |

**5-Step Flow:**

1. **Extract git diff** — Tries staged → unstaged → `HEAD~1`
2. **Wallet setup** — Uses `PRIVATE_KEY` to derive address
3. **Backend API call** — Sends diff to `/api/submit-diff`, gets back AI analysis + IPFS CID
4. **On-chain TX** — Calls `submitContribution(title, cid)` via ethers.js
5. **Auto git commit + push** — Commits with metadata and pushes to remote

#### `commitchain config`

Displays current CLI configuration status.

```bash
commitchain config --show
```

### Installation

```bash
# Global install
npm install -g @commitchain/cli

# Or from source
cd cli && npm install && npm link
```

---

## Deployment

### Backend — Render (Primary)

**Builder:** Nixpacks
**Dockerfile:** Multi-stage build (node:20-alpine)
**Health check:** `GET /api/health`
**Restart policy:** On failure, max 3 retries

```bash
cd backend
npm run build   # tsc → dist/
npm start       # node dist/server.js (port 4000)
```

### Backend — Vercel (Alternative)

Uses `@vercel/node` to deploy `src/server.ts` as a serverless function.

```json
{
  "builds": [{ "src": "src/server.ts", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "src/server.ts" }]
}
```

### Backend — Railway (Alternative)

Uses Nixpacks builder with `railway.toml`:

```toml
[deploy]
  startCommand = "node dist/server.js"
  healthcheckPath = "/api/health"
```

### Backend — Docker

```bash
cd backend
docker build -t commitchain-backend .
docker run -p 4000:4000 --env-file .env commitchain-backend
```

### Frontend — Vercel

Next.js is auto-detected by Vercel. Push to GitHub → auto-deploy.

```bash
cd frontend
npm run build   # next build
npm start       # next start
```

### Smart Contract — Hardhat

```bash
cd web3
npx hardhat compile
npx hardhat run scripts/deploy.ts --network amoy
```

---

## Environment Variables

### Root `.env`

```env
PRIVATE_KEY=               # Deployer/CLI wallet private key
RPC_URL=                   # Polygon Amoy RPC (default: https://rpc-amoy.polygon.technology)
```

### Backend `.env`

```env
PORT=4000                  # Server port
NODE_ENV=development       # development | production | test
GEMINI_API_KEY=            # Google Gemini API key (required)
PINATA_JWT=                # Pinata JWT token (required)
API_SECRET_KEY=            # Optional API key for auth (leave empty = public)
RATE_LIMIT_WINDOW_MS=900000  # Rate limit window (15 min)
RATE_LIMIT_MAX_REQUESTS=30   # Max requests per window
CORS_ORIGINS=              # Comma-separated allowed origins
```

### Frontend `.env.local`

```env
NEXT_PUBLIC_CONTRACT_ADDRESS=0x0B1b8155545a3A63C163bf21C5dD70596Fe9A32C
NEXT_PUBLIC_CHAIN_ID=80002
NEXT_PUBLIC_RPC_URL=https://rpc-amoy.polygon.technology
NEXT_PUBLIC_PINATA_JWT=     # Pinata JWT (for client-side pinning)
NEXT_PUBLIC_GEMINI_API_KEY= # Gemini key (for client-side analysis)
```

### CLI Environment

```env
PRIVATE_KEY=               # Wallet private key (used locally for TX signing)
COMMITCHAIN_CONTRACT=      # Contract address (optional override)
COMMITCHAIN_API_URL=       # Backend API URL (optional override)
```

---

## API Reference

### `GET /api/health`

Health check endpoint.

**Response:**
```json
{
  "status": "ok",
  "service": "commitchain-backend",
  "version": "1.0.0",
  "uptime": 3600,
  "timestamp": "2026-03-01T12:00:00.000Z"
}
```

### `POST /api/submit-diff`

Submit a git diff for AI analysis and IPFS pinning.

**Headers:**
- `Content-Type: application/json`
- `X-API-Key: <key>` (optional, if `API_SECRET_KEY` is configured)

**Request Body:**
```json
{
  "title": "Fix auth race condition",
  "diff": "--- a/auth.ts\n+++ b/auth.ts\n@@ -10,6 +10,8 @@\n...",
  "contributor": "0x1234567890abcdef1234567890abcdef12345678",
  "gitBranch": "main",
  "message": "Optional description"
}
```

**Validation:**
- `title`: 3–200 characters (required)
- `diff`: non-empty, max 500KB (required)
- `contributor`: valid Ethereum address `0x[a-fA-F0-9]{40}` (required)
- `gitBranch`: string (optional)
- `message`: max 500 characters (optional)

**Success Response (200):**
```json
{
  "success": true,
  "cid": "QmXoY...",
  "analysis": {
    "summary": "Fixes a race condition in the authentication flow...",
    "impactScore": 7,
    "qualityScore": 8,
    "securityScore": 6,
    "complexityScore": 5,
    "sizeScore": 4,
    "confidenceScore": 8,
    "riskLevel": "low",
    "contributionType": "bugfix",
    "isSecurityRelevant": true,
    "hasSecurityRisk": false,
    "hasBreakingChange": false,
    "introducesVulnerability": false,
    "fixesVulnerability": true,
    "issues": [],
    "suggestions": ["Consider adding integration tests"]
  },
  "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXoY..."
}
```

**Error Responses:**

| Code | Body                                                   | Cause                   |
|:-----|:-------------------------------------------------------|:------------------------|
| 400  | `{ success: false, error: "...", code: "VALIDATION_ERROR" }` | Invalid input     |
| 401  | `{ success: false, error: "...", code: "UNAUTHORIZED" }`     | Bad API key       |
| 413  | `{ success: false, error: "...", code: "PAYLOAD_TOO_LARGE" }`| Diff > 500KB     |
| 429  | `{ success: false, error: "...", code: "RATE_LIMITED" }`      | Rate limit hit   |
| 500  | `{ success: false, error: "..." }`                            | Internal error   |

---

## Data Flow

```
Developer
    │
    ├─ [CLI] commitchain submit --title "Fix bug"
    │     │
    │     ├── 1. simple-git extracts diff (staged → unstaged → HEAD~1)
    │     ├── 2. POST /api/submit-diff { title, diff, contributor }
    │     │        │
    │     │        ├── Backend validates input (Zod)
    │     │        ├── Sends diff to Gemini 2.5 Flash
    │     │        ├── Receives AI analysis JSON
    │     │        ├── Pins { title, diff, analysis } to IPFS via Pinata
    │     │        └── Returns { cid, analysis, ipfsUrl }
    │     │
    │     ├── 3. ethers.js calls CommitChain.submitContribution(title, cid)
    │     ├── 4. Smart contract stores { contributor, title, cid, timestamp }
    │     ├── 5. Smart contract awards +10 reputation
    │     └── 6. Auto git commit + push
    │
    └─ [Frontend] Browser Dashboard
          │
          ├── Connects wallet via MetaMask (window.ethereum)
          ├── Reads contributions via getAllContributions() (gas-free)
          ├── Reads reputation via getReputation(address) (gas-free)
          ├── Fetches IPFS payloads from gateway.pinata.cloud
          └── Displays AI analysis cards with scores & security flags
```

---

## Getting Started

### Prerequisites

- Node.js ≥ 18
- Git
- MetaMask browser extension
- Polygon Amoy testnet POL (get from [Polygon Faucet](https://faucet.polygon.technology/))

### 1. Clone & Install

```bash
git clone https://github.com/your-org/commitchain.git
cd commitchain
npm run install:all
```

### 2. Configure Environment

```bash
# Root .env
cp .env.example .env
# Add PRIVATE_KEY, RPC_URL

# Backend
cp backend/.env.example backend/.env
# Add GEMINI_API_KEY, PINATA_JWT

# Frontend
cp frontend/.env.local.example frontend/.env.local
# Add NEXT_PUBLIC_CONTRACT_ADDRESS, NEXT_PUBLIC_PINATA_JWT, NEXT_PUBLIC_GEMINI_API_KEY
```

### 3. Deploy Contract

```bash
cd web3
npx hardhat run scripts/deploy.ts --network amoy
# Copy the deployed address to your .env files
```

### 4. Run Backend

```bash
cd backend
npm run dev    # Development (tsx watch)
# or
npm run build && npm start   # Production
```

### 5. Run Frontend

```bash
cd frontend
npm run dev    # http://localhost:3000
```

### 6. Use CLI

```bash
cd cli
npm install && npm link
export PRIVATE_KEY=your_key_here
commitchain submit --title "My first contribution"
```

---

## License

MIT

---

*CommitChain · Decentralized AI-Powered Open Source Contribution Protocol · 2026*
```

### Make a deployment to Sepolia

This project includes an example Ignition module to deploy the contract. You can deploy this module to a locally simulated chain or to Sepolia.

To run the deployment to a local chain:

```shell
npx hardhat ignition deploy ignition/modules/Counter.ts
```

To run the deployment to Sepolia, you need an account with funds to send the transaction. The provided Hardhat configuration includes a Configuration Variable called `SEPOLIA_PRIVATE_KEY`, which you can use to set the private key of the account you want to use.

You can set the `SEPOLIA_PRIVATE_KEY` variable using the `hardhat-keystore` plugin or by setting it as an environment variable.

To set the `SEPOLIA_PRIVATE_KEY` config variable using `hardhat-keystore`:

```shell
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

After setting the variable, you can run the deployment with the Sepolia network:

```shell
npx hardhat ignition deploy --network sepolia ignition/modules/Counter.ts
```
