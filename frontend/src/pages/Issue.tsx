import { useState, type FormEvent } from "react";
import { useAccount } from "wagmi";
import { keccak256, toHex } from "viem";
import { useIsIssuer } from "@/hooks/useIsIssuer";
import { useIssueCertificate } from "@/hooks/useIssueCertificate";
import { Button } from "@/components/ui/Button";

type FormState = {
  tokenId: string;
  certificateId: string;
  studentName: string;
  registrationNumber: string;
  courseName: string;
  degree: string;
  ipfsCID: string;
};

const EMPTY_FORM: FormState = {
  tokenId: "",
  certificateId: "",
  studentName: "",
  registrationNumber: "",
  courseName: "",
  degree: "",
  ipfsCID: "",
};

export function Issue() {
  const { isConnected } = useAccount();
  const { isIssuer, isLoading: checkingRole } = useIsIssuer();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [pdfHash, setPdfHash] = useState<`0x${string}` | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const { issue, isSubmitting, isConfirming, isConfirmed, error, hash } = useIssueCertificate(() =>
    setForm(EMPTY_FORM)
  );

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Hashing happens entirely client-side — the PDF itself is never sent
    // anywhere by this form. Pin it to IPFS separately and paste the CID below.
    const buffer = await file.arrayBuffer();
    setPdfHash(keccak256(new Uint8Array(buffer)));
    setFileName(file.name);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!pdfHash) return;
    issue({
      tokenId: BigInt(form.tokenId),
      certificateId: BigInt(form.certificateId),
      studentName: form.studentName,
      registrationNumber: form.registrationNumber,
      courseName: form.courseName,
      degree: form.degree,
      ipfsCID: form.ipfsCID,
      pdfHash,
      issueDate: BigInt(Math.floor(Date.now() / 1000)),
    });
  }

  if (!isConnected) {
    return <GatedMessage title="Connect a wallet" body="Connect the institution's wallet to issue certificates." />;
  }

  if (checkingRole) {
    return <GatedMessage title="Checking permissions…" body="Confirming this wallet against the contract owner." />;
  }

  if (!isIssuer) {
    return (
      <GatedMessage
        title="This wallet can't issue certificates"
        body="Only the wallet set as the contract's owner may issue or revoke records. Switch to that wallet, or ask an administrator to grant it."
      />
    );
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-ash">Issue a record</p>
      <h1 className="mt-3 font-display text-3xl text-ink">Add a new certificate to the ledger.</h1>
      <p className="mt-3 font-serif text-ink-soft">
        Pin the signed PDF to IPFS first, then fill in its CID below alongside the recipient's
        details. The document hash is computed locally in your browser.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-5">
        <Field label="Token ID" required>
          <input
            required
            inputMode="numeric"
            value={form.tokenId}
            onChange={(e) => setForm({ ...form, tokenId: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Certificate ID" required>
          <input
            required
            inputMode="numeric"
            value={form.certificateId}
            onChange={(e) => setForm({ ...form, certificateId: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Student name" required>
          <input
            required
            value={form.studentName}
            onChange={(e) => setForm({ ...form, studentName: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Registration number" required>
          <input
            required
            value={form.registrationNumber}
            onChange={(e) => setForm({ ...form, registrationNumber: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Course" required>
          <input
            required
            value={form.courseName}
            onChange={(e) => setForm({ ...form, courseName: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="Degree" required>
          <input
            required
            value={form.degree}
            onChange={(e) => setForm({ ...form, degree: e.target.value })}
            className={inputClass}
          />
        </Field>
        <Field label="IPFS CID" required>
          <input
            required
            value={form.ipfsCID}
            onChange={(e) => setForm({ ...form, ipfsCID: e.target.value })}
            placeholder="Qm…"
            className={inputClass}
          />
        </Field>
        <Field label="Signed PDF (hashed locally, not uploaded)" required>
          <input type="file" accept="application/pdf" required onChange={handleFile} className="font-serif text-sm" />
          {fileName && <p className="mt-1 font-mono text-xs text-ash">Hash of {fileName}: {pdfHash}</p>}
        </Field>

        <Button type="submit" loading={isSubmitting || isConfirming} disabled={!pdfHash}>
          {isSubmitting ? "Confirm in wallet…" : isConfirming ? "Sealing on-chain…" : "Issue certificate"}
        </Button>

        {error && <p className="font-serif text-sm text-seal">{error.message}</p>}
        {isConfirmed && (
          <p className="font-serif text-sm text-ledger">
            Certificate issued. Transaction {hash?.slice(0, 10)}…
          </p>
        )}
      </form>
    </div>
  );
}

const inputClass =
  "w-full rounded-sm border border-ink/25 bg-vellum px-3.5 py-2 font-serif text-[15px] text-ink focus:border-brass focus:outline-none";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-ash">
        {label}
        {required && <span className="text-seal"> *</span>}
      </span>
      {children}
    </label>
  );
}

function GatedMessage({ title, body }: { title: string; body: string }) {
  return (
    <div className="mx-auto max-w-md px-6 py-24 text-center">
      <h1 className="font-display text-2xl text-ink">{title}</h1>
      <p className="mt-3 font-serif text-ink-soft">{body}</p>
    </div>
  );
}

// keccak256(toHex(...)) kept imported for institutions that want to hash
// a string commitment (e.g. a metadata JSON blob) rather than raw file bytes.
export const hashString = (value: string) => keccak256(toHex(value));
