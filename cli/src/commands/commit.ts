// ═══════════════════════════════════════════════════════════════
//  COMMIT COMMAND — The killer flow
// ═══════════════════════════════════════════════════════════════

import chalk from "chalk";
import { simpleGit } from "simple-git";
import { JsonRpcProvider, Wallet, Contract } from "ethers";

// ─── Inline service calls (to avoid monorepo import complexity in CLI) ──

const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? "";
const PINATA_JWT = process.env.PINATA_JWT ?? process.env.NEXT_PUBLIC_PINATA_JWT ?? "";
const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const RPC_URL = process.env.RPC_URL ?? process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc-amoy.polygon.technology";
const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? process.env.CONTRACT_ADDRESS ?? "";

const ABI = [
  "function submitContribution(string calldata _title, string calldata _ipfsCID) external",
  "event ContributionSubmitted(uint256 indexed id, address indexed contributor, string title, string ipfsCID, uint256 timestamp, uint256 newReputation)",
];

interface AIAnalysis {
  summary: string;
  impactScore: number;
  riskLevel: string;
  contributionType: string;
  suggestions: string[];
}

// ─── HELPERS ─────────────────────────────────────────────────────

function log(icon: string, label: string, value: string) {
  console.log(`  ${icon} ${chalk.gray(label)} ${chalk.white(value)}`);
}

function header(text: string) {
  console.log(`\n${chalk.cyan.bold("▸")} ${chalk.bold(text)}`);
}

// ─── GEMINI ──────────────────────────────────────────────────────

async function analyzeWithGemini(title: string, diff: string): Promise<AIAnalysis> {
  if (!GEMINI_API_KEY) {
    console.log(chalk.yellow("  ⚠ GEMINI_API_KEY not set — using mock analysis"));
    return {
      summary: `Contribution: "${title}"`,
      impactScore: 5,
      riskLevel: "medium",
      contributionType: "feature",
      suggestions: ["Add tests", "Update docs"],
    };
  }

  const truncated = diff.length > 12000 ? diff.slice(0, 12000) + "\n...[truncated]" : diff;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `You are an expert code reviewer. Analyze this git diff and return ONLY valid JSON:\n{"summary":"...","impactScore":<0-10>,"riskLevel":"<low|medium|high|critical>","contributionType":"<bugfix|feature|refactor|docs|test|chore|security|performance>","suggestions":["..."]}\n\nTitle: ${title}\n\nDiff:\n\`\`\`\n${truncated}\n\`\`\``,
              },
            ],
          },
        ],
        generationConfig: { temperature: 0.2, maxOutputTokens: 1024 },
      }),
    }
  );

  if (!res.ok) throw new Error(`Gemini API error: ${res.status}`);

  const json = await res.json();
  const text: string = json?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```\s*/g, "").trim();
  return JSON.parse(cleaned) as AIAnalysis;
}

// ─── PINATA ──────────────────────────────────────────────────────

async function pinToIPFS(payload: Record<string, unknown>): Promise<string> {
  if (!PINATA_JWT) throw new Error("PINATA_JWT is not set.");

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: payload,
      pinataMetadata: { name: `cc-${Date.now()}` },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata error: ${err}`);
  }
  const json = await res.json();
  return json.IpfsHash as string;
}

// ─── BLOCKCHAIN ──────────────────────────────────────────────────

async function submitOnChain(title: string, cid: string): Promise<string> {
  if (!PRIVATE_KEY) throw new Error("PRIVATE_KEY is not set.");
  if (!CONTRACT_ADDRESS) throw new Error("CONTRACT_ADDRESS is not set.");

  const provider = new JsonRpcProvider(RPC_URL);
  const wallet = new Wallet(PRIVATE_KEY, provider);
  const contract = new Contract(CONTRACT_ADDRESS, ABI, wallet);

  const tx = await contract.submitContribution(title, cid);
  const receipt = await tx.wait();
  return receipt.hash ?? tx.hash;
}

// ═══════════════════════════════════════════════════════════════
//  MAIN COMMAND
// ═══════════════════════════════════════════════════════════════

export async function commitCommand(title: string, _message?: string) {
  console.log(
    chalk.cyan.bold("\n  ╔══════════════════════════════════════════╗")
  );
  console.log(
    chalk.cyan.bold("  ║      CommitChain — AI Commit Flow        ║")
  );
  console.log(
    chalk.cyan.bold("  ╚══════════════════════════════════════════╝\n")
  );

  try {
    // ── Step 1: Extract git diff ──────────────────────────────
    header("Step 1 — Extracting git diff");
    const git = simpleGit();

    // Try staged first, then unstaged, then last commit
    let diff = await git.diff(["--staged"]);
    if (!diff) {
      diff = await git.diff();
    }
    if (!diff) {
      diff = await git.diff(["HEAD~1"]);
    }
    if (!diff) {
      console.log(chalk.red("  ✖ No git diff found. Stage or commit changes first."));
      console.log(chalk.gray("    Try: git add . && cc commit --title \"...\""));
      process.exit(1);
    }

    const lines = diff.split("\n").length;
    log("📄", "Diff lines:", `${lines}`);
    log("📝", "Title:", title);

    // ── Step 2: AI Analysis ───────────────────────────────────
    header("Step 2 — AI Analysis (Gemini)");
    const analysis = await analyzeWithGemini(title, diff);
    log("🧠", "Summary:", analysis.summary);
    log("⚡", "Impact:", `${analysis.impactScore}/10`);
    log("🛡️", "Risk:", analysis.riskLevel);
    log("🏷️", "Type:", analysis.contributionType);
    if (analysis.suggestions.length > 0) {
      log("💡", "Suggestions:", analysis.suggestions.join("; "));
    }

    // ── Step 3: Pin to IPFS ───────────────────────────────────
    header("Step 3 — Pinning to IPFS (Pinata)");
    const payload = {
      title,
      diff,
      analysis,
      contributor: "",
      timestamp: Date.now(),
    };

    // Fill contributor from wallet if possible
    if (PRIVATE_KEY) {
      const wallet = new Wallet(PRIVATE_KEY);
      payload.contributor = wallet.address;
    }

    const cid = await pinToIPFS(payload);
    log("📌", "IPFS CID:", cid);
    log("🔗", "Gateway:", `https://gateway.pinata.cloud/ipfs/${cid}`);

    // ── Step 4: On-chain TX ───────────────────────────────────
    header("Step 4 — Recording on Polygon Amoy");
    const txHash = await submitOnChain(title, cid);
    log("⛓️", "TX Hash:", txHash);
    log("🔍", "Explorer:", `https://amoy.polygonscan.com/tx/${txHash}`);

    // ── Done ──────────────────────────────────────────────────
    console.log(
      chalk.green.bold("\n  ✅ Contribution recorded successfully!\n")
    );
    console.log(chalk.gray("  Reputation +10 earned on-chain 🏆\n"));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    // Handle MetaMask / wallet rejection
    if (msg.includes("4001") || msg.includes("rejected")) {
      console.log(chalk.red("\n  ✖ Transaction rejected by wallet."));
    } else {
      console.log(chalk.red(`\n  ✖ Error: ${msg}`));
    }
    process.exit(1);
  }
}
