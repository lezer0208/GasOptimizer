// scripts/deploy.js
const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
    console.log("🚀 Starting deployment process...");
    
    const [deployer] = await hre.ethers.getSigners();
    console.log("📍 Deployer:", deployer.address);
    
    const balance = await hre.ethers.provider.getBalance(deployer.address);
    console.log("💰 Balance:", hre.ethers.formatEther(balance), "ETH");
    
    // Deploy contract
    const Contract = await hre.ethers.getContractFactory("Gasoptimizer");
    const contract = await Contract.deploy();
    await contract.waitForDeployment();
    
    const address = await contract.getAddress();
    console.log("✅ Gasoptimizer deployed to:", address);
    
    // Save deployment info
    const deploymentInfo = {
        contract: "Gasoptimizer",
        address: address,
        deployer: deployer.address,
        network: hre.network.name,
        timestamp: new Date().toISOString(),
        blockNumber: await hre.ethers.provider.getBlockNumber()
    };
    
    const deploymentsDir = path.join(__dirname, "../deployments");
    if (!fs.existsSync(deploymentsDir)) {
        fs.mkdirSync(deploymentsDir, { recursive: true });
    }
    
    fs.writeFileSync(
        path.join(deploymentsDir, `${hre.network.name}.json`),
        JSON.stringify(deploymentInfo, null, 2)
    );
    
    console.log("📁 Deployment info saved");
    
    return address;
}

main().catch(console.error);
