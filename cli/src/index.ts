#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  CommitChain CLI — commitchain submit --title "Fix auth bug"
//  No API keys required. Sends diffs to the CommitChain backend.
// ═══════════════════════════════════════════════════════════════

import { Command } from "commander";
import { submitCommand } from "./commands/submit.js";
import { configCommand } from "./commands/config.js";

const program = new Command();

program
  .name("commitchain")
  .description(
    "CommitChain — AI-powered decentralized contribution protocol.\n" +
    "Submit code contributions that are AI-analyzed, pinned to IPFS,\n" +
    "and recorded on-chain. No API keys needed — just your wallet."
  )
  .version("1.0.0");

program
  .command("submit")
  .description("Submit your git diff → AI analysis → IPFS → on-chain")
  .requiredOption("-t, --title <title>", "Contribution title")
  .option("-m, --message <message>", "Optional description")
  .option("-b, --branch <branch>", "Git branch name (auto-detected if omitted)")
  .option("--api <url>", "Override backend API URL", process.env.COMMITCHAIN_API_URL || "https://phantasia-blockchain.onrender.com")
  .option("--rpc <url>", "RPC URL", "https://rpc-amoy.polygon.technology")
  .option("--contract <address>", "Contract address", process.env.COMMITCHAIN_CONTRACT || "0x0B1b8155545a3A63C163bf21C5dD70596Fe9A32C")
  .option("--private-key <key>", "Private key (or set PRIVATE_KEY env var)")
  .action(async (opts) => {
    await submitCommand(opts);
  });

program
  .command("config")
  .description("View or set CLI configuration")
  .option("--show", "Show current config")
  .action(async (opts) => {
    await configCommand(opts);
  });

program.parse();
