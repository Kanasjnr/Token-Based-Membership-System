// import { expect } from "chai";
// import { ethers } from "hardhat";
// import { EventHub } from "../typechain-types/contracts/EventHub";
// import { EventHubToken } from "../typechain-types/contracts/EVH.sol/EventHubToken";
// import { UsdtToken } from "../typechain-types/contracts/Usdt.sol/UsdtToken";
// import { TokenPurchase } from "../typechain-types/contracts/EVHTokenPurchase.sol/TokenPurchase";
// import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

// describe("EventHub Contract", function () {
//   async function deployEventHubFixture() {
//     const [owner] = await ethers.getSigners();

//     const EventHubFactory = await ethers.getContractFactory("EventHub");
//     const eventHub: EventHub = (await EventHubFactory.deploy(
//       "0x8bC6243ffa18Ca635Cdc8f635DbeF090dA748c92", // eventHubToken
//       "0x1234567890123456789012345678901234567890", // eventProposal
//       "0x1234567890123456789012345678901234567890" // eVHTokenPurchase
//     )) as EventHub;

//     return { eventHub, owner };
//   }

//   it("Should deploy the contract and initialize correctly", async function () {
//     const { eventHub, owner } = await loadFixture(deployEventHubFixture);

//     expect(await eventHub.owner()).to.equal(owner.address);
//     expect(await eventHub.eventHubToken()).to.equal(
//       "0x8bC6243ffa18Ca635Cdc8f635DbeF090dA748c92"
//     );
//     expect(await eventHub.eventProposal()).to.equal(
//       "0x1234567890123456789012345678901234567890"
//     );
//     expect(await eventHub.eVHTokenPurchase()).to.equal(
//       "0x1234567890123456789012345678901234567890"
//     );
//   });

//   describe("Creating Events", function () {
//     let eventHub: EventHub;

//     beforeEach(async function () {
//       ({ eventHub } = await loadFixture(deployEventHubFixture));
//     });

//     it("should create events", async function () {
//       const title = "My First Event";
//       const description = "This is a description of my first event.";
//       const date = Math.floor(Date.now() / 1000) + 3600;
//       const tokenRequirement = ethers.parseUnits("10", 18);
//       const attendeeLimit = 100;

//       const tx = await eventHub.createEvent(
//         title,
//         description,
//         date,
//         tokenRequirement,
//         attendeeLimit
//       );
//       await tx.wait();

//       const event = await eventHub.getAnEvent(0);
//       expect(event.title).to.equal(title);
//       expect(event.description).to.equal(description);
//       expect(event.date).to.be.greaterThan(Math.floor(Date.now() / 1000));
//       expect(event.tokenRequirement).to.equal(tokenRequirement);
//       expect(event.attendeeLimit).to.equal(attendeeLimit);
//       expect(event.attendeeCount).to.equal(0);
//       expect(event.isActive).to.be.true;

//       await expect(tx)
//         .to.emit(eventHub, "EventCreated")
//         .withArgs(title, event.date);
//     });

//     it("should not allow non-owners to create events", async function () {
//       const [, user] = await ethers.getSigners();
//       const title = "Unauthorized Event";
//       const description = "This event should not be created.";
//       const date = Math.floor(Date.now() / 1000) + 3600;
//       const tokenRequirement = ethers.parseUnits("10", 18);
//       const attendeeLimit = 100;

//       await expect(
//         eventHub
//           .connect(user)
//           .createEvent(
//             title,
//             description,
//             date,
//             tokenRequirement,
//             attendeeLimit
//           )
//       ).to.be.revertedWith("Only owner can access");
//     });

//     it("should return all created events", async function () {
//       const title1 = "Event One";
//       const description1 = "Description for event one.";
//       const date1 = Math.floor(Date.now() / 1000) + 3600;
//       const tokenRequirement1 = ethers.parseUnits("5", 18);
//       const attendeeLimit1 = 50;

//       const title2 = "Event Two";
//       const description2 = "Description for event two.";
//       const date2 = Math.floor(Date.now() / 1000) + 7200;
//       const tokenRequirement2 = ethers.parseUnits("15", 18);
//       const attendeeLimit2 = 100;

//       await eventHub.createEvent(
//         title1,
//         description1,
//         date1,
//         tokenRequirement1,
//         attendeeLimit1
//       );
//       await eventHub.createEvent(
//         title2,
//         description2,
//         date2,
//         tokenRequirement2,
//         attendeeLimit2
//       );

//       const allEvents = await eventHub.getAllEvents();
//       expect(allEvents.length).to.equal(2);
//       expect(allEvents[0].title).to.equal(title1);
//       expect(allEvents[1].title).to.equal(title2);
//     });
//   });

//   describe("Joining Events", function () {
//     let eventHub: EventHub;

//     beforeEach(async function () {
//       ({ eventHub } = await loadFixture(deployEventHubFixture));
//       await eventHub.createEvent(
//         "Test Event",
//         "Description",
//         Math.floor(Date.now() / 1000) + 3600,
//         ethers.parseUnits("10", 18),
//         2
//       );
//     });

//     it("should allow users to join an event", async function () {
//       const [_, user] = await ethers.getSigners();
//       await expect(eventHub.connect(user).joinEvent(0))
//         .to.emit(eventHub, "EventJoined")
//         .withArgs(user.address, 0);

//       const event = await eventHub.getAnEvent(0);
//       expect(event.attendeeCount).to.equal(1);
//       expect(event.attendees[0]).to.equal(user.address);
//     });
//   });

//   describe("Cancelling Events", function () {
//     let eventHub: EventHub;

//     beforeEach(async function () {
//       ({ eventHub } = await loadFixture(deployEventHubFixture));
//       await eventHub.createEvent(
//         "Test Event",
//         "Description",
//         Math.floor(Date.now() / 1000) + 3600,
//         ethers.parseUnits("10", 18),
//         2
//       );
//     });

//     it("should allow owner to cancel an event", async function () {
//       await eventHub.cancelEvent(0);
//       const event = await eventHub.getAnEvent(0);
//       expect(event.isActive).to.be.false;
//     });
//   });

//   describe("Purchasing Tokens", function () {
//     let eventHub: EventHub;
//     let usdtToken: UsdtToken;
//     let eventHubToken: EventHubToken;
//     let eVHTokenPurchase: TokenPurchase;
//     let user: any;

//     beforeEach(async function () {
//       const { eventHub: hub } = await loadFixture(deployEventHubFixture);
//       eventHub = hub;

//       usdtToken = await ethers.getContractAt(
//         "UsdtToken",
//         "0xf194F2F704741f82DFEc43D69BB81cA087A62485"
//       );
//       eventHubToken = await ethers.getContractAt(
//         "EventHubToken",
//         await eventHub.eventHubToken()
//       );
//       eVHTokenPurchase = await ethers.getContractAt(
//         "TokenPurchase",
//         "0x1234567890123456789012345678901234567890"
//       );

//       [, user] = await ethers.getSigners();
//     });

//     it("should allow user to mint USDT and swap for EventHubToken", async function () {
//       const usdtAmount = ethers.parseUnits("100", 18);

//       await usdtToken.mint(user.address, usdtAmount);

//       const userUsdtBalance = await usdtToken.balanceOf(user.address);
//       expect(userUsdtBalance).to.equal(usdtAmount);

//       await usdtToken
//         .connect(user)
//         .approve(eVHTokenPurchase.target, usdtAmount);

//       await eVHTokenPurchase
//         .connect(user)
//         .swapUsdtToEVH(user.address, usdtAmount);

//       const evhTokenBalance = await eventHubToken.balanceOf(user.address);
//       expect(evhTokenBalance).to.be.greaterThan(0);

//       await expect(
//         eVHTokenPurchase.connect(user).swapUsdtToEVH(user.address, usdtAmount)
//       )
//         .to.emit(eVHTokenPurchase, "SwapSuccessful")
//         .withArgs(user.address, eVHTokenPurchase.target, usdtAmount);
//     });
//   });
// });



import {
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect, should } from "chai";
import { ethers } from "hardhat";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ethers";



  
describe("EventHub_Contract", function () {

  

  async function deployContractsFixture() {
  
    const event = {
      title: "Demo Event",
      desc: "This is a demo event",
      date: 3600,
      tokenRequirement:  ethers.parseUnits("1000", 18),
      attendeeLimit: 2
      
    }


    const proposal = {
      name: "EventHub-Proposal",
      desc: "This is a proposal",
      quorum: 2
    }




    const [owner, otherAccount] = await ethers.getSigners(); // Get signers

    const EventProposal = await ethers.getContractFactory("EventProposal")
    const eventProposal = await EventProposal.deploy();

    const  EventHubToken = await ethers.getContractFactory("EventHubToken");
    const   eventHubToken =  await EventHubToken.deploy(owner.address);


    const Usdt = await ethers.getContractFactory("UsdtToken");
    const usdtToken = await Usdt.deploy(owner.address)


    const EVHTokenPurchase = await ethers.getContractFactory("TokenPurchase");
    const evhTokenPurchase = await EVHTokenPurchase.connect(owner).deploy(eventHubToken.getAddress(), usdtToken.getAddress());


    const  EventHub = await ethers.getContractFactory("EventHub");
    const eventHub = await EventHub.connect(owner).deploy(eventHubToken.getAddress(), eventProposal.getAddress(), evhTokenPurchase.getAddress())


    return {eventHub, usdtToken, eventHubToken, evhTokenPurchase, eventProposal, event, proposal,  owner, otherAccount};
  }
  
  describe('Deploy', () => {
    it("Should deploy all the contracts correctly", async function name() {

      const {eventHub, usdtToken, eventHubToken,} =  await loadFixture(deployContractsFixture);

      expect( await eventHub.getAddress()).to.be.properAddress;
      expect( await usdtToken.getAddress()).to.be.properAddress;
      expect( await eventHubToken.getAddress()).to.be.properAddress;
      
    });


    
  });

  describe('Functions', () => {

    describe("createEvent", () => {
      it("Only owner should be able to create event", async () => {

        const {eventHub, event, otherAccount} = await loadFixture(deployContractsFixture)

        await expect(eventHub.connect(otherAccount)
        .createEvent(event.title, event.desc, event.date, event.tokenRequirement, event.attendeeLimit)).to.be.reverted
        
      });

      it("If it is owner, the event should be created successfully", async () => {

        const {eventHub, event, owner} = await loadFixture(deployContractsFixture)

        expect( await eventHub.connect(owner)
        .createEvent(event.title, event.desc, event.date, event.tokenRequirement, event.attendeeLimit)).to.emit(eventHub, "EventCreated").withArgs(event.title, event.date)
         
      })




    });

    describe("purchaseEVHToken",  () => {

      it("Should mint usdt token  to the other account and EVHtoken to tokenPurchase contract so as to have enough balance ", async () => {

      const {evhTokenPurchase, usdtToken, eventHubToken, owner, otherAccount} =  await loadFixture(deployContractsFixture);


        //mint usdt to user account

      const txreceipt =   await usdtToken.connect(owner).mint(otherAccount.address, ethers.parseUnits("100000000000", 18));

      txreceipt.wait()

      expect(txreceipt).not.undefined


      //mint evhtoken to purchase token contract


      const txreceipt2 =   await eventHubToken.connect(owner).mint(evhTokenPurchase.getAddress(), ethers.parseUnits("1000000000000000000", 18));

      txreceipt2.wait()

      expect(txreceipt2).not.undefined

        
      })

      it("Should be able to purchase EVHToken", async () => {

      const {eventHub, evhTokenPurchase, usdtToken, eventHubToken, owner, otherAccount} =  await loadFixture(deployContractsFixture);


        //mint usdt to user account

      const txreceipt =   await usdtToken.connect(owner).mint(otherAccount.address, ethers.parseUnits("100000000000", 18));

      txreceipt.wait();

      expect(txreceipt).not.undefined;


      //mint evhtoken to purchase token contract


      const txreceipt2 =   await eventHubToken.connect(owner).mint(evhTokenPurchase.getAddress(), ethers.parseUnits("1000000000000000000", 18));

      txreceipt2.wait();

      expect(txreceipt2).not.undefined;


      const ApprovedAmount = ethers.parseUnits("1000000", 18)
      const AmountUsdtToExchangeForEVHToken = ethers.parseUnits("100", 18)
      await usdtToken.connect(otherAccount).approve(evhTokenPurchase.getAddress(), ApprovedAmount)

      expect(await eventHub.connect(otherAccount).purchaseEVHToken(AmountUsdtToExchangeForEVHToken))
      .to.emit(eventHub, "TokensPurchased").withArgs(AmountUsdtToExchangeForEVHToken)

        
      })
      
    });

    describe("joinEvent",  () => {

      it("Should not be able to join event if there is no enough EVHToken balance ", async () => {

      const { eventHub, event, owner, otherAccount} =  await loadFixture(deployContractsFixture);

      await eventHub.connect(owner)
      .createEvent(event.title, event.desc, event.date, event.tokenRequirement, event.attendeeLimit);

      const eventIndex = 0

      await expect( eventHub.connect(otherAccount).joinEvent(eventIndex)).to.be.revertedWith("Insufficient token balance")

        
      });

      it("if the user has EVHToken balance, should be able to join valid event  ", async () => {

      const { eventHub, event, evhTokenPurchase, usdtToken, eventHubToken, owner, otherAccount} =  await loadFixture(deployContractsFixture);


      //owner  create event

      await eventHub.connect(owner)

      .createEvent(event.title, event.desc, event.date, event.tokenRequirement, event.attendeeLimit);


      //mint usdt to user account

      const txreceipt =   await usdtToken.connect(owner).mint(otherAccount.address, ethers.parseUnits("100000000000", 18));

      txreceipt.wait();

      expect(txreceipt).not.undefined;


      //mint evhtoken to purchase token contract


      const txreceipt2 =   await eventHubToken.connect(owner).mint(evhTokenPurchase.getAddress(), ethers.parseUnits("1000000000000000000", 18));

      txreceipt2.wait();

      expect(txreceipt2).not.undefined;


      const ApprovedAmount = ethers.parseUnits("1000000", 18)
      const AmountUsdtToExchangeForEVHToken = ethers.parseUnits("100", 18)
      await usdtToken.connect(otherAccount).approve(evhTokenPurchase.getAddress(), ApprovedAmount)

      expect(await eventHub.connect(otherAccount).purchaseEVHToken(AmountUsdtToExchangeForEVHToken))
      .to.emit(eventHub, "TokensPurchased").withArgs(AmountUsdtToExchangeForEVHToken)



      //user join event

      const eventIndex = 0


      expect( await eventHub.connect(otherAccount).joinEvent(eventIndex)).to.emit(eventHub, "EventJoined").withArgs(otherAccount.address, eventIndex)

        
      })


      
    })


    describe("createEventHubProposal",  () => {

      it("Any user should able to create proposal based on any Changes in EventHub ", async () => {

      const {eventHub, eventProposal, proposal, otherAccount} =  await loadFixture(deployContractsFixture);


      expect(await eventHub.connect(otherAccount)
      .createEventHubProposal(proposal.name, proposal.desc, proposal.quorum)).to.emit(eventProposal, "ProposalCreated").withArgs(proposal.name, proposal.quorum);

        
      });

    });

    describe("voteOnEventProposal",  () => {

      it("Should be able to vote on valid  proposal", async () => {

      const {eventHub, eventProposal, proposal, usdtToken, eventHubToken, evhTokenPurchase, owner, otherAccount} =  await loadFixture(deployContractsFixture);

      
      //mint usdt to user account

      const txreceipt =   await usdtToken.connect(owner).mint(otherAccount.address, ethers.parseUnits("100000000000", 18));

      txreceipt.wait();

      expect(txreceipt).not.undefined;


      //mint evhtoken to purchase token contract


      const txreceipt2 =   await eventHubToken.connect(owner).mint(evhTokenPurchase.getAddress(), ethers.parseUnits("1000000000000000000", 18));

      txreceipt2.wait();

      expect(txreceipt2).not.undefined;


      const ApprovedAmount = ethers.parseUnits("1000000", 18)
      const AmountUsdtToExchangeForEVHToken = ethers.parseUnits("100", 18)
      await usdtToken.connect(otherAccount).approve(evhTokenPurchase.getAddress(), ApprovedAmount)

      expect(await eventHub.connect(otherAccount).purchaseEVHToken(AmountUsdtToExchangeForEVHToken))
      .to.emit(eventHub, "TokensPurchased").withArgs(AmountUsdtToExchangeForEVHToken)



      //create proposal

      const proposalInvex = 0

      const proposalCount = 1


      expect(await eventHub.connect(otherAccount)
      .createEventHubProposal(proposal.name, proposal.desc, proposal.quorum)).to.emit(eventProposal, "ProposalCreated").withArgs(proposal.name, proposal.quorum);


      
      //vote on proposal

      expect(await eventHub.connect(otherAccount)
      .voteOnEventProposal(proposalInvex)).to.emit(eventProposal, "ProposalActive").withArgs(proposal.name, proposalCount );

        
      });
      
    });


    describe("getAnEventProposal",  () => {

      it("Should be able to get a proposal by index", async () => {

      const {eventHub, eventProposal, proposal, usdtToken, eventHubToken, evhTokenPurchase, owner, otherAccount} =  await loadFixture(deployContractsFixture);

      //create proposal

      const proposalInvex = 0


      expect(await eventHub.connect(otherAccount)
      .createEventHubProposal(proposal.name, proposal.desc, proposal.quorum)).to.emit(eventProposal, "ProposalCreated").withArgs(proposal.name, proposal.quorum);


      //getAProposal

      expect( await eventProposal.connect(otherAccount).getAProposal(proposalInvex)).not.undefined
        
      });
      
    })

    describe("getAllEventProposals",  () => {

      it("Owner should be able to get all the proposals for EventHub ", async () => {

      const {eventHub, eventProposal, proposal, usdtToken, eventHubToken, evhTokenPurchase, owner, otherAccount} =  await loadFixture(deployContractsFixture);

      //create proposal



      expect(await eventHub.connect(owner)
      .createEventHubProposal(proposal.name, proposal.desc, proposal.quorum)).to.emit(eventProposal, "ProposalCreated").withArgs(proposal.name, proposal.quorum);


      //getAProposal

      const propArraylength = 1

      expect( (await eventProposal.connect(otherAccount).getAllProposals()).length).to.equal(propArraylength)
        
      });
      
    });


    describe("cancelEvent",  () => {

      it("Owner should be able to cancel any scheduled event  ", async () => {

      const {eventHub, event, owner, otherAccount} =  await loadFixture(deployContractsFixture);

      //create event



      expect( await eventHub.connect(owner)
        .createEvent(event.title, event.desc, event.date, event.tokenRequirement, event.attendeeLimit)).to.emit(eventHub, "EventCreated").withArgs(event.title, event.date)
         
      //cancel event


      const eventIndex = 0


      expect( (await eventHub.connect(owner).cancelEvent(eventIndex))).to.emit(eventHub, "EventCancelled").withArgs(eventIndex);
        
      });
      
    })
    describe("getAnEvent",  () => {

      it("User should be able to get an event  ", async () => {

      const {eventHub, event, owner, otherAccount} =  await loadFixture(deployContractsFixture);

      //create event



      expect( await eventHub.connect(owner)
        .createEvent(event.title, event.desc, event.date, event.tokenRequirement, event.attendeeLimit)).to.emit(eventHub, "EventCreated").withArgs(event.title, event.date)
         
      //cancel event


      const eventIndex = 0;

      expect( (await eventHub.connect(otherAccount).getAnEvent(eventIndex))).to.not.equal(undefined)
        
      });
      
    })
    
    describe("getAllEvents",  () => {

      it("User should be able to get all events  ", async () => {

      const {eventHub, event, owner, otherAccount} =  await loadFixture(deployContractsFixture);

      //create event



      expect( await eventHub.connect(owner)
        .createEvent(event.title, event.desc, event.date, event.tokenRequirement, event.attendeeLimit)).to.emit(eventHub, "EventCreated").withArgs(event.title, event.date)
         
      //cancel event



      expect( (await eventHub.connect(otherAccount).getAllEvents()).length).to.equal(1);
        
      });
      
    })
    
    
    
  })
  

});

