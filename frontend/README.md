# VeriCert — Frontend Starter

A React + TypeScript + Vite starter for VeriCert, wired to your existing
`CertificateNFT` contract. This is not a template — every file reads and
writes the contract exactly as you wrote it (including its revert-based
"not found" pattern and soulbound behavior).

## Design concept: "The Sealed Ledger"

The subject matter is two things layered on top of each other: an academic
certificate (paper, ink, a registrar's stamp) and a blockchain record
(immutable, hashed, timestamped). Rather than picking one crypto-dashboard
look, the UI treats every certificate as a **dossier**: the left side reads
like an actual certificate (serif type, a name, a degree, a wax seal), the
right side is the machine-verifiable ledger strip (monospace hashes,
addresses, IDs). Verifying a certificate is visualized as *pressing a seal*
— idle (pale, unpressed wax) → pressing (a single press animation while the
chain read is in flight) → set in ledger-green ink (verified) or
seal-crimson ink (revoked).

**Palette:** vellum `#EDE6D6` (parchment background), ink `#1F2A24`
(near-black body text), seal `#8C2F2F` (wax-seal crimson, used only for the
seal and destructive actions), ledger `#2F4C3B` (verified/success state),
brass `#A9812F` (dividers, borders, official marks), ash `#5B5A52`
(secondary text).

**Type:** Fraunces for display headlines (has an inky, cut-letterform
character), Source Serif 4 for body/certificate copy, IBM Plex Mono
strictly for on-chain data (hashes, addresses, token IDs) — the one place a
monospace face is earned by the subject matter rather than decorative.

## Getting started

```bash
npm install
cp .env.example .env.local
# fill in VITE_CONTRACT_ADDRESS with your deployed address,
# and VITE_RPC_URL with your own Sepolia/Alchemy endpoint
npm run dev
```

To point at a local Anvil node instead (matching your `Deploy.s.sol`
workflow), just switch the connected wallet's network to `localhost:8545`
(chain id 31337) — it's already registered in `src/config/wagmi.ts`.

## Structure

```
src/
  abi/CertificateNFT.json     ABI mirrored 1:1 from your Solidity source
  config/
    wagmi.ts                  chains, connectors, transports
    contract.ts               single source of truth for address + ABI
  lib/
    errors.ts                 decodes the contract's custom errors into
                               friendly messages (NotOwner, CertificateNotFound, …)
    format.ts                 address/hash shortening, IPFS URL building
  hooks/
    useCertificate.ts         read a certificate by tokenId
    useIssueCertificate.ts    write + wait-for-receipt for issuing
    useRevokeCertificate.ts   write + wait-for-receipt for revoking
    useIsIssuer.ts            checks connected wallet against owner()
  components/
    ui/WaxSeal.tsx            the seal — idle/pressing/verified/revoked/not-found
    ui/LedgerField.tsx        labeled monospace data row with copy-to-clipboard
    ui/Button.tsx
    layout/Header.tsx         nav + bespoke wallet connect (no generic modal)
    layout/Footer.tsx
    certificate/CertificateDossier.tsx   the two-column certificate/ledger card
  pages/
    Home.tsx
    Verify.tsx                 public lookup by token ID
    Issue.tsx                  owner-gated issuance form, hashes the PDF client-side
```

## Notes on how this maps to your contract

- `getCertificate(tokenId)` reverts with `CertificateNotFound` instead of
  returning a zeroed struct — `useCertificate` treats that revert as a
  first-class "not found" state rather than an error banner.
- `certificateIDs` (the string → tokenId lookup) is declared in your
  contract but never populated inside `issueCertificate`, so it will always
  read back `0`. The frontend doesn't rely on it — see
  `PRODUCTION-NOTES.md` for the fix.
- `owner()` is used as the sole access-control check (`useIsIssuer`). It's
  isolated in one hook on purpose: when you migrate to role-based access
  control (recommended — see `PRODUCTION-NOTES.md`), this is the only file
  that needs to change.
- The Issue form hashes the PDF with `keccak256` **in the browser** — the
  file itself is never uploaded anywhere by this app. You still need to pin
  it to IPFS yourself (Pinata, web3.storage, or your own node) and paste the
  resulting CID into the form.

## What's intentionally not here yet

- A subgraph/indexer for "list all certificates" style queries — the
  contract has no enumeration function, so that has to come from indexing
  `CertificateIssued` events (see the roadmap).
- Multi-institution support — right now there's exactly one issuer wallet.
- Tests (Vitest + React Testing Library) — recommended before this goes
  further than a prototype.
