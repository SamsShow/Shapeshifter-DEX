const hre = require("hardhat");

async function main() {
  console.log("Deploying IdentityShapeshifter contract...");

  const IdentityShapeshifter = await hre.ethers.getContractFactory("IdentityShapeshifter");
  const identityShapeshifter = await IdentityShapeshifter.deploy();

  await identityShapeshifter.deployed();

  console.log(`IdentityShapeshifter deployed to: ${identityShapeshifter.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
