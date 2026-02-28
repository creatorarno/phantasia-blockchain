const PINATA_JWT = process.env.NEXT_PUBLIC_PINATA_JWT ?? "";

export interface ContributionPayload {
  title: string;
  description: string;
  github: string;
  contributor: string;
  timestamp: number;
}

/**
 * Pin a JSON object to IPFS via Pinata's free API.
 * Returns the IPFS CID (hash).
 */
export async function pinJSON(data: ContributionPayload): Promise<string> {
  const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: JSON.stringify({
      pinataContent: data,
      pinataMetadata: { name: `contribution-${Date.now()}` },
    }),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Pinata error: ${err}`);
  }

  const json = await res.json();
  return json.IpfsHash as string;
}

/** Build a gateway URL to view pinned content */
export function ipfsUrl(cid: string): string {
  return `https://gateway.pinata.cloud/ipfs/${cid}`;
}
