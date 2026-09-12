# Blockchain Development Roadmap

We'll build the blockchain in **10 steps**.

```
1. Set up Foundry
        ↓
2. Design the smart contract
        ↓
3. Implement certificate issuance
        ↓
4. Implement certificate verification
        ↓
5. Implement certificate revocation
        ↓
6. Implement certificate amendment
        ↓
7. Write unit tests
        ↓
8. Deploy locally (Anvil)
        ↓
9. Deploy to Sepolia
        ↓
10. Connect to the frontend/backend
```

---

# Step 1 — Set Up Foundry

Create the project.

```bash
mkdir blockchain
cd blockchain

forge init .
```

Your structure should look similar to:

```
blockchain/

├── src/
│     Counter.sol
│
├── test/
│     Counter.t.sol
│
├── script/
│     Counter.s.sol
│
├── lib/
│
├── foundry.toml
│
└── remappings.txt
```

Delete the sample contract:

```
Counter.sol
Counter.t.sol
Counter.s.sol
```

---

# Step 2 — Install OpenZeppelin

We'll use audited smart contract libraries.

```bash
forge install OpenZeppelin/openzeppelin-contracts
```

Update `remappings.txt` if needed:

```
@openzeppelin/=lib/openzeppelin-contracts/
```

---

# Step 3 — Decide the Contract Type

You have two good options.

### Option 1: ERC-721 (NFT)

Certificates behave like NFTs.

Pros:

- Widely supported
- Easy to display in wallets

Cons:

- Transferable by default (not ideal)

---

### Option 2 (Recommended): Soulbound Certificate

Certificates **cannot be transferred**.

This better represents real academic credentials.

We'll still inherit from ERC-721 but override transfer functions so they revert.

---

# Step 4 — Design the Certificate

Before writing any code, define exactly what lives on-chain.

```solidity
Certificate

├── tokenId
├── certificateId
├── studentName
├── registrationNumber
├── course
├── degree
├── issueDate
├── ipfsCID
├── pdfHash
├── revoked
```

Notice that we **do not store the PDF itself** on-chain—only its IPFS CID and cryptographic hash.

---

# Step 5 — Plan the Contract State

Think about the data you'll need.

```
Certificate

↓

mapping(tokenId => Certificate)
```

You'll also want a way to find a certificate by its ID.

```
certificateId

↓

tokenId
```

This suggests another mapping:

```
mapping(string => uint256)
```

So you'll likely maintain:

- `mapping(uint256 => Certificate)` for certificate details.
- `mapping(string => uint256)` to look up certificates by their human-readable ID.

---

# Step 6 — Decide the Functions

Your contract should expose only a few well-defined actions.

### Issue

Creates a new certificate.

```
issueCertificate()
```

Only the institution (owner/admin) should be allowed to call this.

---

### Verify

Returns certificate information.

```
verifyCertificate()
```

Anyone should be able to call this.

---

### Revoke

Marks a certificate as revoked.

```
revokeCertificate()
```

Only the issuer/admin.

---

### Amend

Instead of editing an existing certificate:

```
Old Certificate

↓

Revoked

↓

New Certificate Issued
```

This preserves an immutable history.

---

### Get Certificate

Returns all stored information.

```
getCertificate()
```

---

# Step 7 — Plan the Events

Events let off-chain applications react to blockchain activity.

You'll probably emit events such as:

- Certificate issued
- Certificate revoked

These are useful for indexing, logs, and UI updates.

---

# Step 8 — Decide the Access Control

Who is allowed to issue certificates?

Simplest approach:

```
Owner
```

Later you can upgrade to multiple institutions using OpenZeppelin's `AccessControl`.

Start simple.

```
Owner

↓

Issue

↓

Revoke
```

---

# Step 9 — Plan the Verification Flow

```
Employer

↓

Scans QR

↓

Certificate ID

↓

Backend/Frontend

↓

Smart Contract

↓

Certificate Data

↓

Valid?

↓

YES / NO
```

Notice that **verification never modifies blockchain state**—it only reads from it.

---

# Step 10 — Testing Strategy

Before deployment, write tests for scenarios such as:

- Certificate is issued successfully.
- Duplicate certificate IDs are rejected.
- Only the owner can issue certificates.
- Verification returns the correct data.
- Revoked certificates report the revoked status.
- Non-existent certificate IDs are handled gracefully.

Foundry's testing framework makes this straightforward.

---

# Deployment Flow

### Local Development

Start a local blockchain:

```bash
anvil
```

Deploy:

```bash
forge script script/Deploy.s.sol \
--rpc-url http://127.0.0.1:8545 \
--broadcast
```

Test interactions against this local chain first.

---

### Testnet Deployment

Once local testing passes:

1. Get Sepolia ETH from a faucet.
2. Set up environment variables (RPC URL and deployer private key).
3. Deploy with a Foundry script.
4. Save the deployed contract address and ABI for your frontend/backend.

---

# Suggested Folder Structure

```
blockchain/

src/
│
├── CertificateNFT.sol
│
├── interfaces/
│      ICertificate.sol
│
├── libraries/
│      Errors.sol
│      Events.sol
│
└── structs/
       CertificateStruct.sol

script/

Deploy.s.sol

test/

CertificateNFT.t.sol
```

As the project grows, separating interfaces, libraries, and structs keeps the codebase maintainable.

---

# What We'll Build First

To keep things manageable, I recommend this order:

1. **Basic ERC-721 (or soulbound) contract** with ownership.
2. **Certificate struct** and storage mappings.
3. `issueCertificate()`.
4. `getCertificate()` / `verifyCertificate()`.
5. `revokeCertificate()`.
6. Unit tests.
7. Deployment script.
8. Integration with the backend and frontend.

This incremental approach ensures you always have a working contract before adding the next feature.
