// ─── ABI (only the functions the frontend uses) ──────────────────
export const CONTRIBUTION_ABI = [
  "function submitContribution(string calldata _ipfsHash) external",
  "function getContributionCount() external view returns (uint256)",
  "function getContribution(uint256 _id) external view returns (address, string, uint256)",
  "function getReputation(address _user) external view returns (uint256)",
  "function reputation(address) external view returns (uint256)",
  "event ContributionSubmitted(uint256 indexed id, address indexed contributor, string ipfsHash, uint256 timestamp, uint256 newReputation)",
] as const;

// ─── Config ──────────────────────────────────────────────────────
export const CONTRACT_ADDRESS =
  process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "";

export const CHAIN_CONFIG = {
  chainId: "0x" + Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 80002).toString(16),
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: { name: "MATIC", symbol: "MATIC", decimals: 18 },
  rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc-amoy.polygon.technology"],
  blockExplorerUrls: ["https://amoy.polygonscan.com"],
} as const;
