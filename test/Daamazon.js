const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};
const ID = 1;
const NAME = "Shoes";
const CATEGORY = "Clothing";
const IMAGE =
  "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/shoes.jpg";
const COST = tokens(1);
const RATING = 4;
const STOCK = 5;

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
    describe("Listing", () => {
      let transaction;

      beforeEach(async () => {
        transaction = await daamazon
          .connect(deployer)
          .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
        await transaction.wait();
      });
      it("returns item attributes", async () => {
        const item = await daamazon.items(ID);
        expect(item.id).to.equal(1);
        expect(item.name).to.equal(NAME);
        expect(item.category).to.equal(CATEGORY);
        expect(item.image).to.equal(IMAGE);
        expect(item.cost).to.equal(COST);
        expect(item.rating).to.equal(RATING);
        expect(item.stock).to.equal(STOCK);
      });
      it("Emits List event", () => {
        expect(transaction).to.emit(daamazon, "List");
      });
    });
    describe("Buying", () => {
      beforeEach(async () => {
        transaction = await daamazon
          .connect(deployer)
          .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
        await transaction.wait();

        transaction = await daamazon.connect(buyer).buy(ID, { value: COST });
      });
      it("Updates the contract balance", async () => {
        const result = await ethers.provider.getBalance(daamazon.address);
        expect(result).to.equal(COST);
      });
      it("Updates buyer's order count", async () => {
        const result = await daamazon.orderCount(buyer.address);
        expect(result).to.equal(1);

        it("Adds the order", async () => {
          const order = await daamazon.orders(buyer.address, 1);
          expect(order.time).to.be.greaterThan(0);
          expect(order.item.name).to.equal(NAME);
        });
        it("Updates the contract balance", async () => {
          const result = await ethers.provider.getBalance(daamazon.address);
          expect(result).to.equal(COST);
        });
        it("Emits Buy event", () => {
          expect(transaction).to.emit(daamazon, "Buy");
        });
      });
    });
    describe("Withdrawing", () => {
      let balanceBefore;
      beforeEach(async () => {
        let transaction = await daamazon
          .connect(deployer)
          .list(ID, NAME, CATEGORY, IMAGE, COST, RATING, STOCK);
        await transaction.wait();
        transaction = await daamazon.connect(buyer).buy(ID, { value: COST });
        balanceBefore = await ethers.provider.getBalance(deployer.address);
        transaction = await daamazon.connect(deployer).withdraw();
        await transaction.wait();
      });
      it("Updates the owner balance", async () => {
        const balanceAfter = await ethers.provider.getBalance(deployer.address);
        expect(balanceAfter).to.be.greaterThan(balanceBefore);
      });
      it("Updates the contract balance", async () => {
        const result = await ethers.provider.getBalance(daamazon.address);
        expect(result).to.equal(0);
      });
    });
  });
});
