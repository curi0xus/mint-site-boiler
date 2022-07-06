const { expect } = require("chai");
const getUnixTime = require("date-fns/getUnixTime");
const add = require("date-fns/add");

describe("Token", function () {
  let NFTContract;
  let nft;
  let owner;
  let addr1;
  let addr2;
  let addr3;
  let uri = "https://google.com";
  const NAME = "FUCKERY";
  const SYMBOL = "FUCKS";
  const START_TIME = getUnixTime(
    add(new Date(), {
      minutes: 10,
    })
  );

  beforeEach(async function () {
    NFTContract = await ethers.getContractFactory("Token");
    [owner, addr1, addr2, addr3, ...addrs] = await ethers.getSigners();

    owner = owner;

    nft = await NFTContract.deploy(NAME, SYMBOL, uri, START_TIME);
  });

  describe("Deployment", function () {
    it("Should set the parameters", async function () {
      const baseUri = await nft.baseURI();
      const name = await nft.name();
      const symbol = await nft.symbol();
      const startTime = await nft.startTime();

      expect(baseUri).to.equal(uri);
      expect(name).to.equal(NAME);
      expect(symbol).to.equal(SYMBOL);
      expect(startTime).to.equal(START_TIME);
    });
  });

  describe("Minting", function () {
    it("Should not allow anyone to mint when sale has not started", async function () {
      try {
        nft.connect(addr1);
        await nft.mint();
        const balance = await nft.balanceOf(addr1.address);
        expect(balance).to.equal(0);
      } catch (e) {
        console.log("error", e.message);
        expect(e.message).to.equal(
          "Error: VM Exception while processing transaction: reverted with reason string 'Minting has not start'"
        );
      }
    });
    it("Should allow one wallet to mint once", async function () {
      // const block = await ethers.provider.getBlock("latest");
      // const blockTime = block.timestamp;
      // console.log("start time", START_TIME);
      // console.log("blockTime", blockTime);
      const blockChainTime = getUnixTime(
        add(new Date(), {
          minutes: 30,
        })
      );
      // console.log("new time", blockChainTime);
      await ethers.provider.send("evm_mine", [blockChainTime]);
      await nft.connect(addr1).mint();
      const balance = await nft.balanceOf(addr1.address);
      expect(balance).to.equal(1);
    });
    it("Should not allow one wallet to mint twice", async function () {
      await nft.connect(addr1).mint();
      try {
        await nft.connect(addr1).mint();
      } catch (e) {
        console.log("error", e.message);
        expect(e.message).to.equal(
          "Error: VM Exception while processing transaction: reverted with reason string 'You have already minted'"
        );
      }
      const balance = await nft.balanceOf(addr1.address);
      expect(balance).to.equal(1);
    });
  });

  describe("Ownership", function () {
    it("Should return owner public key", async function () {
      await nft.mint();
      const ownerAddress = await nft.ownerOf(0);
      expect(owner.address).to.equal(ownerAddress);
    });
  });

  describe("Pause", function () {
    it("Should not allow mint on pause", async function () {
      await nft.setPause(true);

      try {
        await nft.mint();
        const ownerAddress = await nft.ownerOf(0);
        expect(owner.address).to.equal(ownerAddress);
      } catch (e) {
        expect(e.message).to.equal(
          "Error: VM Exception while processing transaction: reverted with reason string 'Contract Paused'"
        );
      }
    });
    it("Should allow mint on unpause", async function () {
      await nft.setPause(true);
      await nft.setPause(false);
      await nft.mint();
      const ownerAddress = await nft.ownerOf(0);
      expect(owner.address).to.equal(ownerAddress);
    });
  });

  describe("Updates", function () {
    beforeEach(async () => {
      await nft.mint();
    });
    it("Should only allow owner to change base uri to be updated", async function () {
      const newUriValue = "https://yahoo.com";
      await nft.setBaseURI(newUriValue);
      const newUri = await nft.baseURI();
      expect(newUri).to.equal(newUriValue);
    });

    it("Should not allow non-owner to change base uri to be updated", async function () {
      const newUriValue = "https://yahoo.com";
      try {
        await nft.connect(addr1).setBaseURI(newUriValue);
      } catch (e) {
        expect(e.message).to.equal(
          "Error: VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        );
      }
    });

    it("Should only allow owner to change token uri to be updated", async function () {
      const newUriValue = "https://yahoo.com";
      await nft.setTokenURI(0, newUriValue);
      const newUri = await nft.tokenURI(0);
      expect(newUri).to.equal(uri + newUriValue);
    });

    it("Should not allow non-owner to change token uri to be updated", async function () {
      try {
        const newUriValue = "https://yahoo.com";
        await nft.connect(addr1).setTokenURI(0, newUriValue);
      } catch (e) {
        expect(e.message).to.equal(
          "Error: VM Exception while processing transaction: reverted with reason string 'Ownable: caller is not the owner'"
        );
      }
    });
  });
  describe("Contract wide Royalties", async () => {
    const ADDRESS_ZERO = ethers.constants.AddressZero;

    it("has no royalties if not set", async function () {
      await nft.connect(owner).mint();
      const info = await nft.royaltyInfo(0, 100);
      expect(info[1].toNumber()).to.be.equal(0);
      expect(info[0]).to.be.equal(ADDRESS_ZERO);
    });

    it("throws if royalties more than 100%", async function () {
      const tx = nft.setRoyalties(addr1.address, 10001);
      await expect(tx).to.be.revertedWith("ERC2981Royalties: Too high");
    });

    it("has the right royalties for tokenId", async function () {
      await nft.setRoyalties(addr1.address, 250);

      await nft.connect(owner).mint();

      const info = await nft.royaltyInfo(0, 10000);
      expect(info[1].toNumber()).to.be.equal(250);
      expect(info[0]).to.be.equal(addr1.address);
    });

    it("can set address(0) as royalties recipient", async function () {
      await nft.setRoyalties(ADDRESS_ZERO, 5000);

      await nft.connect(owner).mint();

      const info = await nft.royaltyInfo(0, 10000);
      expect(info[1].toNumber()).to.be.equal(5000);
      expect(info[0]).to.be.equal(ADDRESS_ZERO);
    });
  });
});
