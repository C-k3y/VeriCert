import { useAccount, useReadContract } from "wagmi";
import { certificateContract } from "@/config/contract";

/**
 * The contract's access control is a single `owner` address (see
 * PRODUCTION-NOTES.md for why this should become role-based). This hook is
 * the one place the frontend asks "can this wallet issue/revoke?" so that
 * migrating to AccessControl later only means changing this file.
 */
export function useIsIssuer() {
  const { address, isConnected } = useAccount();

  const { data: owner, isLoading } = useReadContract({
    ...certificateContract,
    functionName: "owner",
  });

  const isIssuer =
    isConnected && !!address && !!owner && (owner as string).toLowerCase() === address.toLowerCase();

  return { isIssuer, isLoading, owner: owner as string | undefined };
}
