# @commitchain/cli

> AI-powered decentralized contribution protocol. Submit code contributions that are AI-analyzed, pinned to IPFS, and recorded on-chain.

**No API keys needed** — contributors only need their wallet private key. All AI analysis and IPFS pinning is handled by the CommitChain backend.

## Install

```bash
npm install -g @commitchain/cli
```

## Quick Start

```bash
# 1. Set your wallet key (used only locally to sign TXs)
export PRIVATE_KEY=your_private_key_here

# 2. Set the contract address (optional — skips on-chain if not set)
export COMMITCHAIN_CONTRACT=0x0B1b8155545a3A63C163bf21C5dD70596Fe9A32C

# 3. Make changes, stage them, and submit
git add .
commitchain submit --title "Fix authentication bug"
```

## How It Works

```
┌─────────────┐     ┌──────────────────┐     ┌──────────────┐
│  Your Code  │────▸│  CommitChain API  │────▸│  IPFS (CID)  │
│  (git diff) │     │  (AI + Pinning)   │     │  + AI Report │
└─────────────┘     └──────────────────┘     └──────────────┘
       │                                              │
       │            ┌──────────────────┐              │
       └───────────▸│  Smart Contract  │◂─────────────┘
                    │  (your wallet TX)│
                    └──────────────────┘
```

1. **CLI extracts** your git diff locally
2. **Backend API** runs Gemini AI analysis and pins to IPFS (you don't need any API keys)
3. **You sign** the on-chain transaction with your own wallet
4. **Reputation** is awarded on-chain (+10 per contribution)

## Commands

### `commitchain submit`

Submit a contribution.

```bash
commitchain submit --title "Add user authentication" [options]
```

| Flag | Description | Default |
|------|-------------|---------|
| `-t, --title <title>` | Contribution title | **required** |
| `-m, --message <msg>` | Optional description | — |
| `-b, --branch <name>` | Git branch | auto-detected |
| `--api <url>` | Backend API URL | `https://commitchain-api.vercel.app` |
| `--rpc <url>` | RPC URL | `https://rpc-amoy.polygon.technology` |
| `--contract <addr>` | Contract address | `$COMMITCHAIN_CONTRACT` |
| `--private-key <key>` | Wallet private key | `$PRIVATE_KEY` |

### `commitchain config`

View current configuration.

```bash
commitchain config --show
```

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `PRIVATE_KEY` | Yes | Your wallet private key (never sent to the backend) |
| `COMMITCHAIN_CONTRACT` | No | Smart contract address |

## Security

- **Your private key never leaves your machine.** It's only used locally to sign the on-chain transaction.
- **No API keys required.** The backend API handles Gemini AI and IPFS Pinata calls using the maintainer's keys.
- **Diffs are sent to the backend** for AI analysis and IPFS pinning. Don't submit sensitive/proprietary code to public instances.

## License

MIT
