export function Footer() {
  return (
    <footer className="border-t border-brass/25 py-8">
      <div className="mx-auto flex max-w-5xl flex-col gap-1 px-6 text-sm text-ash sm:flex-row sm:items-center sm:justify-between">
        <p>VeriCert — records that don't need a phone call to trust.</p>
        <p className="font-mono text-xs">Every certificate below is a public, on-chain record.</p>
      </div>
    </footer>
  );
}
