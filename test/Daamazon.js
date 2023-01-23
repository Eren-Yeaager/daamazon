const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

describe("Daamazon", () => {
  let daamazon;
  let deployer, buyer;
  beforeEach(async () => {
    [deployer, buyer] = await ethers.getSigners();
    // console.log(deployer.address, buyer.address);

    const Daamazon = await ethers.getContractFactory("Daamazon");
    daamazon = await Daamazon.deploy();
  });

  describe("Deployment", () => {
    it("Sets the owner", async () => {
      expect(await daamazon.owner()).to.equal(deployer.address);
    });
  });
});
