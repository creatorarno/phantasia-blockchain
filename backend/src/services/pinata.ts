// ═══════════════════════════════════════════════════════════════
//  PINATA IPFS SERVICE — Pin contribution payloads to IPFS
// ═══════════════════════════════════════════════════════════════

import { getConfig } from "../config/index.js";
import type { ContributionPayload } from "../types.js";

const PINATA_API = "https://api.pinata.cloud/pinning/pinJSONToIPFS";
const PINATA_GATEWAY = "https://gateway.pinata.cloud/ipfs";

/**
 * Pin a contribution payload to IPFS via Pinata.
 * Returns the IPFS CID.
 */
export async function pinContribution(
  payload: ContributionPayload
): Promise<string> {
  const { PINATA_JWT } = getConfig();

  if (!PINATA_JWT) {
    throw new Error("PINATA_JWT is not set. Cannot pin to IPFS.");
  }

  const res = await fetch(PINATA_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: payload,
      pinataMetadata: {
        name: `commitchain-${payload.title.slice(0, 30).replace(/\s+/g, "-")}-${Date.now()}`,
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

/** Build a gateway URL for an IPFS CID */
export function ipfsUrl(cid: string): string {
  return `${PINATA_GATEWAY}/${cid}`;
}
