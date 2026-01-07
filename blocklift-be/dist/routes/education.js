"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
console.log('✅ Education router loaded successfully');
// ============================================
// SECURE AUTHENTICATION MIDDLEWARE
// ============================================
/**
 * Middleware to verify the upload token from Authorization header.
 * Expected format: "Bearer <TOKEN>"
 * Compares against process.env.UPLOAD_SECRET_TOKEN
 */
const checkAuth = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Missing Authorization header',
        });
    }
    // Extract token from "Bearer <TOKEN>"
    const parts = authHeader.split(' ');
    if (parts.length !== 2 || parts[0] !== 'Bearer') {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid Authorization header format. Use: Bearer <TOKEN>',
        });
    }
    const token = parts[1];
    const secretToken = process.env.UPLOAD_SECRET_TOKEN;
    console.log('Received token:', token);
    console.log('Expected token:', secretToken);
    if (!secretToken) {
        console.error('UPLOAD_SECRET_TOKEN environment variable is not set');
        return res.status(500).json({
            error: 'Server configuration error',
            message: 'Upload secret token not configured',
        });
    }
    if (token !== secretToken) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid token',
        });
    }
    // Token is valid, proceed
    next();
};
// ============================================
// DUMMY EDUCATION DATA
// ============================================
const EDUCATION_ITEMS = [
    {
        id: 'basics-ledger',
        title: 'What is a Decentralized Ledger?',
        summary: 'Understand the foundations of blockchain data and consensus.',
        category: 'Bitcoin/Web3 Basics',
        type: 'article',
        sourceId: 'basics-ledger',
        content: `# What is a Decentralized Ledger?

A decentralized ledger is a database that is distributed across multiple locations, institutions, or participants. Unlike traditional centralized databases, no single entity has complete control over the entire ledger.

## Key Characteristics

### 1. Distributed Storage
The ledger is replicated across multiple nodes in a network. Each node maintains its own copy of the entire ledger.

### 2. Consensus Mechanism
Nodes must agree on the state of the ledger through a consensus algorithm. This ensures that all copies remain synchronized and accurate.

### 3. Immutability
Once data is recorded and confirmed, it becomes extremely difficult to alter or delete. This creates a permanent and tamper-evident record.

### 4. Transparency
Most decentralized ledgers are transparent, allowing anyone to view the transaction history and verify the integrity of the data.

## Benefits

- **No single point of failure**: The system continues to operate even if some nodes go offline
- **Censorship resistance**: No single authority can prevent transactions or access
- **Trust minimization**: Participants don't need to trust each other, only the protocol
- **Auditability**: All transactions are recorded and can be independently verified

## Real-World Applications

Decentralized ledgers power cryptocurrencies like Bitcoin, enable smart contracts on platforms like Stacks, and are being explored for supply chain tracking, identity management, and more.`
    },
    {
        id: 'basics-history',
        title: 'The History of Bitcoin',
        summary: 'From the whitepaper to global adoption and sound money debates.',
        category: 'Bitcoin/Web3 Basics',
        type: 'article',
        sourceId: 'basics-history',
        content: `# The History of Bitcoin

Bitcoin emerged as the first successful cryptocurrency, introducing the world to blockchain technology and decentralized digital money.

## The Genesis (2008-2009)

### The Whitepaper
On October 31, 2008, an individual or group using the pseudonym **Satoshi Nakamoto** published "Bitcoin: A Peer-to-Peer Electronic Cash System." This nine-page document outlined a revolutionary system for digital money that required no trusted third party.

### First Block
On January 3, 2009, Satoshi mined the first Bitcoin block (the "Genesis Block"), which contained the text: *"The Times 03/Jan/2009 Chancellor on brink of second bailout for banks"* - a reference to the financial crisis that motivated Bitcoin's creation.

## Early Days (2009-2011)

- **First Transaction**: The first Bitcoin transaction occurred on January 12, 2009, when Satoshi sent 10 BTC to Hal Finney
- **Pizza Day**: On May 22, 2010, Laszlo Hanyecz bought two pizzas for 10,000 BTC - the first real-world Bitcoin transaction
- **Growing Value**: Bitcoin reached parity with the US dollar in February 2011

## Mainstream Recognition (2012-2017)

Bitcoin gained increasing attention from investors, technologists, and regulators. The price experienced significant volatility but demonstrated an overall upward trend.

## Institutional Adoption (2018-Present)

Major companies and financial institutions began accepting Bitcoin. El Salvador made it legal tender in 2021. Bitcoin ETFs launched in multiple countries, bringing cryptocurrency to traditional investment portfolios.

## The Sound Money Debate

Bitcoin advocates argue it represents "sound money" - currency with properties that make it a reliable store of value:
- **Fixed supply**: Only 21 million Bitcoin will ever exist
- **Decentralization**: No government or institution controls it
- **Divisibility**: Can be divided into 100 million satoshis
- **Portability**: Can be sent anywhere instantly

## Legacy

Bitcoin inspired thousands of cryptocurrencies and blockchain projects. It demonstrated that decentralized, trustless systems could work at scale, opening new possibilities for finance, governance, and technology.`
    },
    {
        id: 'stacks-secured',
        title: 'Why Stacks is Secured by Bitcoin',
        summary: 'Learn how the Stacks layer leverages Bitcoin\'s security guarantees.',
        category: 'Stacks Layer 2',
        type: 'article',
        sourceId: 'stacks-secured',
        content: `# Why Stacks is Secured by Bitcoin

Stacks is a Bitcoin Layer 2 that brings smart contracts and decentralized applications to Bitcoin without modifying Bitcoin itself.

## The Proof of Transfer (PoX) Mechanism

Stacks uses a novel consensus mechanism called **Proof of Transfer (PoX)** that anchors to Bitcoin's security.

### How It Works

1. **Bitcoin Commitment**: Stacks miners commit Bitcoin to participate in leader election
2. **Block Production**: Selected miners write new Stacks blocks
3. **Bitcoin Settlement**: Each Stacks block's hash is written to Bitcoin
4. **Inheritance of Security**: The Bitcoin blockchain becomes a source of truth for Stacks

## Why This Matters

### Leveraging Bitcoin's Security
Bitcoin has the most secure blockchain in the world, backed by immense computational power. By anchoring to Bitcoin, Stacks inherits this security.

### No Forking Bitcoin
Stacks achieves smart contract functionality without requiring any changes to Bitcoin's base layer, maintaining Bitcoin's security and stability.

### STX Token Economics
STX holders can participate in consensus by Stacking their tokens, earning Bitcoin rewards in return for helping secure the network.

## Smart Contracts on Bitcoin

Stacks brings programmability to Bitcoin through:
- **Clarity smart contracts**: A decidable language designed for safety
- **Bitcoin interactions**: Contracts can read Bitcoin state and trigger based on Bitcoin transactions
- **Decentralized apps**: Full-featured dApps that leverage Bitcoin's security

## Use Cases

- **DeFi on Bitcoin**: Lending, borrowing, and trading secured by Bitcoin
- **NFTs with Bitcoin backing**: Digital assets with Bitcoin's longevity guarantees
- **Decentralized identity**: Self-sovereign identity anchored to Bitcoin
- **Impact verification**: Like BlockLift's proof-of-impact system

By building on Stacks, developers can create sophisticated applications while benefiting from Bitcoin's unmatched security and network effects.`
    },
    {
        id: 'stx-token',
        title: 'The STX Token Explained',
        summary: 'Utility, governance, and network incentives in the Stacks ecosystem.',
        category: 'Stacks Layer 2',
        type: 'article',
        content: `# The STX Token Explained

STX is the native cryptocurrency of the Stacks blockchain, serving multiple critical functions in the ecosystem.

## Core Functions

### 1. Transaction Fees
All transactions on the Stacks network require STX to pay for gas fees, similar to how Ethereum uses ETH.

### 2. Smart Contract Execution
Deploying and executing smart contracts costs STX, compensating miners for computational resources.

### 3. Stacking (Consensus Participation)
STX holders can "Stack" their tokens by locking them for a period to:
- Help secure the network
- Earn Bitcoin rewards
- Participate in governance

### 4. Token Registration
Creating new tokens or NFTs on Stacks requires STX.

## Stacking: Earning Bitcoin

The Stacking mechanism is unique to Stacks:

1. **Lock STX**: Commit your tokens for reward cycles
2. **Support Miners**: Your locked STX signals support for honest miners
3. **Earn BTC**: Receive Bitcoin rewards as miners transfer BTC to Stackers
4. **Compound Growth**: Use earned BTC to acquire more STX if desired

## Tokenomics

- **Total Supply**: Capped at a maximum of ~1.82 billion STX
- **Distribution**: Through mining and early allocation
- **Inflation**: Decreasing over time as the network matures
- **Deflation Mechanisms**: Transaction fees are burned in some cases

## Governance

STX holders have a voice in network upgrades and parameters through community governance processes.

## Getting STX

You can acquire STX through:
- Cryptocurrency exchanges
- Mining (running a Stacks node)
- Earning through dApp participation
- Direct purchase via services like Boom Wallet

## Real-World Value

STX derives value from:
- Network utility (required for all network operations)
- Bitcoin yield (through Stacking)
- Growing ecosystem adoption
- Speculation on future network growth

Understanding STX is essential for anyone building on or participating in the Stacks ecosystem.`
    },
    {
        id: 'clarity-intro',
        title: 'Introduction to Clarity',
        summary: 'A decidable smart contract language designed for security.',
        category: 'Clarity Smart Contracts',
        type: 'article',
        sourceId: 'clarity-intro',
        content: `# Introduction to Clarity

Clarity is a smart contract language designed for the Stacks blockchain with security and predictability as top priorities.

## What Makes Clarity Different?

### 1. Decidable
Unlike Solidity or other Turing-complete languages, Clarity is **decidable**. This means you can know exactly what a program will do before executing it.

**Benefits:**
- No unexpected behavior
- Complete static analysis possible
- Easier auditing and verification

### 2. Interpreted, Not Compiled
Clarity code is not compiled to bytecode. The code you write is the code that executes, making it:
- Transparent
- Verifiable on-chain
- Free from compiler bugs

### 3. No Reentrancy
Clarity's design prevents reentrancy attacks (like the DAO hack) by default.

## Core Syntax

### Defining Constants
\`\`\`clarity
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
\`\`\`

### Data Variables
\`\`\`clarity
(define-data-var counter uint u0)

(define-public (increment)
  (ok (var-set counter (+ (var-get counter) u1))))
\`\`\`

### Public Functions
\`\`\`clarity
(define-public (transfer (amount uint) (recipient principal))
  (begin
    (asserts! (>= (stx-get-balance tx-sender) amount) (err u1))
    (try! (stx-transfer? amount tx-sender recipient))
    (ok true)))
\`\`\`

### Read-Only Functions
\`\`\`clarity
(define-read-only (get-balance (account principal))
  (stx-get-balance account))
\`\`\`

## Data Structures

### Maps (Key-Value Storage)
\`\`\`clarity
(define-map balances principal uint)

(map-set balances tx-sender u1000)
(map-get? balances tx-sender)
\`\`\`

### Fungible Tokens
\`\`\`clarity
(define-fungible-token my-token)
\`\`\`

### Non-Fungible Tokens
\`\`\`clarity
(define-non-fungible-token my-nft uint)
\`\`\`

## Safety Features

1. **No Null/Undefined**: Uses optionals and results explicitly
2. **Access Control**: Built-in checks like tx-sender
3. **Math Safety**: Overflow protection built-in
4. **Type Safety**: Strong static typing

## Development Workflow

1. **Write**: Create .clar files locally
2. **Test**: Use Clarinet for local testing
3. **Deploy**: Deploy to testnet/mainnet
4. **Interact**: Call functions from web apps or CLI

## Learning Resources

- **Clarinet**: Local development environment
- **Clarity Book**: Official documentation
- **Hiro Platform**: APIs and tools
- **Examples**: Study existing contracts on mainnet

Clarity's design philosophy prioritizes predictability and security over flexibility, making it ideal for financial applications and systems where correctness is critical.`
    },
    {
        id: 'clarity-ft',
        title: 'Writing Your First Fungible Token (FT)',
        summary: 'Step-by-step to author and deploy a basic FT contract.',
        category: 'Clarity Smart Contracts',
        type: 'code',
        sourceId: 'clarity-ft',
        codeSnippet: `;; simple-token.clar
;; A basic fungible token implementation in Clarity

;; Define the fungible token
(define-fungible-token simple-token)

;; Constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-not-enough-balance (err u101))

;; Token name and symbol (for display)
(define-data-var token-name (string-ascii 32) "Simple Token")
(define-data-var token-symbol (string-ascii 10) "SMP")
(define-data-var token-decimals uint u6)

;; Total supply tracking
(define-data-var total-supply uint u0)

;; Read-only functions
(define-read-only (get-name)
  (ok (var-get token-name)))

(define-read-only (get-symbol)
  (ok (var-get token-symbol)))

(define-read-only (get-decimals)
  (ok (var-get token-decimals)))

(define-read-only (get-balance (account principal))
  (ok (ft-get-balance simple-token account)))

(define-read-only (get-total-supply)
  (ok (var-get total-supply)))

;; Public functions

;; Mint new tokens (owner only)
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (try! (ft-mint? simple-token amount recipient))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok true)))

;; Transfer tokens
(define-public (transfer (amount uint) (sender principal) (recipient principal) (memo (optional (buff 34))))
  (begin
    (asserts! (is-eq tx-sender sender) (err u102))
    (try! (ft-transfer? simple-token amount sender recipient))
    (match memo to-print (print to-print) 0x)
    (ok true)))

;; Burn tokens
(define-public (burn (amount uint))
  (begin
    (try! (ft-burn? simple-token amount tx-sender))
    (var-set total-supply (- (var-get total-supply) amount))
    (ok true)))

;; Initialize with a supply (owner only, can only be called once)
(define-data-var initialized bool false)

(define-public (initialize (initial-supply uint))
  (begin
    (asserts! (not (var-get initialized)) (err u103))
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (try! (ft-mint? simple-token initial-supply contract-owner))
    (var-set total-supply initial-supply)
    (var-set initialized true)
    (ok true)))`,
        content: `# Writing Your First Fungible Token

This tutorial walks you through creating a simple fungible token (FT) in Clarity.

## Prerequisites

- Basic understanding of Clarity syntax
- Clarinet installed locally
- A code editor

## What We'll Build

A fungible token contract with:
- Minting capability (owner only)
- Transfer functionality
- Burn mechanism
- Balance tracking
- Read-only getters

## Step 1: Set Up Your Project

\`\`\`bash
clarinet new my-token-project
cd my-token-project
clarinet contract new simple-token
\`\`\`

## Step 2: Define the Token

The \`define-fungible-token\` trait creates a fungible token:

\`\`\`clarity
(define-fungible-token simple-token)
\`\`\`

This single line sets up all the underlying accounting for your token.

## Step 3: Add Metadata

Store token information:

\`\`\`clarity
(define-data-var token-name (string-ascii 32) "Simple Token")
(define-data-var token-symbol (string-ascii 10) "SMP")
(define-data-var token-decimals uint u6)
\`\`\`

## Step 4: Implement Minting

Allow the owner to create new tokens:

\`\`\`clarity
(define-public (mint (amount uint) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender contract-owner) err-owner-only)
    (try! (ft-mint? simple-token amount recipient))
    (var-set total-supply (+ (var-get total-supply) amount))
    (ok true)))
\`\`\`

## Step 5: Enable Transfers

Let users send tokens:

\`\`\`clarity
(define-public (transfer (amount uint) (sender principal) (recipient principal))
  (begin
    (asserts! (is-eq tx-sender sender) (err u102))
    (try! (ft-transfer? simple-token amount sender recipient))
    (ok true)))
\`\`\`

## Step 6: Test Your Contract

Create a test file:

\`\`\`typescript
import { assertEquals } from 'https://deno.land/std/testing/asserts.ts';

Clarinet.test({
    name: "Can mint tokens to recipient",
    async fn(chain, accounts) {
        const deployer = accounts.get("deployer")!;
        const wallet1 = accounts.get("wallet_1")!;
        
        let block = chain.mineBlock([
            Tx.contractCall("simple-token", "mint", [
                types.uint(1000),
                types.principal(wallet1.address)
            ], deployer.address)
        ]);
        
        block.receipts[0].result.expectOk();
    }
});
\`\`\`

## Step 7: Deploy

Deploy to testnet:

\`\`\`bash
clarinet integrate
clarinet deploy --testnet
\`\`\`

## Best Practices

1. **Access Control**: Use assertions to restrict sensitive functions
2. **Supply Tracking**: Maintain accurate total supply
3. **Error Handling**: Return meaningful error codes
4. **Events**: Print important state changes for indexers
5. **Testing**: Write comprehensive tests before deployment

## Next Steps

- Add allowance/approval mechanisms
- Implement vesting schedules
- Create staking functionality
- Build a frontend interface

You've now created your first fungible token! This foundation can be extended for real-world applications like governance tokens, reward systems, or payment mechanisms.`
    },
    {
        id: 'blocklift-nft-proof',
        title: 'How Our NFT Proof of Impact Works',
        summary: 'Traceable, verifiable impact artifacts on chain.',
        category: 'BlockLift Technology',
        type: 'article',
        sourceId: 'blocklift-nft-proof',
        content: `# How Our NFT Proof of Impact Works

BlockLift uses NFTs not as collectibles, but as verifiable proof of real-world impact in education and community development.

## The Problem We're Solving

Traditional charity faces a trust problem:
- Donors can't verify where money goes
- Impact claims are often unverifiable
- No permanent record of outcomes
- Middlemen take significant cuts

## Our Solution: Impact NFTs

### What is an Impact NFT?

An Impact NFT is a non-fungible token that represents:
1. **A donation**: The amount contributed and when
2. **Real impact**: Specific outcomes (students equipped, schools built, etc.)
3. **Verification**: Photos, documents, and ambassador attestations
4. **Permanence**: Immutable record on the Bitcoin-secured blockchain

### How It Works

#### 1. Donation & Minting
When you donate to BlockLift:
- Your contribution is processed (crypto or fiat)
- An NFT is minted to your wallet address
- The NFT contains metadata about your donation

#### 2. Impact Execution
Our field ambassadors:
- Purchase and distribute educational supplies
- Document the impact with photos and records
- Upload verification materials

#### 3. NFT Updates
The NFT metadata is updated to include:
- Photos from the field
- Number of students impacted
- Location and date
- Ambassador attestation
- Transaction trail

#### 4. Verification
Anyone can:
- View the NFT on a block explorer
- See the complete chain of custody
- Verify the Bitcoin settlement
- Access impact documentation

## Technical Architecture

### Smart Contract Layer
Our Clarity smart contracts on Stacks:
- Mint impact NFTs
- Store metadata URIs
- Track sponsor relationships
- Record verification status

### Metadata Storage
Impact data is stored:
- **On-chain**: Core data (amounts, dates, status)
- **IPFS**: Images and documents (decentralized, permanent)
- **Backend**: Enriched metadata and indexing

### Bitcoin Settlement
Every Stacks block (containing our NFT transactions) is hashed and written to Bitcoin, providing:
- Ultimate security
- Tamper-proof verification
- Long-term permanence

## Real-World Example

**Alice donates $100:**

1. Alice sends $100 via Paystack or STX
2. BlockLift mints Impact NFT #42 to Alice's wallet
3. The NFT shows: "Donated $100 on Jan 2, 2026"

**Impact happens:**

4. Ambassador John buys 20 notebooks in Lagos
5. Photos are taken at distribution
6. Metadata updated: "20 students at XYZ School received materials"

**Verification:**

7. Alice views her NFT in her wallet
8. She sees photos, location, date, and beneficiary count
9. She can verify the Stacks transaction on Bitcoin
10. The record is permanent and publicly auditable

## Why This Matters

### For Donors
- **Transparency**: See exactly where your money went
- **Verification**: Proof your contribution made a difference
- **Connection**: Visual evidence of impact
- **Permanence**: Your contribution is recorded forever

### For Beneficiaries
- **Accountability**: Every donation is tracked
- **Credibility**: Verifiable impact builds trust for future funding
- **Recognition**: Communities receive proper acknowledgment

### For the Ecosystem
- **Trust**: Blockchain eliminates the need to "just trust" charities
- **Efficiency**: Lower overhead, more money to impact
- **Innovation**: New model for transparent philanthropy

## Beyond BlockLift

This model can extend to:
- Carbon credits
- Supply chain verification
- Educational credentials
- Medical record verification
- Any scenario requiring proof of real-world events

## Getting Your Impact NFT

1. **Donate**: Use our website to contribute
2. **Wallet**: Connect your Stacks wallet (we recommend Boom)
3. **Receive**: NFT is minted directly to your address
4. **Track**: Watch as impact is verified and documented

Impact NFTs represent the future of transparent, verifiable social good. By combining blockchain technology with real-world action, we're creating a new standard for accountability in charitable giving.`
    },
    {
        id: 'boom-wallet',
        title: 'Using the Boom Wallet',
        summary: 'Wallet workflows and tips for BlockLift participants.',
        category: 'BlockLift Technology',
        type: 'video',
        videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder - replace with actual video
        content: `# Using the Boom Wallet

Boom Wallet is a user-friendly wallet for managing your Stacks assets, including BlockLift Impact NFTs.

## What is Boom Wallet?

Boom is a mobile-first cryptocurrency wallet designed for:
- Bitcoin (BTC)
- Stacks (STX)
- Stacks-based tokens and NFTs
- Simple, secure management

## Getting Started

### Installation

1. **Download**: Get Boom from App Store or Google Play
2. **Create**: Set up a new wallet or import existing
3. **Backup**: Write down your secret recovery phrase
4. **Secure**: Set a PIN or biometric authentication

### Funding Your Wallet

**Buy STX directly:**
- Boom has integrated purchasing
- Use credit card or bank transfer
- STX appears in your wallet in minutes

**Transfer from exchange:**
- Copy your Boom STX address
- Withdraw from exchange to this address
- Wait for confirmation

## Managing Impact NFTs

### Receiving Your NFT

After donating to BlockLift:
1. Your NFT automatically appears in the NFTs tab
2. Tap to view details and impact data
3. View on explorer for full verification

### Viewing Impact Updates

As your donation creates impact:
- NFT metadata updates automatically
- Refresh to see new photos and data
- Share your impact with friends

## Security Best Practices

### Protect Your Recovery Phrase
- Never share with anyone
- Store offline in a secure location
- Never take a screenshot
- Write it down on paper

### Transaction Safety
- Always verify recipient addresses
- Start with small test transactions
- Double-check amounts before confirming
- Be cautious of phishing attempts

### Wallet Backup
- Regularly back up your recovery phrase
- Test recovery on a secondary device
- Ensure you can restore if phone is lost

## Using Boom with BlockLift

### Connect to Website

1. Visit blocklift.org
2. Click "Connect Wallet"
3. Select "Boom Wallet"
4. Approve connection in Boom app

### Make a Donation

1. Choose donation amount
2. Select STX payment
3. Confirm in Boom wallet
4. Wait for NFT to mint (1-2 minutes)

### View Your Impact

1. Open Boom NFTs tab
2. Tap your BlockLift NFT
3. See impact metrics and photos
4. Share proof of impact

## Troubleshooting

### NFT Not Showing?
- Wait 5-10 minutes for blockchain confirmation
- Pull down to refresh NFTs tab
- Check transaction on explorer

### Can't Connect Wallet?
- Update Boom to latest version
- Clear app cache
- Restart app and try again

### Transaction Failed?
- Ensure sufficient STX for gas fees
- Check network status
- Wait and retry

## Advanced Features

### Stacking STX
Boom supports Stacking to earn Bitcoin:
1. Navigate to Stack tab
2. Choose amount and duration
3. Set Bitcoin payout address
4. Confirm and start earning

### Transaction History
- View complete transaction log
- Export for tax reporting
- Filter by type and date

## Getting Help

- **In-app support**: Help center in settings
- **Boom community**: Telegram and Discord
- **BlockLift support**: contact@blocklift.org

## Video Tutorial

[Video player would be embedded here showing a walkthrough of:
- Installing Boom
- Connecting to BlockLift
- Making a donation
- Viewing Impact NFT
- Navigating wallet features]

Boom Wallet makes it easy for anyone to participate in the Bitcoin and Stacks ecosystem. With Boom, you can receive, manage, and verify your BlockLift Impact NFTs with confidence.`
    },
];
// ============================================
// GET /api/education/items
// Returns all education items (summary only, no full content)
// ============================================
router.get('/items', (req, res) => {
    try {
        // Return items without full content for listing view
        const items = EDUCATION_ITEMS.map(({ content, codeSnippet, ...item }) => item);
        res.json({ success: true, items });
    }
    catch (error) {
        console.error('Error fetching education items:', error);
        res.status(500).json({ error: 'Failed to fetch education items' });
    }
});
// ============================================
// GET /api/education/items/:id
// Returns a single education item with full content
// ============================================
router.get('/items/:id', (req, res) => {
    try {
        const { id } = req.params;
        const item = EDUCATION_ITEMS.find(i => i.id === id);
        if (!item) {
            return res.status(404).json({ error: 'Education item not found' });
        }
        res.json({ success: true, item });
    }
    catch (error) {
        console.error('Error fetching education item:', error);
        res.status(500).json({ error: 'Failed to fetch education item' });
    }
});
// ============================================
// GET /api/education/categories
// Returns all available categories
// ============================================
router.get('/categories', (req, res) => {
    try {
        const categories = [
            'Bitcoin/Web3 Basics',
            'Stacks Layer 2',
            'Clarity Smart Contracts',
            'BlockLift Technology',
        ];
        res.json({ success: true, categories });
    }
    catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});
// ============================================
// POST /api/education/upload
// Upload a new education article
// ============================================
router.post('/upload', checkAuth, (req, res) => {
    try {
        const { title, summary, category, type, content, videoUrl, codeSnippet } = req.body;
        // Validate required fields
        if (!title || !summary || !category || !type || !content) {
            return res.status(400).json({
                error: 'Missing required fields: title, summary, category, type, content'
            });
        }
        // Validate category
        const validCategories = [
            'Bitcoin/Web3 Basics',
            'Stacks Layer 2',
            'Clarity Smart Contracts',
            'BlockLift Technology',
        ];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: 'Invalid category' });
        }
        // Validate type
        const validTypes = ['article', 'video', 'code'];
        if (!validTypes.includes(type)) {
            return res.status(400).json({ error: 'Invalid type' });
        }
        // Create a new item with a unique ID
        const id = `uploaded-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newItem = {
            id,
            title,
            summary,
            category: category,
            type: type,
            content,
            videoUrl: videoUrl || undefined,
            codeSnippet: codeSnippet || undefined,
        };
        // Add to the items array
        EDUCATION_ITEMS.push(newItem);
        console.log(`✅ New education item uploaded: ${newItem.id} - ${newItem.title}`);
        res.json({
            success: true,
            message: 'Article uploaded successfully',
            item: newItem
        });
    }
    catch (error) {
        console.error('Error uploading education article:', error);
        res.status(500).json({ error: 'Failed to upload article' });
    }
});
// ============================================
// Delete an education article
// ============================================
router.delete('/items/:id', checkAuth, (req, res) => {
    try {
        const { id } = req.params;
        // Find the index of the item to delete
        const itemIndex = EDUCATION_ITEMS.findIndex((item) => item.id === id);
        if (itemIndex === -1) {
            return res.status(404).json({
                error: 'Article not found',
                message: `No article found with ID: ${id}`
            });
        }
        // Remove the item from the array
        const deletedItem = EDUCATION_ITEMS.splice(itemIndex, 1)[0];
        console.log(`✅ Education item deleted: ${deletedItem.id} - ${deletedItem.title}`);
        res.json({
            success: true,
            message: 'Article deleted successfully',
            item: deletedItem
        });
    }
    catch (error) {
        console.error('Error deleting education article:', error);
        res.status(500).json({ error: 'Failed to delete article' });
    }
});
exports.default = router;
//# sourceMappingURL=education.js.map