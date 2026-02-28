import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import path from "path";

// Load root .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const PRIVATE_KEY = process.env.PRIVATE_KEY ?? "";
const RPC_URL =
  process.env.RPC_URL ??
  process.env.NEXT_PUBLIC_RPC_URL ??
  "https://rpc-amoy.polygon.technology";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: { enabled: true, runs: 200 },
      evmVersion: "paris",
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    amoy: {
      url: RPC_URL,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
      chainId: 80002,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
    },
  },
};

export default config;
