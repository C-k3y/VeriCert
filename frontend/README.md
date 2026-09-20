# VeriCert — Frontend

A React + TypeScript + Vite starter for VeriCert, wired to the existing
`CertificateNFT` contract.Every file reads and writes the contract exactly as written (including its revert-based
"not found" pattern and soulbound behavior).

## Design concept: "The Sealed Ledger"

The subject matter is two things layered on top of each other: an academic
certificate (paper, ink, a registrar's stamp) and a blockchain record
(immutable, hashed, timestamped).The left side reads like an actual certificate, 
the right side is the machine-verifiable ledger strip (monospace hashes,
addresses, IDs). 
Verifying a certificate is visualized as *pressing a seal*
— idle → pressing → set in ledger-green ink (verified) or
seal-crimson ink (revoked).

## Getting started

```bash
npm install
cp .env.example .env.local
# fill in VITE_CONTRACT_ADDRESS with the deployed address,
# and VITE_RPC_URL with the Sepolia/Alchemy endpoint
npm run dev
```

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

## How the frontend maps to the contract

- `getCertificate(tokenId)` reverts with `CertificateNotFound` instead of
  returning a zeroed struct — `useCertificate` treats that revert as a
  first-class "not found" state rather than an error banner.
- `certificateIDs` (the string → tokenId lookup) is declared in the
  contract but never populated inside `issueCertificate`, so it will always
  read back `0`. 
- `owner()` is used as the sole access-control check (`useIsIssuer`).
- The Issue form hashes the PDF with `keccak256` **in the browser** — the
  file itself is never uploaded anywhere by this app.
  
## Upgrades

- A subgraph/indexer for "list all certificates" style queries — comes from indexing
  `CertificateIssued` events (see the roadmap).
- Multi-institution support — Currently supporting only one issuer wallet.
- Tests (Vitest + React Testing Library) 
