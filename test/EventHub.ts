import { expect } from "chai";
import { ethers } from "hardhat";
import { EventHub } from "../typechain-types/contracts/EventHub";
import { EventHubToken } from "../typechain-types/contracts/EventHubToken";
import { UsdtToken } from "../typechain-types/contracts/Usdt.sol/UsdtToken";
import { TokenPurchase } from "../typechain-types/contracts/EVHTokenPurchase.sol/TokenPurchase";
import { loadFixture } from "@nomicfoundation/hardhat-network-helpers";

describe("EventHub Contract", function () {
  async function deployEventHubFixture() {
    const [owner] = await ethers.getSigners();

    const EventHubFactory = await ethers.getContractFactory("EventHub");
    const eventHub: EventHub = (await EventHubFactory.deploy(
      "0x8bC6243ffa18Ca635Cdc8f635DbeF090dA748c92", // eventHubToken
      "0x1234567890123456789012345678901234567890", // eventProposal
      "0x1234567890123456789012345678901234567890" // eVHTokenPurchase
    )) as EventHub;

    return { eventHub, owner };
  }

  it("Should deploy the contract and initialize correctly", async function () {
    const { eventHub, owner } = await loadFixture(deployEventHubFixture);

    expect(await eventHub.owner()).to.equal(owner.address);
    expect(await eventHub.eventHubToken()).to.equal(
      "0x8bC6243ffa18Ca635Cdc8f635DbeF090dA748c92"
    );
    expect(await eventHub.eventProposal()).to.equal(
      "0x1234567890123456789012345678901234567890"
    );
    expect(await eventHub.eVHTokenPurchase()).to.equal(
      "0x1234567890123456789012345678901234567890"
    );
  });

  describe("Creating Events", function () {
    let eventHub: EventHub;

    beforeEach(async function () {
      ({ eventHub } = await loadFixture(deployEventHubFixture));
    });

    it("should create events", async function () {
      const title = "My First Event";
      const description = "This is a description of my first event.";
      const date = Math.floor(Date.now() / 1000) + 3600;
      const tokenRequirement = ethers.parseUnits("10", 18);
      const attendeeLimit = 100;

      const tx = await eventHub.createEvent(
        title,
        description,
        date,
        tokenRequirement,
        attendeeLimit
      );
      await tx.wait();

      const event = await eventHub.getAnEvent(0);
      expect(event.title).to.equal(title);
      expect(event.description).to.equal(description);
      expect(event.date).to.be.greaterThan(Math.floor(Date.now() / 1000));
      expect(event.tokenRequirement).to.equal(tokenRequirement);
      expect(event.attendeeLimit).to.equal(attendeeLimit);
      expect(event.attendeeCount).to.equal(0);
      expect(event.isActive).to.be.true;

      await expect(tx)
        .to.emit(eventHub, "EventCreated")
        .withArgs(title, event.date);
    });

    it("should not allow non-owners to create events", async function () {
      const [, user] = await ethers.getSigners();
      const title = "Unauthorized Event";
      const description = "This event should not be created.";
      const date = Math.floor(Date.now() / 1000) + 3600;
      const tokenRequirement = ethers.parseUnits("10", 18);
      const attendeeLimit = 100;

      await expect(
        eventHub
          .connect(user)
          .createEvent(
            title,
            description,
            date,
            tokenRequirement,
            attendeeLimit
          )
      ).to.be.revertedWith("Only owner can access");
    });

    it("should return all created events", async function () {
      const title1 = "Event One";
      const description1 = "Description for event one.";
      const date1 = Math.floor(Date.now() / 1000) + 3600;
      const tokenRequirement1 = ethers.parseUnits("5", 18);
      const attendeeLimit1 = 50;

      const title2 = "Event Two";
      const description2 = "Description for event two.";
      const date2 = Math.floor(Date.now() / 1000) + 7200;
      const tokenRequirement2 = ethers.parseUnits("15", 18);
      const attendeeLimit2 = 100;

      await eventHub.createEvent(
        title1,
        description1,
        date1,
        tokenRequirement1,
        attendeeLimit1
      );
      await eventHub.createEvent(
        title2,
        description2,
        date2,
        tokenRequirement2,
        attendeeLimit2
      );

      const allEvents = await eventHub.getAllEvents();
      expect(allEvents.length).to.equal(2);
      expect(allEvents[0].title).to.equal(title1);
      expect(allEvents[1].title).to.equal(title2);
    });
  });

  describe("Joining Events", function () {
    let eventHub: EventHub;

    beforeEach(async function () {
      ({ eventHub } = await loadFixture(deployEventHubFixture));
      await eventHub.createEvent(
        "Test Event",
        "Description",
        Math.floor(Date.now() / 1000) + 3600,
        ethers.parseUnits("10", 18),
        2
      );
    });

    it("should allow users to join an event", async function () {
      const [_, user] = await ethers.getSigners();
      await expect(eventHub.connect(user).joinEvent(0))
        .to.emit(eventHub, "EventJoined")
        .withArgs(user.address, 0);

      const event = await eventHub.getAnEvent(0);
      expect(event.attendeeCount).to.equal(1);
      expect(event.attendees[0]).to.equal(user.address);
    });
  });

  describe("Cancelling Events", function () {
    let eventHub: EventHub;

    beforeEach(async function () {
      ({ eventHub } = await loadFixture(deployEventHubFixture));
      await eventHub.createEvent(
        "Test Event",
        "Description",
        Math.floor(Date.now() / 1000) + 3600,
        ethers.parseUnits("10", 18),
        2
      );
    });

    it("should allow owner to cancel an event", async function () {
      await eventHub.cancelEvent(0);
      const event = await eventHub.getAnEvent(0);
      expect(event.isActive).to.be.false;
    });
  });

  describe("Purchasing Tokens", function () {
    let eventHub: EventHub;
    let usdtToken: UsdtToken;
    let eventHubToken: EventHubToken;
    let eVHTokenPurchase: TokenPurchase;
    let user: any;

    beforeEach(async function () {
      const { eventHub: hub } = await loadFixture(deployEventHubFixture);
      eventHub = hub;

      usdtToken = await ethers.getContractAt(
        "UsdtToken",
        "0xf194F2F704741f82DFEc43D69BB81cA087A62485"
      );
      eventHubToken = await ethers.getContractAt(
        "EventHubToken",
        await eventHub.eventHubToken()
      );
      eVHTokenPurchase = await ethers.getContractAt(
        "TokenPurchase",
        "0x1234567890123456789012345678901234567890"
      );

      [, user] = await ethers.getSigners();
    });

    it("should allow user to mint USDT and swap for EventHubToken", async function () {
      const usdtAmount = ethers.parseUnits("100", 18);

      await usdtToken.mint(user.address, usdtAmount);

      const userUsdtBalance = await usdtToken.balanceOf(user.address);
      expect(userUsdtBalance).to.equal(usdtAmount);

      await usdtToken
        .connect(user)
        .approve(eVHTokenPurchase.target, usdtAmount);

      await eVHTokenPurchase
        .connect(user)
        .swapUsdtToEVH(user.address, usdtAmount);

      const evhTokenBalance = await eventHubToken.balanceOf(user.address);
      expect(evhTokenBalance).to.be.greaterThan(0);

      await expect(
        eVHTokenPurchase.connect(user).swapUsdtToEVH(user.address, usdtAmount)
      )
        .to.emit(eVHTokenPurchase, "SwapSuccessful")
        .withArgs(user.address, eVHTokenPurchase.target, usdtAmount);
    });
  });
});
