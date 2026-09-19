import { WaxSeal, type SealState } from "@/components/ui/WaxSeal";
import { LedgerField } from "@/components/ui/LedgerField";
import { formatIssueDate, ipfsUrl, shortenHash } from "@/lib/format";
import type { Certificate } from "@/config/contract";

/**
 * Two-column dossier: left is the human-readable "paper" (serif, reads like
 * an actual certificate), right is the ledger strip (mono, the machine-
 * verifiable record). The seal sits where an institution's stamp would.
 */
export function CertificateDossier({
  certificate,
  sealState,
}: {
  certificate: Certificate;
  sealState: SealState;
}) {
  return (
    <div className="grid overflow-hidden rounded-sm border border-brass/30 bg-vellum shadow-dossier sm:grid-cols-[1.4fr_1fr]">
      <div className="bg-paper-grain relative p-8 sm:p-10">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-ash">
          Certificate No. {certificate.tokenId.toString()}
        </p>
        <h2 className="mt-4 font-display text-3xl leading-tight text-ink">
          {certificate.studentName}
        </h2>
        <p className="mt-2 font-serif text-lg text-ink-soft">
          has been awarded the degree of
        </p>
        <p className="mt-1 font-display text-xl text-seal">{certificate.degree}</p>
        <p className="mt-1 font-serif text-lg text-ink-soft">in {certificate.courseName}</p>

        <div className="mt-8 flex items-center gap-3">
          <WaxSeal state={sealState} size={72} />
          <div className="text-sm text-ash">
            <p>Issued {formatIssueDate(certificate.issueDate)}</p>
            <p>Registration {certificate.registrationNumber}</p>
          </div>
        </div>
      </div>

      <div className="border-t border-brass/25 bg-vellum-dark p-8 sm:border-l sm:border-t-0 sm:p-10">
        <p className="mb-1 font-mono text-xs uppercase tracking-[0.2em] text-ash">
          On-chain record
        </p>
        <div className="mt-4">
          <LedgerField label="Token ID" value={certificate.tokenId.toString()} />
          <LedgerField label="Certificate ID" value={certificate.certificateId.toString()} />
          <LedgerField label="Document hash" value={shortenHash(certificate.pdfHash)} copyValue={certificate.pdfHash} />
          <LedgerField label="Status">
            <span
              className={
                certificate.revoked ? "text-seal" : "text-ledger"
              }
            >
              {certificate.revoked ? "Revoked" : "Active"}
            </span>
          </LedgerField>
          <LedgerField label="Source document">
            <a
              href={ipfsUrl(certificate.ipfsCID)}
              target="_blank"
              rel="noreferrer"
              className="text-sm text-ink underline decoration-brass decoration-2 underline-offset-2 hover:text-seal"
            >
              View on IPFS
            </a>
          </LedgerField>
        </div>
      </div>
    </div>
  );
}
