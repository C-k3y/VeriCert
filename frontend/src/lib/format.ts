export function shortenAddress(address?: string, chars = 4): string {
  if (!address) return "—";
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

export function shortenHash(hash?: string, chars = 6): string {
  if (!hash) return "—";
  return `${hash.slice(0, chars + 2)}…${hash.slice(-chars)}`;
}

export function formatIssueDate(unixSeconds: bigint): string {
  return new Date(Number(unixSeconds) * 1000).toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const DEFAULT_GATEWAY = "https://gateway.pinata.cloud/ipfs/";

export function ipfsUrl(cid: string): string {
  const gateway = import.meta.env.VITE_IPFS_GATEWAY || DEFAULT_GATEWAY;
  return `${gateway}${cid}`;
}
