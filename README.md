# ATLAS VALLEY ECOSYSTEM (MVP v1)

A production-ready Web3 MVP with wallet-bound identity, IPFS avatar metadata, encrypted biometric ingestion, on-chain proofs, ARKV mining rewards, and a realtime collaboration layer.

## Architecture Initialization (done first)

The repository is initialized with complete domain boundaries before feature coding:

- `contracts/`: blockchain protocol foundation (ERC-20 + AtlasCore + deploy/test)
- `backend/`: API/middleware/services/routes/realtime/storage modules
- `frontend/`: route-based UI with components/pages/lib separation
- `docs/`: architecture and operational design notes
- `scripts/`: bootstrap and maintenance helpers

Detailed topology: `docs/ARCHITECTURE.md`.

## Stack

- **Frontend:** React + Vite + React Router + Socket.IO client
- **Backend:** Express + JWT + AES-256-GCM + Socket.IO + IPFS-compatible content-addressed store
- **Blockchain:** Solidity + Hardhat + OpenZeppelin

## Core Features

1. **Digital Identity / Avatar**
   - MetaMask nonce-signature login
   - Wallet-linked persistent profile
   - Avatar editor
   - Metadata written to IPFS and CID persisted
   - Metadata hash anchored on-chain

2. **Vital Signs Module**
   - Simulated wearable input (heart rate, activity, sleep, health score)
   - AES-256-GCM encryption for raw payloads
   - Off-chain encrypted storage + on-chain hash proofs

3. **Resource Mining / $ARKV**
   - ERC-20 token `ARKV`
   - Activity-based reward issuance
   - On-chain reward tracking and wallet balance display

4. **Compete & Collaborate**
   - Shared dashboard and mission/tasks
   - Presence system
   - Realtime activity feed (Socket.IO)
   - Reputation updates

## Contracts

- `contracts/contracts/ARKVToken.sol`
- `contracts/contracts/AtlasCore.sol`

## Quick Start


## Setup phases

1. **Online setup (one-time):** `npm run setup` (runs `npm install --workspaces`)
2. **Offline/bootstrap phase:** `npm run bootstrap` (rebuild workspace links without downloads and compile contracts)
3. **Run stack:** `npm run dev`

```bash
cp .env.example .env
./scripts/setup.sh
./scripts/bootstrap.sh
npm run dev
```

Or manually:

```bash
npm run setup
npm run bootstrap
npm run dev
```

Services:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000`
- Hardhat chain: `http://127.0.0.1:8545`

## Commands

```bash
npm run dev
npm run build
npm test
npm run deploy --workspace contracts
```

## Environment

Use `.env.example` as the template for all required variables.

## Docker

```bash
docker compose up --build
```
