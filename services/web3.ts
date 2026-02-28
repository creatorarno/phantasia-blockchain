// ═══════════════════════════════════════════════════════════════
//  WEB3 SERVICE — Contract ABI, config & helpers
// ═══════════════════════════════════════════════════════════════

export const COMMITCHAIN_ABI = [
  // ─── Write ───
  "function submitContribution(string calldata _title, string calldata _ipfsCID) external",
  // ─── Read ───
  "function getContributionCount() external view returns (uint256)",
  "function getContribution(uint256 _id) external view returns (address contributor, string title, string ipfsCID, uint256 timestamp)",
  "function reputation(address) external view returns (uint256)",
  "function getReputation(address _user) external view returns (uint256)",
  "function getAllContributions() external view returns (tuple(address contributor, string title, string ipfsCID, uint256 timestamp)[])",
  // ─── Event ───
  "event ContributionSubmitted(uint256 indexed id, address indexed contributor, string title, string ipfsCID, uint256 timestamp, uint256 newReputation)",
] as const;

export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ??
  process.env.CONTRACT_ADDRESS ??
  "";

export const CHAIN_CONFIG = {
  chainId:
    "0x" +
    Number(
      process.env.NEXT_PUBLIC_CHAIN_ID ??
        process.env.CHAIN_ID ??
        80002
    ).toString(16),
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: [
    process.env.NEXT_PUBLIC_RPC_URL ??
      process.env.RPC_URL ??
      "https://rpc-amoy.polygon.technology",
  ],
  blockExplorerUrls: ["https://amoy.polygonscan.com"],
} as const;

export const RPC_URL = CHAIN_CONFIG.rpcUrls[0];
