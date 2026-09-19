# Production notes

Short, code-adjacent version of the recommendations covered in chat. Kept
here so they travel with the repo instead of living only in a conversation.

## Contract

1. **Fix the dead `certificateIDs` mapping.** `issueCertificate` never writes
   to it. Either populate it (`certificateIDs[registrationNumber] = tokenId`,
   guarding against collisions) or remove it — a public mapping that silently
   never updates is worse than not having it.

2. **Move off a single `owner`.** Use OpenZeppelin `AccessControl` with an
   `ISSUER_ROLE` and a separate `DEFAULT_ADMIN_ROLE` held by a multisig
   (Gnosis Safe). A single EOA that can mint and revoke arbitrary academic
   records is a single point of failure and a single point of compromise.

3. **Don't put PII in `string` storage permanently on a public chain.**
   `studentName`, `registrationNumber`, `courseName`, `degree` are all
   plaintext, forever, to anyone. Recommended shape:
   - On-chain: `bytes32 dataHash` (commitment to a canonical JSON blob),
     `pdfHash`, `ipfsCID` pointing at *encrypted or access-controlled*
     metadata, `revoked`, `issueDate`.
   - Off-chain: the actual metadata JSON (name, reg number, course, degree),
     served from your backend or IPFS with access control, verifiable
     against `dataHash`.
   - This also meaningfully cuts gas cost, since dynamic string storage is
     one of the most expensive things you can put on-chain.

4. **Implement `tokenURI()`.** Right now this is an ERC721 with no metadata
   endpoint — wallets and explorers can't render it. Return an ERC-721
   metadata JSON (can be generated on the fly by a small backend endpoint,
   or pinned per-token to IPFS at issuance time).

5. **Signal soulbound-ness properly.** Reverting on `transferFrom` works,
   but implement ERC-5192 (`locked(uint256)` + `Locked` event) so wallets
   and marketplaces can detect "non-transferable" without trying and
   failing a transfer first.

6. **Make `amendCertificate` atomic.** Today the docstring says "caller then
   issues a new one" — two separate transactions, no on-chain link between
   old and new. Combine into one function that revokes the old token and
   mints the replacement in the same call, and store
   `mapping(uint256 => uint256) supersededBy` for provenance.

7. **Batch issuance for cohorts.** One `issueCertificate` call per graduate
   doesn't scale to a class of 2,000. Options, cheapest first:
   - Merkle-root pattern: publish one root per cohort, verify individual
     certificates with a Merkle proof (on-chain or off-chain) rather than
     storing each one directly.
   - A `issueBatch(Certificate[] calldata)` function if you want everything
     minted, accepting the higher but batched gas cost.

8. **Add `Pausable`.** An emergency stop for `issueCertificate` /
   `revokeCertificate` if a signer key is ever suspected compromised.

9. **Consider EIP-712 signed issuance.** Let the institution sign
   certificate data off-chain; anyone (e.g. the registrar's ops team, or
   even the student) can submit the mint transaction and pay gas, as long
   as it carries a valid signature from an `ISSUER_ROLE` holder. Decouples
   "who has the authority to issue" from "who pays for and submits the
   transaction."

10. **Struct packing.** `issueDate` doesn't need a full `uint256` (a
    `uint40` covers dates until the year 36,825); pack it with `revoked`
    (`bool`) in the same storage slot to save an SSTORE per issuance.

11. **Testing depth.** You have 6 passing unit tests — good start. Before
    testnet-hardening: add Foundry fuzz tests (`testFuzz_`) on tokenId /
    certificateId inputs, invariant tests (e.g. "a revoked certificate can
    never become unrevoked"), and run Slither for static analysis.

## Frontend / infra

- Add a subgraph (The Graph) or a lightweight indexer that listens for
  `CertificateIssued` / `CertificateRevoked` / `CertificateAmended` and
  writes to a queryable database — the contract has no "list all
  certificates" function, and iterating tokenIds client-side won't scale.
- Never let the frontend hold or request a private key. All writes go
  through the connected wallet's own signing flow, which this starter
  already does via `useWriteContract`.
- Rate-limit/cache RPC reads (React Query's `staleTime`, already configured
  in `main.tsx`) rather than hitting your RPC provider on every render.
- Use your own RPC endpoint (Alchemy/Infura) in production, not a public
  default — public RPCs are rate-limited and not something you control.
