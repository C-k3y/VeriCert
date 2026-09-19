import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { WaxSeal } from "@/components/ui/WaxSeal";

export function Home() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
      <div className="grid items-center gap-12 sm:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-ash">
            A public record room for academic credentials
          </p>
          <h1 className="mt-5 font-display text-4xl leading-[1.1] text-ink sm:text-5xl">
            A degree you can check without calling the registrar.
          </h1>
          <p className="mt-6 max-w-md font-serif text-lg leading-relaxed text-ink-soft">
            Institutions issue each certificate as a soulbound record on
            Ethereum. It can never be transferred or forged — only checked,
            in seconds, by anyone holding the certificate number.
          </p>
          <div className="mt-8 flex gap-3">
            <Link to="/verify">
              <Button>Verify a certificate</Button>
            </Link>
            <Link to="/issue">
              <Button variant="secondary">Issue as an institution</Button>
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <WaxSeal state="verified" size={200} />
        </div>
      </div>

      <div className="mt-24 grid gap-8 border-t border-brass/25 pt-12 sm:grid-cols-3">
        <Principle
          title="Soulbound by design"
          body="Once issued, a certificate cannot be sold, transferred, or moved to another wallet. It stays bound to the record it represents."
        />
        <Principle
          title="One hash, one document"
          body="Each certificate commits to a hash of its source PDF, so the underlying document can't be swapped after the fact."
        />
        <Principle
          title="Revocable, not deletable"
          body="An institution can revoke a certificate it issued in error — the revocation itself becomes part of the public record."
        />
      </div>
    </div>
  );
}

function Principle({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-2 font-serif text-[15px] leading-relaxed text-ink-soft">{body}</p>
    </div>
  );
}
