// ═══════════════════════════════════════════════════════════════
//  CONFIG COMMAND — Show/manage CLI configuration
// ═══════════════════════════════════════════════════════════════

import chalk from "chalk";

interface ConfigOptions {
  show?: boolean;
}

export async function configCommand(_opts: ConfigOptions) {
  console.log(
    chalk.cyan.bold("\n  ╔══════════════════════════════════════════╗")
  );
  console.log(
    chalk.cyan.bold("  ║      CommitChain — Configuration         ║")
  );
  console.log(
    chalk.cyan.bold("  ╚══════════════════════════════════════════╝\n")
  );

  const privateKey = process.env.PRIVATE_KEY;
  const contract =
    process.env.COMMITCHAIN_CONTRACT ??
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS;

  console.log(chalk.bold("  Environment Variables:\n"));

  const vars = [
    {
      name: "PRIVATE_KEY",
      value: privateKey ? `${privateKey.slice(0, 6)}...${privateKey.slice(-4)}` : undefined,
      required: true,
      desc: "Your wallet private key (used only locally to sign TXs)",
    },
    {
      name: "COMMITCHAIN_CONTRACT",
      value: contract,
      required: false,
      desc: "CommitChain contract address on Polygon Amoy",
    },
  ];

  for (const v of vars) {
    const status = v.value
      ? chalk.green("✓ SET")
      : v.required
        ? chalk.red("✖ MISSING")
        : chalk.yellow("○ NOT SET");

    console.log(`  ${status}  ${chalk.bold(v.name)}`);
    if (v.value) {
      console.log(`         ${chalk.gray(v.value)}`);
    }
    console.log(`         ${chalk.dim(v.desc)}\n`);
  }

  console.log(chalk.bold("  CLI Flags (override env vars):\n"));
  console.log(chalk.gray("  --api <url>          Backend API URL"));
  console.log(chalk.gray("  --rpc <url>          RPC URL"));
  console.log(chalk.gray("  --contract <addr>    Contract address"));
  console.log(chalk.gray("  --private-key <key>  Wallet private key"));
  console.log("");

  console.log(chalk.bold("  Quick Start:\n"));
  console.log(
    chalk.white(
      '  $ export PRIVATE_KEY=your_key_here\n  $ commitchain submit --title "Fix login bug"\n'
    )
  );
}
