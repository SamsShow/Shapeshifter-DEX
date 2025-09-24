const hre = require("hardhat");

async function main() {
  console.log("Deploying IdentityShapeshifter contract to Oasis Sapphire...");
  console.log("Network:", hre.network.name);

  // Get the deployer address
  const [deployer] = await hre.ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Deploy the contract
  const IdentityShapeshifter = await hre.ethers.getContractFactory("IdentityShapeshifter");
  const identityShapeshifter = await IdentityShapeshifter.deploy();

  await identityShapeshifter.deployed();

  console.log(`IdentityShapeshifter deployed to: ${identityShapeshifter.address}`);
  console.log("Transaction hash:", identityShapeshifter.deployTransaction.hash);
  
  console.log("\n-------------------------------------------------------");
  console.log("Contract deployment completed successfully!");
  console.log("This contract leverages Oasis Sapphire's confidential computation");
  console.log("to provide private persona management and trading.");
  console.log("-------------------------------------------------------\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });