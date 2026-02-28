import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Deploying CommitChain to network...\n");

  const signers = await ethers.getSigners();
  if (!signers.length) {
    throw new Error(
      "No signer found. Make sure PRIVATE_KEY is set in your root .env file."
    );
  }
  const deployer = signers[0];
  console.log("   Deployer:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("   Balance: ", ethers.formatEther(balance), "POL\n");

  const CommitChain = await ethers.getContractFactory("CommitChain");
  const contract = await CommitChain.deploy();
  await contract.waitForDeployment();

  const address = await contract.getAddress();

  console.log("✅ CommitChain deployed!");
  console.log("   Address:", address);
  console.log("   Explorer: https://amoy.polygonscan.com/address/" + address);
  console.log("\n📋 Add to your .env:");
  console.log(`   NEXT_PUBLIC_CONTRACT_ADDRESS=${address}`);
}

main().catch((error) => {
  console.error("❌ Deployment failed:", error);
  process.exitCode = 1;
});
