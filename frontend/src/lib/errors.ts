import { BaseError, ContractFunctionRevertedError } from "viem";

export type DecodedError = {
  name: string;
  message: string;
};

const FRIENDLY_MESSAGES: Record<string, string> = {
  NotOwner: "Only the issuing institution's wallet can do this.",
  CertificateNotFound: "No certificate exists with that ID.",
  CertificateAlreadyRevoked: "This certificate has already been revoked.",
  DuplicateCertificate: "A certificate with that ID already exists.",
  TransferNotAllowed: "VeriCert certificates are soulbound and can never be transferred.",
};

/**
 * viem surfaces reverts as nested BaseError chains. This walks the chain once
 * so every call site gets a stable { name, message } shape instead of
 * re-implementing `error.walk()` everywhere a read or write can fail.
 */
export function decodeContractError(error: unknown): DecodedError {
  if (error instanceof BaseError) {
    const revert = error.walk((e) => e instanceof ContractFunctionRevertedError);
    if (revert instanceof ContractFunctionRevertedError) {
      const name = revert.data?.errorName ?? "UnknownError";
      return { name, message: FRIENDLY_MESSAGES[name] ?? revert.shortMessage };
    }
    return { name: "RpcError", message: error.shortMessage ?? error.message };
  }
  if (error instanceof Error) return { name: "Error", message: error.message };
  return { name: "UnknownError", message: "Something unexpected went wrong." };
}
