# Atlas Valley MVP Architecture Initialization

This repository is initialized as a production-leaning workspace monorepo:

- `contracts/` — ARKV token + AtlasCore protocol contracts, deployment scripts, tests.
- `backend/` — API gateway, auth middleware, encryption service, IPFS and blockchain adapters, realtime gateway.
- `frontend/` — React client app with pages/components/lib split and route-driven UX.
- `scripts/` — project bootstrap and operator utilities.

## Service Boundaries

1. **Identity Layer**
   - Wallet challenge-response (`/auth/nonce`, `/auth/verify`).
   - JWT session for authenticated API access.

2. **Data Layer**
   - Avatars: metadata stored on IPFS via content-addressed storage adapter.
   - Biometrics: encrypted off-chain payload + on-chain data proof hash.

3. **Value Layer**
   - `ARKVToken` ERC-20 for rewards.
   - `AtlasCore` contract for anchoring and controlled reward minting.

4. **Realtime Layer**
   - Presence broadcasting.
   - Mission completion + activity fanout via Socket.IO.

## Startup Sequence

1. Compile contracts.
2. Start local chain (Hardhat).
3. Start backend and initialize DB/IPFS/blockchain adapters.
4. Auto-deploy contracts if addresses are not preconfigured and artifacts exist.
5. Start frontend and connect UI to API + websocket channels.
