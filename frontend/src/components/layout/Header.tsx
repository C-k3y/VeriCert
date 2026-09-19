import { NavLink } from "react-router-dom";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import clsx from "clsx";
import { shortenAddress } from "@/lib/format";

const NAV_ITEMS = [
  { to: "/", label: "Home" },
  { to: "/verify", label: "Verify a certificate" },
  { to: "/issue", label: "Issue" },
];

export function Header() {
  const { address, isConnected } = useAccount();
  const { connectors, connect, isPending } = useConnect();
  const { disconnect } = useDisconnect();

  return (
    <header className="border-b border-brass/25 bg-vellum/95 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <NavLink to="/" className="flex items-center gap-2.5">
          <SealMark />
          <span className="font-display text-lg tracking-tight text-ink">VeriCert</span>
        </NavLink>

        <nav className="hidden gap-6 sm:flex">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                clsx(
                  "font-serif text-[15px] transition-colors",
                  isActive ? "text-ink" : "text-ash hover:text-ink"
                )
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        {isConnected ? (
          <button
            onClick={() => disconnect()}
            className="rounded-sm border border-ink/25 px-3 py-1.5 font-mono text-xs text-ink hover:border-ink"
            title="Disconnect wallet"
          >
            {shortenAddress(address)}
          </button>
        ) : (
          <button
            onClick={() => connect({ connector: connectors[0] })}
            disabled={isPending}
            className="rounded-sm bg-ink px-3.5 py-1.5 font-mono text-xs text-vellum hover:bg-ink/90 disabled:opacity-50"
          >
            {isPending ? "Connecting…" : "Connect wallet"}
          </button>
        )}
      </div>
    </header>
  );
}

function SealMark() {
  return (
    <svg width="26" height="26" viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18" className="fill-seal/90" />
      <circle cx="20" cy="20" r="18" fill="none" stroke="#A9812F" strokeWidth="1" strokeOpacity="0.5" />
      <text x="20" y="25" textAnchor="middle" fill="#EDE6D6" fontSize="14" fontFamily="Fraunces, serif">
        V
      </text>
    </svg>
  );
}
