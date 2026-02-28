"use client";

import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";

// ─── Contract config (inline to avoid cross-package import issues) ──

const COMMITCHAIN_ABI = [
  "function submitContribution(string calldata _title, string calldata _ipfsCID) external",
  "function getContributionCount() external view returns (uint256)",
  "function getContribution(uint256 _id) external view returns (address contributor, string title, string ipfsCID, uint256 timestamp)",
  "function reputation(address) external view returns (uint256)",
  "function getReputation(address _user) external view returns (uint256)",
  "function getAllContributions() external view returns (tuple(address contributor, string title, string ipfsCID, uint256 timestamp)[])",
  "event ContributionSubmitted(uint256 indexed id, address indexed contributor, string title, string ipfsCID, uint256 timestamp, uint256 newReputation)",
] as const;

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS ?? "0x0B1b8155545a3A63C163bf21C5dD70596Fe9A32C";

const CHAIN_CONFIG = {
  chainId: "0x" + Number(process.env.NEXT_PUBLIC_CHAIN_ID ?? 80002).toString(16),
  chainName: "Polygon Amoy Testnet",
  nativeCurrency: { name: "POL", symbol: "POL", decimals: 18 },
  rpcUrls: [process.env.NEXT_PUBLIC_RPC_URL ?? "https://rpc-amoy.polygon.technology"],
  blockExplorerUrls: ["https://amoy.polygonscan.com"],
} as const;

// ─── Types ───────────────────────────────────────────────────────

export interface OnChainContribution {
  id: number;
  contributor: string;
  title: string;
  ipfsCID: string;
  timestamp: number;
}

export interface ContractHookReturn {
  account: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  reputation: number;
  contributions: OnChainContribution[];
  submitContribution: (title: string, cid: string) => Promise<void>;
  submitting: boolean;
  txHash: string | null;
  error: string | null;
  refreshData: () => Promise<void>;
}

// ─── Network switch helper ───────────────────────────────────────

type EthRequest = { request: (args: { method: string; params?: unknown[] }) => Promise<unknown> };

function getEth(): EthRequest | null {
  if (typeof window === "undefined") return null;
  const eth = (window as unknown as { ethereum?: EthRequest }).ethereum;
  return eth ?? null;
}

async function ensureAmoyNetwork() {
  const eth = getEth();
  if (!eth) return;
  try {
    await eth.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_CONFIG.chainId }],
    });
  } catch (err: unknown) {
    if ((err as { code?: number }).code === 4902) {
      await eth.request({
        method: "wallet_addEthereumChain",
        params: [CHAIN_CONFIG],
      });
    }
  }
}

// ═══════════════════════════════════════════════════════════════
//  HOOK
// ═══════════════════════════════════════════════════════════════

export function useContract(): ContractHookReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [reputation, setReputation] = useState(0);
  const [contributions, setContributions] = useState<OnChainContribution[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ─── Read-only provider (lazy) ────────────────────────────────
  function getReadContract(): Contract | null {
    if (!CONTRACT_ADDRESS) return null;
    const provider = new JsonRpcProvider(CHAIN_CONFIG.rpcUrls[0]);
    return new Contract(CONTRACT_ADDRESS, COMMITCHAIN_ABI, provider);
  }

  // ─── Fetch on-chain data ──────────────────────────────────────
  const refreshData = useCallback(async () => {
    const readContract = getReadContract();
    if (!readContract) return;

    try {
      // Try getAllContributions first (cheaper single call)
      try {
        const all = await readContract.getAllContributions();
        const items: OnChainContribution[] = all.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (c: any, i: number) => ({
            id: i,
            contributor: c.contributor ?? c[0],
            title: c.title ?? c[1],
            ipfsCID: c.ipfsCID ?? c[2],
            timestamp: Number(c.timestamp ?? c[3]),
          })
        );
        setContributions(items.reverse()); // newest first
      } catch {
        // Fallback: iterate
        const count = Number(await readContract.getContributionCount());
        const items: OnChainContribution[] = [];
        const start = Math.max(0, count - 50);
        for (let i = count - 1; i >= start; i--) {
          const [contributor, title, ipfsCID, timestamp] =
            await readContract.getContribution(i);
          items.push({ id: i, contributor, title, ipfsCID, timestamp: Number(timestamp) });
        }
        setContributions(items);
      }

      // Reputation
      if (account) {
        const rep = Number(await readContract.getReputation(account));
        setReputation(rep);
      }
    } catch {
      // Contract might not be deployed yet — silent fail
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ─── Connect Wallet ───────────────────────────────────────────
  const connectWallet = useCallback(async () => {
    setError(null);
    const eth = getEth();
    if (!eth) {
      setError("MetaMask not detected. Please install it.");
      return;
    }
    try {
      setConnecting(true);
      await ensureAmoyNetwork();
      const provider = new BrowserProvider(eth as never);
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccount(accounts[0]);
    } catch (err: unknown) {
      const code = (err as { code?: number }).code;
      if (code === 4001) {
        setError("Connection rejected by user.");
      } else {
        setError((err as Error).message ?? "Wallet connection failed");
      }
    } finally {
      setConnecting(false);
    }
  }, []);

  // ─── Submit Contribution ──────────────────────────────────────
  const submitContributionFn = useCallback(
    async (title: string, cid: string) => {
      setError(null);
      setTxHash(null);
      const eth = getEth();
      if (!eth || !account) {
        setError("Connect your wallet first.");
        return;
      }
      if (!CONTRACT_ADDRESS) {
        setError("Contract not deployed. Set NEXT_PUBLIC_CONTRACT_ADDRESS.");
        return;
      }
      try {
        setSubmitting(true);
        const provider = new BrowserProvider(eth as never);
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, COMMITCHAIN_ABI, signer);
        const tx = await contract.submitContribution(title, cid);
        setTxHash(tx.hash);
        await tx.wait();
        setReputation((r) => r + 10);
        await refreshData();
      } catch (err: unknown) {
        const code = (err as { code?: number }).code;
        if (code === 4001) {
          setError("Transaction rejected by user.");
        } else {
          setError((err as Error).message ?? "Transaction failed");
        }
      } finally {
        setSubmitting(false);
      }
    },
    [account, refreshData]
  );

  return {
    account,
    connecting,
    connectWallet,
    reputation,
    contributions,
    submitContribution: submitContributionFn,
    submitting,
    txHash,
    error,
    refreshData,
  };
}
