"use client";

import { useCallback, useEffect, useState } from "react";
import { BrowserProvider, Contract, JsonRpcProvider } from "ethers";
import { CONTRIBUTION_ABI, CONTRACT_ADDRESS, CHAIN_CONFIG } from "@/lib/contract";

// ─── Types ───────────────────────────────────────────────────────
export interface OnChainContribution {
  id: number;
  contributor: string;
  ipfsHash: string;
  timestamp: number;
}

interface UseContractReturn {
  // wallet
  account: string | null;
  connecting: boolean;
  connectWallet: () => Promise<void>;
  // reputation
  reputation: number;
  // contributions
  contributions: OnChainContribution[];
  // actions
  submitContribution: (ipfsHash: string) => Promise<void>;
  submitting: boolean;
  // misc
  txHash: string | null;
  error: string | null;
  refreshData: () => Promise<void>;
}

// helper: ensure user is on Amoy
async function ensureAmoyNetwork() {
  const eth = (window as unknown as { ethereum?: Record<string, unknown> }).ethereum;
  if (!eth) return;
  try {
    await (eth as { request: (args: { method: string; params: unknown[] }) => Promise<unknown> }).request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: CHAIN_CONFIG.chainId }],
    });
  } catch (switchErr: unknown) {
    // chain not added yet → add it
    if ((switchErr as { code?: number }).code === 4902) {
      await (eth as { request: (args: { method: string; params: unknown[] }) => Promise<unknown> }).request({
        method: "wallet_addEthereumChain",
        params: [CHAIN_CONFIG],
      });
    }
  }
}

// ─── Hook ────────────────────────────────────────────────────────
export function useContract(): UseContractReturn {
  const [account, setAccount] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [reputation, setReputation] = useState(0);
  const [contributions, setContributions] = useState<OnChainContribution[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // read-only provider (works without wallet)
  function getReadContract() {
    if (!CONTRACT_ADDRESS) return null;
    const provider = new JsonRpcProvider(CHAIN_CONFIG.rpcUrls[0]);
    return new Contract(CONTRACT_ADDRESS, CONTRIBUTION_ABI, provider);
  }

  // ─── Fetch on-chain data ─────────────────────────────────────
  const refreshData = useCallback(async () => {
    const readContract = getReadContract();
    if (!readContract) return; // contract not deployed yet
    try {
      const count = Number(await readContract.getContributionCount());
      const items: OnChainContribution[] = [];
      // fetch last 50 max to keep it snappy
      const start = Math.max(0, count - 50);
      for (let i = count - 1; i >= start; i--) {
        const [contributor, ipfsHash, timestamp] = await readContract.getContribution(i);
        items.push({
          id: i,
          contributor: contributor as string,
          ipfsHash: ipfsHash as string,
          timestamp: Number(timestamp),
        });
      }
      setContributions(items);

      if (account) {
        const rep = Number(await readContract.getReputation(account));
        setReputation(rep);
      }
    } catch {
      // silently fail on read – contract may not be deployed yet
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account]);

  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // ─── Connect Wallet ──────────────────────────────────────────
  const connectWallet = useCallback(async () => {
    setError(null);
    const eth = (window as unknown as { ethereum?: Record<string, unknown> }).ethereum;
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
      setError((err as Error).message ?? "Wallet connection failed");
    } finally {
      setConnecting(false);
    }
  }, []);

  // ─── Submit Contribution TX ──────────────────────────────────
  const submitContributionFn = useCallback(
    async (ipfsHash: string) => {
      setError(null);
      setTxHash(null);
      const eth = (window as unknown as { ethereum?: Record<string, unknown> }).ethereum;
      if (!eth || !account) {
        setError("Connect your wallet first.");
        return;
      }
      try {
        setSubmitting(true);
        const provider = new BrowserProvider(eth as never);
        const signer = await provider.getSigner();
        const contract = new Contract(CONTRACT_ADDRESS, CONTRIBUTION_ABI, signer);
        const tx = await contract.submitContribution(ipfsHash);
        setTxHash(tx.hash);
        await tx.wait();
        // optimistic rep bump while we refetch
        setReputation((r) => r + 10);
        await refreshData();
      } catch (err: unknown) {
        setError((err as Error).message ?? "Transaction failed");
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
