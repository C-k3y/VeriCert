import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useCertificate } from "@/hooks/useCertificate";
import { CertificateDossier } from "@/components/certificate/CertificateDossier";
import { WaxSeal, type SealState } from "@/components/ui/WaxSeal";
import { Button } from "@/components/ui/Button";

export function Verify() {
  const [params, setParams] = useSearchParams();
  const [draftId, setDraftId] = useState(params.get("id") ?? "");
  const tokenId = params.get("id") ?? "";

  const { certificate, isNotFound, error, isLoading } = useCertificate(tokenId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (draftId.trim()) setParams({ id: draftId.trim() });
  }

  const sealState: SealState = isLoading
    ? "pressing"
    : certificate
    ? certificate.revoked
      ? "revoked"
      : "verified"
    : isNotFound
    ? "not-found"
    : "idle";

  return (
    <div className="mx-auto max-w-3xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ash">Verify a record</p>
      <h1 className="mt-3 font-display text-3xl text-ink">
        Enter a certificate number to check it against the chain.
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 flex gap-3">
        <input
          value={draftId}
          onChange={(e) => setDraftId(e.target.value)}
          inputMode="numeric"
          placeholder="e.g. 1024"
          className="flex-1 rounded-sm border border-ink/25 bg-vellum px-4 py-2.5 font-mono text-sm text-ink placeholder:text-ash/60 focus:border-brass focus:outline-none"
        />
        <Button type="submit">Check</Button>
      </form>

      <div className="mt-12">
        {!tokenId && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <WaxSeal state="idle" />
            <p className="max-w-sm font-serif text-ink-soft">
              The certificate number is printed on the document itself, usually beneath the
              recipient's name.
            </p>
          </div>
        )}

        {tokenId && isLoading && (
          <div className="flex flex-col items-center gap-4 py-12">
            <WaxSeal state="pressing" />
            <p className="font-mono text-xs text-ash">Checking the chain…</p>
          </div>
        )}

        {tokenId && !isLoading && isNotFound && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <WaxSeal state="not-found" />
            <p className="max-w-sm font-serif text-ink-soft">
              No certificate is recorded under number {tokenId}. Double-check the number, or ask
              the issuing institution to confirm it.
            </p>
          </div>
        )}

        {tokenId && !isLoading && error && !isNotFound && (
          <div className="flex flex-col items-center gap-4 py-12 text-center">
            <p className="font-serif text-seal">{error.message}</p>
          </div>
        )}

        {certificate && <CertificateDossier certificate={certificate} sealState={sealState} />}
      </div>
    </div>
  );
}
