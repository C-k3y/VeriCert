import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { certificateContract } from "@/config/contract";
import { decodeContractError } from "@/lib/errors";

export function useRevokeCertificate() {
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed, error: receiptError } =
    useWaitForTransactionReceipt({ hash });

  function revoke(tokenId: bigint) {
    writeContract({
      ...certificateContract,
      functionName: "revokeCertificate",
      args: [tokenId],
    });
  }

  const error = writeError ?? receiptError;

  return {
    revoke,
    isSubmitting: isPending,
    isConfirming,
    isConfirmed,
    error: error ? decodeContractError(error) : null,
  };
}
