// ═══════════════════════════════════════════════════════════════
//  PINATA IPFS SERVICE — Pin JSON payloads to IPFS
// ═══════════════════════════════════════════════════════════════

import type { ContributionPayload } from "./types";

const PINATA_JWT =
  process.env.PINATA_JWT ??
  process.env.NEXT_PUBLIC_PINATA_JWT ??
  "";

/**
 * Pin a contribution payload to IPFS via Pinata.
 * Returns the IPFS CID (hash).
 */
export async function pinContribution(
  payload: ContributionPayload
): Promise<string> {
  if (!PINATA_JWT) {
    throw new Error("PINATA_JWT is not set. Cannot pin to IPFS.");
  }

  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: payload,
      pinataMetadata: {
        name: `commitchain-${payload.title.slice(0, 30)}-${Date.now()}`,
      },
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Pinata error (${res.status}): ${errText}`);
  }

  const json = await res.json();
  return json.IpfsHash as string;
}

/**
 * Fetch a contribution payload from IPFS.
 */
export async function fetchFromIPFS(
  cid: string
): Promise<ContributionPayload | null> {
  try {
    const res = await fetch(`https://gateway.pinata.cloud/ipfs/${cid}`, {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    return (await res.json()) as ContributionPayload;
  } catch {
    return null;
  }
}

/** Build a gateway URL for viewing */
export function ipfsUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
