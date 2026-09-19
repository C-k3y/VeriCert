import { useReadContract } from "wagmi";
import { certificateContract, type Certificate } from "@/config/contract";
import { decodeContractError } from "@/lib/errors";

/**
 * Reads a certificate straight from getCertificate(tokenId).
 *
 * The contract reverts (CertificateNotFound) instead of returning a zeroed
 * struct when a tokenId hasn't been issued, so "not found" and "RPC failure"
 * both surface through `error` — decodeContractError tells them apart.
 */
export function useCertificate(tokenId: string) {
  const isValidId = /^\d+$/.test(tokenId.trim());

  const { data, error, isLoading, isFetching, refetch } = useReadContract({
    ...certificateContract,
    functionName: "getCertificate",
    args: isValidId ? [BigInt(tokenId)] : undefined,
    query: {
      enabled: isValidId,
      retry: false, // a revert is a definitive answer, not a transient failure
    },
  });

  return {
    certificate: data as Certificate | undefined,
    isNotFound: Boolean(error) && decodeContractError(error).name === "CertificateNotFound",
    error: error ? decodeContractError(error) : null,
    isLoading: isLoading || isFetching,
    refetch,
  };
}
