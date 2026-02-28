// ═══════════════════════════════════════════════════════════════
//  SUBMIT COMMAND — The secure contribution flow
//  CLI → Backend API (AI + IPFS) → On-chain TX (user's wallet)
//  No API keys required from contributors!
// ═══════════════════════════════════════════════════════════════

import chalk from "chalk";
import { simpleGit } from "simple-git";
import { JsonRpcProvider, Wallet, Contract } from "ethers";

// ─── Contract ABI (minimal) ─────────────────────────────────

const ABI = [
  "function submitContribution(string calldata _title, string calldata _ipfsCID) external",
  "event ContributionSubmitted(uint256 indexed id, address indexed contributor, string title, string ipfsCID, uint256 timestamp, uint256 newReputation)",
];

// ─── Types ───────────────────────────────────────────────────

interface SubmitOptions {
  title: string;
  message?: string;
  branch?: string;
  api: string;
  rpc: string;
  contract?: string;
  privateKey?: string;
}

interface APIResponse {
  success: boolean;
  cid?: string;
  analysis?: {
    summary: string;
    impactScore: number;
    riskLevel: string;
    contributionType: string;
    suggestions: string[];
  };
  ipfsUrl?: string;
  error?: string;
  code?: string;
}

// ─── Helpers ─────────────────────────────────────────────────

function log(icon: string, label: string, value: string) {
  console.log(`  ${icon} ${chalk.gray(label)} ${chalk.white(value)}`);
}

function header(text: string) {
  console.log(`\n${chalk.cyan.bold("▸")} ${chalk.bold(text)}`);
}

function spinner(text: string) {
  process.stdout.write(`  ${chalk.yellow("⏳")} ${text}...`);
}

function done() {
  process.stdout.write(chalk.green(" ✓\n"));
}

// ═══════════════════════════════════════════════════════════════
//  MAIN FLOW
// ═══════════════════════════════════════════════════════════════

export async function submitCommand(opts: SubmitOptions) {
  console.log(
    chalk.cyan.bold("\n  ╔══════════════════════════════════════════╗")
  );
  console.log(
    chalk.cyan.bold("  ║      CommitChain — Submit Contribution   ║")
  );
  console.log(
    chalk.cyan.bold("  ╚══════════════════════════════════════════╝\n")
  );

  const privateKey = opts.privateKey ?? process.env.PRIVATE_KEY ?? "";
  const contractAddress =
    opts.contract ??
    process.env.COMMITCHAIN_CONTRACT ??
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
    "";
  const rpcUrl = opts.rpc;
  const apiUrl = opts.api;

  try {
    // ── Step 1: Extract git diff ──────────────────────────────
    header("Step 1 — Extracting git diff");
    const git = simpleGit();

    // Detect branch
    const branch = opts.branch ?? (await git.revparse(["--abbrev-ref", "HEAD"]));

    // Try staged → unstaged → last commit
    let diff = await git.diff(["--staged"]);
    if (!diff) diff = await git.diff();
    if (!diff) diff = await git.diff(["HEAD~1"]);

    if (!diff) {
      console.log(
        chalk.red("  ✖ No git diff found. Stage or commit changes first.")
      );
      console.log(
        chalk.gray('    Try: git add . && commitchain submit --title "..."')
      );
      process.exit(1);
    }

    const lines = diff.split("\n").length;
    log("📄", "Diff lines:", `${lines}`);
    log("📝", "Title:", opts.title);
    log("🌿", "Branch:", branch);

    // ── Step 2: Get wallet address ────────────────────────────
    header("Step 2 — Wallet");
    if (!privateKey) {
      console.log(
        chalk.red(
          "  ✖ No wallet key found. Set PRIVATE_KEY env var or use --private-key"
        )
      );
      console.log(
        chalk.gray(
          "    Your key is only used locally to sign the on-chain TX."
        )
      );
      process.exit(1);
    }

    const wallet = new Wallet(privateKey);
    log("👛", "Wallet:", wallet.address);

    // ── Step 3: Send to backend API ───────────────────────────
    header("Step 3 — AI Analysis + IPFS (via backend)");
    spinner("Sending diff to CommitChain API");

    const res = await fetch(`${apiUrl}/api/submit-diff`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: opts.title,
        diff,
        contributor: wallet.address,
        gitBranch: branch,
        message: opts.message,
      }),
    });

    const data: APIResponse = await res.json();

    if (!data.success || !data.cid || !data.analysis) {
      done();
      console.log(
        chalk.red(`\n  ✖ Backend error: ${data.error ?? "Unknown error"}`)
      );
      if (data.code === "RATE_LIMITED") {
        console.log(
          chalk.gray("    You've hit the rate limit. Try again in a few minutes.")
        );
      }
      process.exit(1);
    }

    done();

    const { cid, analysis, ipfsUrl } = data;

    log("🧠", "Summary:", analysis.summary);
    log("⚡", "Impact:", `${analysis.impactScore}/10`);
    log("🛡️", "Risk:", analysis.riskLevel);
    log("🏷️", "Type:", analysis.contributionType);
    if (analysis.suggestions.length > 0) {
      log("💡", "Tips:", analysis.suggestions.join("; "));
    }
    log("📌", "IPFS CID:", cid);
    log("🔗", "Gateway:", ipfsUrl!);

    // ── Step 4: On-chain TX ───────────────────────────────────
    header("Step 4 — Recording on-chain");

    if (!contractAddress) {
      console.log(
        chalk.yellow(
          "  ⚠ No contract address set. Set COMMITCHAIN_CONTRACT env var or use --contract"
        )
      );
      console.log(chalk.gray("    Skipping on-chain recording."));
      console.log(
        chalk.green.bold("\n  ✅ AI analysis + IPFS pinning complete!\n")
      );
      return;
    }

    spinner("Submitting transaction");

    const provider = new JsonRpcProvider(rpcUrl);
    const signer = new Wallet(privateKey, provider);
    const contract = new Contract(contractAddress, ABI, signer);

    const tx = await contract.submitContribution(opts.title, cid);
    const receipt = await tx.wait();
    done();

    const txHash = receipt.hash ?? tx.hash;
    log("⛓️", "TX Hash:", txHash);
    log("🔍", "Explorer:", `https://amoy.polygonscan.com/tx/${txHash}`);

    // ── Done ──────────────────────────────────────────────────
    console.log(
      chalk.green.bold("\n  ✅ Contribution recorded successfully!\n")
    );
    console.log(chalk.gray("  Reputation +10 earned on-chain 🏆\n"));
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);

    if (msg.includes("ECONNREFUSED") || msg.includes("fetch failed")) {
      console.log(
        chalk.red("\n  ✖ Cannot reach CommitChain backend API.")
      );
      console.log(chalk.gray(`    URL: ${apiUrl}`));
      console.log(
        chalk.gray("    Is the backend running? Use --api to set a custom URL.")
      );
    } else if (msg.includes("4001") || msg.includes("rejected")) {
      console.log(chalk.red("\n  ✖ Transaction rejected by wallet."));
    } else {
      console.log(chalk.red(`\n  ✖ Error: ${msg}`));
    }
    process.exit(1);
  }
}
