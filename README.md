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
