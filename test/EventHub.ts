import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
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
      tokenRequirement: ethers.parseUnits("1000", 18),
      attendeeLimit: 2,
    };

    const proposal = {
      name: "EventHub-Proposal",
      desc: "This is a proposal",
      quorum: 2,
    };

    const [owner, otherAccount] = await ethers.getSigners(); // Get signers

    const EventProposal = await ethers.getContractFactory("EventProposal");
    const eventProposal = await EventProposal.deploy();

    const EventHubToken = await ethers.getContractFactory("EventHubToken");
    const eventHubToken = await EventHubToken.deploy(owner.address);

    const Usdt = await ethers.getContractFactory("UsdtToken");
    const usdtToken = await Usdt.deploy(owner.address);

    const EVHTokenPurchase = await ethers.getContractFactory("TokenPurchase");
    const evhTokenPurchase = await EVHTokenPurchase.connect(owner).deploy(
      eventHubToken.getAddress(),
      usdtToken.getAddress()
    );

    const EventHub = await ethers.getContractFactory("EventHub");
    const eventHub = await EventHub.connect(owner).deploy(
      eventHubToken.getAddress(),
      eventProposal.getAddress(),
      evhTokenPurchase.getAddress()
    );

    return {
      eventHub,
      usdtToken,
      eventHubToken,
      evhTokenPurchase,
      eventProposal,
      event,
      proposal,
      owner,
      otherAccount,
    };
  }

  describe("Deploy", () => {
    it("Should deploy all the contracts correctly", async function name() {
      const { eventHub, usdtToken, eventHubToken } = await loadFixture(
        deployContractsFixture
      );

      expect(await eventHub.getAddress()).to.be.properAddress;
      expect(await usdtToken.getAddress()).to.be.properAddress;
      expect(await eventHubToken.getAddress()).to.be.properAddress;
    });
  });

  describe("Functions", () => {
    describe("createEvent", () => {
      it("Only owner should be able to create event", async () => {
        const { eventHub, event, otherAccount } = await loadFixture(
          deployContractsFixture
        );

        await expect(
          eventHub
            .connect(otherAccount)
            .createEvent(
              event.title,
              event.desc,
              event.date,
              event.tokenRequirement,
              event.attendeeLimit
            )
        ).to.be.reverted;
      });

      it("If it is owner, the event should be created successfully", async () => {
        const { eventHub, event, owner } = await loadFixture(
          deployContractsFixture
        );

        expect(
          await eventHub
            .connect(owner)
            .createEvent(
              event.title,
              event.desc,
              event.date,
              event.tokenRequirement,
              event.attendeeLimit
            )
        )
          .to.emit(eventHub, "EventCreated")
          .withArgs(event.title, event.date);
      });
    });

    describe("purchaseEVHToken", () => {
      it("Should mint usdt token  to the other account and EVHtoken to tokenPurchase contract so as to have enough balance ", async () => {
        const {
          evhTokenPurchase,
          usdtToken,
          eventHubToken,
          owner,
          otherAccount,
        } = await loadFixture(deployContractsFixture);

        //mint usdt to user account

        const txreceipt = await usdtToken
          .connect(owner)
          .mint(otherAccount.address, ethers.parseUnits("100000000000", 18));

        txreceipt.wait();

        expect(txreceipt).not.undefined;

        //mint evhtoken to purchase token contract

        const txreceipt2 = await eventHubToken
          .connect(owner)
          .mint(
            evhTokenPurchase.getAddress(),
            ethers.parseUnits("1000000000000000000", 18)
          );

        txreceipt2.wait();

        expect(txreceipt2).not.undefined;
      });

      it("Should be able to purchase EVHToken", async () => {
        const {
          eventHub,
          evhTokenPurchase,
          usdtToken,
          eventHubToken,
          owner,
          otherAccount,
        } = await loadFixture(deployContractsFixture);

        //mint usdt to user account

        const txreceipt = await usdtToken
          .connect(owner)
          .mint(otherAccount.address, ethers.parseUnits("100000000000", 18));

        txreceipt.wait();

        expect(txreceipt).not.undefined;

        //mint evhtoken to purchase token contract

        const txreceipt2 = await eventHubToken
          .connect(owner)
          .mint(
            evhTokenPurchase.getAddress(),
            ethers.parseUnits("1000000000000000000", 18)
          );

        txreceipt2.wait();

        expect(txreceipt2).not.undefined;

        const ApprovedAmount = ethers.parseUnits("1000000", 18);
        const AmountUsdtToExchangeForEVHToken = ethers.parseUnits("100", 18);
        await usdtToken
          .connect(otherAccount)
          .approve(evhTokenPurchase.getAddress(), ApprovedAmount);

        expect(
          await eventHub
            .connect(otherAccount)
            .purchaseEVHToken(AmountUsdtToExchangeForEVHToken)
        )
          .to.emit(eventHub, "TokensPurchased")
          .withArgs(AmountUsdtToExchangeForEVHToken);
      });
    });

    describe("joinEvent", () => {
      it("Should not be able to join event if there is no enough EVHToken balance ", async () => {
        const { eventHub, event, owner, otherAccount } = await loadFixture(
          deployContractsFixture
        );

        await eventHub
          .connect(owner)
          .createEvent(
            event.title,
            event.desc,
            event.date,
            event.tokenRequirement,
            event.attendeeLimit
          );

        const eventIndex = 0;

        await expect(
          eventHub.connect(otherAccount).joinEvent(eventIndex)
        ).to.be.revertedWith("Insufficient token balance");
      });

      it("if the user has EVHToken balance, should be able to join valid event  ", async () => {
        const {
          eventHub,
          event,
          evhTokenPurchase,
          usdtToken,
          eventHubToken,
          owner,
          otherAccount,
        } = await loadFixture(deployContractsFixture);

        //owner  create event

        await eventHub
          .connect(owner)

          .createEvent(
            event.title,
            event.desc,
            event.date,
            event.tokenRequirement,
            event.attendeeLimit
          );

        //mint usdt to user account

        const txreceipt = await usdtToken
          .connect(owner)
          .mint(otherAccount.address, ethers.parseUnits("100000000000", 18));

        txreceipt.wait();

        expect(txreceipt).not.undefined;

        //mint evhtoken to purchase token contract

        const txreceipt2 = await eventHubToken
          .connect(owner)
          .mint(
            evhTokenPurchase.getAddress(),
            ethers.parseUnits("1000000000000000000", 18)
          );

        txreceipt2.wait();

        expect(txreceipt2).not.undefined;

        const ApprovedAmount = ethers.parseUnits("1000000", 18);
        const AmountUsdtToExchangeForEVHToken = ethers.parseUnits("100", 18);
        await usdtToken
          .connect(otherAccount)
          .approve(evhTokenPurchase.getAddress(), ApprovedAmount);

        expect(
          await eventHub
            .connect(otherAccount)
            .purchaseEVHToken(AmountUsdtToExchangeForEVHToken)
        )
          .to.emit(eventHub, "TokensPurchased")
          .withArgs(AmountUsdtToExchangeForEVHToken);

        //user join event

        const eventIndex = 0;

        expect(await eventHub.connect(otherAccount).joinEvent(eventIndex))
          .to.emit(eventHub, "EventJoined")
          .withArgs(otherAccount.address, eventIndex);
      });
    });

    describe("createEventHubProposal", () => {
      it("Any user should able to create proposal based on any Changes in EventHub ", async () => {
        const { eventHub, eventProposal, proposal, otherAccount } =
          await loadFixture(deployContractsFixture);

        expect(
          await eventHub
            .connect(otherAccount)
            .createEventHubProposal(
              proposal.name,
              proposal.desc,
              proposal.quorum
            )
        )
          .to.emit(eventProposal, "ProposalCreated")
          .withArgs(proposal.name, proposal.quorum);
      });
    });

    describe("voteOnEventProposal", () => {
      it("Should be able to vote on valid  proposal", async () => {
        const {
          eventHub,
          eventProposal,
          proposal,
          usdtToken,
          eventHubToken,
          evhTokenPurchase,
          owner,
          otherAccount,
        } = await loadFixture(deployContractsFixture);

        //mint usdt to user account

        const txreceipt = await usdtToken
          .connect(owner)
          .mint(otherAccount.address, ethers.parseUnits("100000000000", 18));

        txreceipt.wait();

        expect(txreceipt).not.undefined;

        //mint evhtoken to purchase token contract

        const txreceipt2 = await eventHubToken
          .connect(owner)
          .mint(
            evhTokenPurchase.getAddress(),
            ethers.parseUnits("1000000000000000000", 18)
          );

        txreceipt2.wait();

        expect(txreceipt2).not.undefined;

        const ApprovedAmount = ethers.parseUnits("1000000", 18);
        const AmountUsdtToExchangeForEVHToken = ethers.parseUnits("100", 18);
        await usdtToken
          .connect(otherAccount)
          .approve(evhTokenPurchase.getAddress(), ApprovedAmount);

        expect(
          await eventHub
            .connect(otherAccount)
            .purchaseEVHToken(AmountUsdtToExchangeForEVHToken)
        )
          .to.emit(eventHub, "TokensPurchased")
          .withArgs(AmountUsdtToExchangeForEVHToken);

        //create proposal

        const proposalInvex = 0;

        const proposalCount = 1;

        expect(
          await eventHub
            .connect(otherAccount)
            .createEventHubProposal(
              proposal.name,
              proposal.desc,
              proposal.quorum
            )
        )
          .to.emit(eventProposal, "ProposalCreated")
          .withArgs(proposal.name, proposal.quorum);

        //vote on proposal

        expect(
          await eventHub
            .connect(otherAccount)
            .voteOnEventProposal(proposalInvex)
        )
          .to.emit(eventProposal, "ProposalActive")
          .withArgs(proposal.name, proposalCount);
      });
    });

    describe("getAnEventProposal", () => {
      it("Should be able to get a proposal by index", async () => {
        const {
          eventHub,
          eventProposal,
          proposal,
          usdtToken,
          eventHubToken,
          evhTokenPurchase,
          owner,
          otherAccount,
        } = await loadFixture(deployContractsFixture);

        //create proposal

        const proposalInvex = 0;

        expect(
          await eventHub
            .connect(otherAccount)
            .createEventHubProposal(
              proposal.name,
              proposal.desc,
              proposal.quorum
            )
        )
          .to.emit(eventProposal, "ProposalCreated")
          .withArgs(proposal.name, proposal.quorum);

        //getAProposal

        expect(
          await eventProposal.connect(otherAccount).getAProposal(proposalInvex)
        ).not.undefined;
      });
    });

    describe("getAllEventProposals", () => {
      it("Owner should be able to get all the proposals for EventHub ", async () => {
        const {
          eventHub,
          eventProposal,
          proposal,
          usdtToken,
          eventHubToken,
          evhTokenPurchase,
          owner,
          otherAccount,
        } = await loadFixture(deployContractsFixture);

        //create proposal

        expect(
          await eventHub
            .connect(owner)
            .createEventHubProposal(
              proposal.name,
              proposal.desc,
              proposal.quorum
            )
        )
          .to.emit(eventProposal, "ProposalCreated")
          .withArgs(proposal.name, proposal.quorum);

        //getAProposal

        const propArraylength = 1;

        expect(
          (await eventProposal.connect(otherAccount).getAllProposals()).length
        ).to.equal(propArraylength);
      });
    });

    describe("cancelEvent", () => {
      it("Owner should be able to cancel any scheduled event  ", async () => {
        const { eventHub, event, owner, otherAccount } = await loadFixture(
          deployContractsFixture
        );

        //create event

        expect(
          await eventHub
            .connect(owner)
            .createEvent(
              event.title,
              event.desc,
              event.date,
              event.tokenRequirement,
              event.attendeeLimit
            )
        )
          .to.emit(eventHub, "EventCreated")
          .withArgs(event.title, event.date);

        //cancel event

        const eventIndex = 0;

        expect(await eventHub.connect(owner).cancelEvent(eventIndex))
          .to.emit(eventHub, "EventCancelled")
          .withArgs(eventIndex);
      });
    });
    describe("getAnEvent", () => {
      it("User should be able to get an event  ", async () => {
        const { eventHub, event, owner, otherAccount } = await loadFixture(
          deployContractsFixture
        );

        //create event

        expect(
          await eventHub
            .connect(owner)
            .createEvent(
              event.title,
              event.desc,
              event.date,
              event.tokenRequirement,
              event.attendeeLimit
            )
        )
          .to.emit(eventHub, "EventCreated")
          .withArgs(event.title, event.date);

        //cancel event

        const eventIndex = 0;

        expect(
          await eventHub.connect(otherAccount).getAnEvent(eventIndex)
        ).to.not.equal(undefined);
      });
    });

    describe("getAllEvents", () => {
      it("User should be able to get all events  ", async () => {
        const { eventHub, event, owner, otherAccount } = await loadFixture(
          deployContractsFixture
        );

        //create event

        expect(
          await eventHub
            .connect(owner)
            .createEvent(
              event.title,
              event.desc,
              event.date,
              event.tokenRequirement,
              event.attendeeLimit
            )
        )
          .to.emit(eventHub, "EventCreated")
          .withArgs(event.title, event.date);

        //cancel event

        expect(
          (await eventHub.connect(otherAccount).getAllEvents()).length
        ).to.equal(1);
      });
    });
  });
});
