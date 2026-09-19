import { useEffect } from "react";
import { useWaitForTransactionReceipt, useWriteContract } from "wagmi";
import { certificateContract } from "@/config/contract";
import { decodeContractError } from "@/lib/errors";

export type IssueCertificateInput = {
  tokenId: bigint;
  certificateId: bigint;
  studentName: string;
  registrationNumber: string;
  courseName: string;
  degree: string;
  ipfsCID: string;
  pdfHash: `0x${string}`;
  issueDate: bigint;
};

export function useIssueCertificate(onSuccess?: () => void) {
  const { writeContract, data: hash, isPending, error: writeError, reset } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    error: receiptError,
  } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isConfirmed) onSuccess?.();
    // onSuccess is intentionally excluded: callers pass a fresh closure each
    // render, and we only want this to fire once per confirmed hash.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConfirmed]);

  function issue(input: IssueCertificateInput) {
    writeContract({
      ...certificateContract,
      functionName: "issueCertificate",
      args: [
        input.tokenId,
        input.certificateId,
        input.studentName,
        input.registrationNumber,
        input.courseName,
        input.degree,
        input.ipfsCID,
        input.pdfHash,
        input.issueDate,
      ],
    });
  }

  const error = writeError ?? receiptError;

  return {
    issue,
    hash,
    isSubmitting: isPending,
    isConfirming,
    isConfirmed,
    error: error ? decodeContractError(error) : null,
    reset,
  };
}
