import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  
  const EventHubToken = await ethers.getContractFactory("EventHubToken");
  const eventHubToken = await EventHubToken.deploy(deployer.address);
  await eventHubToken.waitForDeployment();
  console.log("EventHubToken deployed to:", await eventHubToken.getAddress());

  
  const UsdtToken = await ethers.getContractFactory("UsdtToken");
  const usdtToken = await UsdtToken.deploy(deployer.address);
  await usdtToken.waitForDeployment();
  console.log("UsdtToken deployed to:", await usdtToken.getAddress());

  
  const EventProposal = await ethers.getContractFactory("EventProposal");
  const eventProposal = await EventProposal.deploy();
  await eventProposal.waitForDeployment();
  console.log("EventProposal deployed to:", await eventProposal.getAddress());

 
  const TokenPurchase = await ethers.getContractFactory("TokenPurchase");
  const tokenPurchase = await TokenPurchase.deploy(await eventHubToken.getAddress(), await usdtToken.getAddress());
  await tokenPurchase.waitForDeployment();
  console.log("TokenPurchase deployed to:", await tokenPurchase.getAddress());

 
  const EventHub = await ethers.getContractFactory("EventHub");
  const eventHub = await EventHub.deploy(
    await eventHubToken.getAddress(),
    await eventProposal.getAddress(),
    await tokenPurchase.getAddress()
  );
  await eventHub.waitForDeployment();
  console.log("EventHub deployed to:", await eventHub.getAddress());


  return {
    EventHubToken: await eventHubToken.getAddress(),
    UsdtToken: await usdtToken.getAddress(),
    EventProposal: await eventProposal.getAddress(),
    TokenPurchase: await tokenPurchase.getAddress(),
    EventHub: await eventHub.getAddress(),
  };
}

main()
  .then((addresses) => {
    console.log("Deployed contract addresses:", addresses);
    process.exit(0);
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });