# Identity Shapeshifter DEX

A privacy-first trading platform built on Oasis Sapphire and Uniswap. This platform allows users to create and trade with anonymous personas, decoupling their real wallet address from trading activities.

## Features

- **Persona Creation**: Create multiple encrypted personas per wallet
- **Persona Switching**: Switch between personas in the UI
- **Token Swaps**: Execute swaps on Uniswap under the active persona
- **Trade History**: Display trade history per persona
- **Mid-Trade Switching**: Switch identities during a trade

## Tech Stack

- **Frontend**: React/Next.js
- **Smart Contracts**: Solidity on Oasis Sapphire
- **Development**: Hardhat
- **DEX Integration**: Uniswap Router

## Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Start the development server: `npm run dev`

## Smart Contract Development

1. Compile contracts: `npm run compile`
2. Deploy contracts: `npm run deploy`

## Project Structure

```
/
├── contracts/         # Oasis Sapphire smart contracts
├── pages/             # Next.js pages
├── components/        # React components
├── public/            # Static assets
├── styles/            # CSS styles
├── scripts/           # Deployment scripts
└── test/              # Contract tests
```

## Contracts

- `contracts/IdentityShapeshifter.sol` integrates with a minimal Uniswap V3 router interface.
- Owner can set router/fee with `setSwapRouter(router, fee)`.
- If router is unset (address(0)), swaps run in simulation mode (2% slippage) to enable local tests and UI demo without mainnet forking.

## Environment

Create `.env.local` (for Next.js) and `.env` (for Hardhat) as needed.

.env.local
- NEXT_PUBLIC_SHAPESHIFTER_ADDR=0x... // deployed on Sapphire
- NEXT_PUBLIC_DAI=0x...
- NEXT_PUBLIC_USDC=0x...
- NEXT_PUBLIC_WBTC=0x...
- NEXT_PUBLIC_UNI=0x...

.env
- PRIVATE_KEY=your_sapphire_key
- SAPPHIRE_TESTNET_URL=https://testnet.sapphire.oasis.dev

## Running

- Install deps: `npm install`
- Compile: `npm run compile`
- Test: `npx hardhat test`
- Deploy: `npm run deploy`
- Start UI: `npm run dev`

## Notes on privacy

- Persona data and swap history are stored on Sapphire, encrypted at rest and shielded in execution.
- Public events emit minimal metadata (no amounts) to avoid leakage.
- Frontend queries history only for the caller’s identities.

## Uniswap integration

- Minimal interface `contracts/interfaces/ISwapRouter.sol` exposes `exactInputSingle` only.
- Contract approves router per-swap and forwards output tokens to the caller.
- Pool fee configurable (default 0.3%).

## Testing personas

- Tests cover creating multiple personas and executing swaps under each, with histories kept per-identity.
