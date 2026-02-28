#!/usr/bin/env node
// ═══════════════════════════════════════════════════════════════
//  CommitChain CLI — cc commit --title "Fix auth bug"
// ═══════════════════════════════════════════════════════════════

import { Command } from "commander";
import { commitCommand } from "./commands/commit.js";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load .env from project root
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const program = new Command();

program
  .name("cc")
  .description("CommitChain — AI-powered decentralized contribution protocol")
  .version("1.0.0");

program
  .command("commit")
  .description("Analyze git diff with AI, pin to IPFS, and record on-chain")
  .requiredOption("-t, --title <title>", "Contribution title")
  .option("-m, --message <message>", "Optional description")
  .action(async (opts) => {
    await commitCommand(opts.title, opts.message);
  });

program.parse();
