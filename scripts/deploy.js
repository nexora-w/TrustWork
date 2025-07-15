const hre = require("hardhat");

async function main() {
  console.log("Deploying TrustWork contract...");

  const TrustWork = await hre.ethers.getContractFactory("TrustWork");
  const trustWork = await TrustWork.deploy();

  await trustWork.waitForDeployment();

  const address = await trustWork.getAddress();
  console.log("TrustWork deployed to:", address);

  // Save the contract address to a file for frontend use
  const fs = require('fs');
  const contractInfo = {
    address: address,
    network: hre.network.name,
    deployedAt: new Date().toISOString()
  };

  fs.writeFileSync(
    './src/contract-info.json',
    JSON.stringify(contractInfo, null, 2)
  );

  console.log("Contract info saved to src/contract-info.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 