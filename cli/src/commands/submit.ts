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
    qualityScore: number;
    securityScore: number;
    complexityScore: number;
    sizeScore: number;
    confidenceScore: number;
    riskLevel: string;
    contributionType: string;
    isSecurityRelevant: boolean;
    hasSecurityRisk: boolean;
    hasBreakingChange: boolean;
    introducesVulnerability: boolean;
    fixesVulnerability: boolean;
    issues: string[];
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
    "0x0B1b8155545a3A63C163bf21C5dD70596Fe9A32C";
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

    // Handle non-JSON responses (e.g. Render deploy page, 502, etc.)
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      done();
      const text = await res.text();
      console.log(
        chalk.red(`\n  ✖ Backend returned non-JSON response (HTTP ${res.status})`)
      );
      console.log(
        chalk.gray(`    Response: ${text.slice(0, 120)}...`)
      );
      console.log(
        chalk.yellow(`\n    Possible causes:`)
      );
      console.log(
        chalk.gray(`    - Backend not deployed yet (check Render dashboard)`)
      );
      console.log(
        chalk.gray(`    - Wrong API URL: ${apiUrl}`)
      );
      console.log(
        chalk.gray(`    - Backend crashed (check Render logs)`)
      );
      console.log(
        chalk.gray(`\n    Use --api <url> to set the correct backend URL`)
      );
      process.exit(1);
    }

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
    log("✨", "Quality:", `${analysis.qualityScore}/10`);
    log("🔒", "Security:", `${analysis.securityScore}/10`);
    log("🧩", "Complexity:", `${analysis.complexityScore}/10`);
    log("📏", "Size:", `${analysis.sizeScore}/10`);
    log("🎯", "Confidence:", `${analysis.confidenceScore}/10`);
    log("🛡️", "Risk:", analysis.riskLevel);
    log("🏷️", "Type:", analysis.contributionType);

    // Security flags
    if (analysis.hasSecurityRisk || analysis.introducesVulnerability) {
      console.log(chalk.red.bold("  🚨 SECURITY WARNING:"));
      if (analysis.hasSecurityRisk)
        console.log(chalk.red("     ⚠ This change has security risk"));
      if (analysis.introducesVulnerability)
        console.log(chalk.red("     ⚠ This change may introduce a vulnerability"));
    }
    if (analysis.fixesVulnerability) {
      console.log(chalk.green("  🛡️ This change fixes a vulnerability"));
    }
    if (analysis.hasBreakingChange) {
      console.log(chalk.yellow("  ⚠ This change contains breaking changes"));
    }

    // Issues
    if (analysis.issues.length > 0) {
      log("🐛", "Issues:", analysis.issues.join("; "));
    }
    // Suggestions
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

    // ── Step 5: Auto-commit changes to git ────────────────────
    header("Step 5 — Committing changes to git");
    try {
      // Stage all changes
      await git.add("-A");

      const commitMsg = `[CommitChain] ${opts.title}\n\nCID: ${cid}\nTX: ${txHash}\nImpact: ${analysis.impactScore}/10 | Risk: ${analysis.riskLevel} | Type: ${analysis.contributionType}`;
      await git.commit(commitMsg);

      // Push to remote if available
      try {
        const remotes = await git.getRemotes(true);
        if (remotes.length > 0) {
          spinner("Pushing to remote");
          await git.push();
          done();
          log("🚀", "Pushed to:", `origin/${branch}`);
        }
      } catch {
        console.log(chalk.yellow("  ⚠ Could not push to remote (you can push manually)"));
      }

      log("✅", "Committed:", commitMsg.split("\n")[0]);
    } catch (commitErr: unknown) {
      const commitMsg = commitErr instanceof Error ? commitErr.message : String(commitErr);
      if (commitMsg.includes("nothing to commit")) {
        console.log(chalk.gray("  ℹ Changes already committed."));
      } else {
        console.log(chalk.yellow(`  ⚠ Auto-commit failed: ${commitMsg}`));
        console.log(chalk.gray("    Your on-chain submission succeeded. Commit manually to prevent duplicate submissions."));
      }
    }

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
