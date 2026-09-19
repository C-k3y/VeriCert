import certificateNftAbi from "@/abi/CertificateNFT.json";
import type { Address } from "viem";

const address = import.meta.env.VITE_CONTRACT_ADDRESS as Address | undefined;

if (!address) {
  // Fail loudly in development rather than silently reading from address(0).
  // eslint-disable-next-line no-console
  console.warn(
    "VITE_CONTRACT_ADDRESS is not set — copy .env.example to .env.local and fill it in."
  );
}

export const certificateContract = {
  address: (address ?? "0x0000000000000000000000000000000000000000") as Address,
  abi: certificateNftAbi,
} as const;

export type Certificate = {
  tokenId: bigint;
  certificateId: bigint;
  studentName: string;
  registrationNumber: string;
  courseName: string;
  degree: string;
  ipfsCID: string;
  pdfHash: `0x${string}`;
  revoked: boolean;
  issueDate: bigint;
};
