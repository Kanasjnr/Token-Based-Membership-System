import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";


const EventHubModule = buildModule("EventHubModule", (m) => {
  const eventHubToken = m.contract("EventHubToken", ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);

  const usdtToken = m.contract("UsdtToken", ["0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266"]);

  const eventHubProposal = m.contract("EventProposal");

  const eventTokenPurchase = m.contract("TokenPurchase", [eventHubToken, usdtToken]);

  const eventHub = m.contract("EventHub", [eventHubToken, eventHubProposal, eventTokenPurchase])



  return { eventHub,  eventHubToken, usdtToken, eventHubProposal, eventTokenPurchase};
});

export default EventHubModule;