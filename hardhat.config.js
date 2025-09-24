require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    // Oasis Sapphire Testnet
    sapphire: {
      url: "https://testnet.sapphire.oasis.dev",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 23295,
    },
    // Oasis Sapphire Mainnet
    sapphireMain: {
      url: "https://sapphire.oasis.io",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 23294,
    },
    localhost: {
      url: "http://localhost:8545",
    }
  },
  paths: {
    artifacts: './artifacts',
    cache: './cache',
    sources: './contracts',
    tests: './test',
  },
  // For Oasis Sapphire contracts
  mocha: {
    timeout: 100000
  }
};
