import { type ReactNode, useState } from "react";
import clsx from "clsx";

/**
 * A single row in the "ledger" — a label, a monospace value, and an optional
 * copy affordance. Used for on-chain data (hashes, addresses, token ids) so
 * that off-chain prose (student name, course) can stay in the serif voice
 * and this stays visually distinct as "the machine-verifiable part."
 */
export function LedgerField({
  label,
  value,
  copyValue,
  children,
}: {
  label: string;
  value?: string;
  copyValue?: string;
  children?: ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!copyValue) return;
    await navigator.clipboard.writeText(copyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex items-baseline justify-between gap-4 border-b border-brass/20 py-2.5">
      <span className="shrink-0 text-sm text-ash">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        {children ?? (
          <span className="truncate font-mono text-sm text-ink" title={copyValue}>
            {value}
          </span>
        )}
        {copyValue && (
          <button
            type="button"
            onClick={handleCopy}
            className={clsx(
              "shrink-0 text-xs underline decoration-dotted underline-offset-2",
              copied ? "text-ledger" : "text-ash hover:text-ink"
            )}
          >
            {copied ? "copied" : "copy"}
          </button>
        )}
      </div>
    </div>
  );
}
