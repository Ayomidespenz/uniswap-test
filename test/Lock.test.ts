import { expect } from "chai";
import { ethers } from "ethers";
import hre from "hardhat";

describe("Lock", function () {
  let lock: any;
  let owner: any;
  let otherAccount: any;
  const unlockTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  const lockedAmount = ethers.parseEther("1.0");

  beforeEach(async function () {
    // Get signers
    [owner, otherAccount] = await hre.ethers.getSigners();

    // Deploy the contract
    const Lock = await hre.ethers.getContractFactory("Lock");
    lock = await Lock.deploy(unlockTime, { value: lockedAmount });
  });

  it("Should set the right unlockTime", async function () {
    expect(await lock.unlockTime()).to.equal(unlockTime);
  });

  it("Should set the right owner", async function () {
    expect(await lock.owner()).to.equal(owner.address);
  });

  it("Should receive and store the funds to lock", async function () {
    expect(await hre.ethers.provider.getBalance(lock.address)).to.equal(lockedAmount);
  });

  it("Should fail if the unlockTime is not in the future", async function () {
    const pastTime = Math.floor(Date.now() / 1000) - 1000;
    const Lock = await hre.ethers.getContractFactory("Lock");
    await expect(Lock.deploy(pastTime, { value: 1 }))
      .to.be.revertedWith("Unlock time should be in the future");
  });

  it("Should not allow withdrawals before time is due", async function () {
    await expect(lock.withdraw())
      .to.be.revertedWith("You can't withdraw yet");
  });

  it("Should not allow non-owner to withdraw", async function () {
    await hre.network.provider.send("evm_increaseTime", ["0x" + (3600).toString(16)]);
    await hre.network.provider.send("evm_mine", []);
    
    await expect(lock.connect(otherAccount).withdraw())
      .to.be.revertedWith("Only owner can withdraw");
  });

  it("Should allow owner to withdraw after unlock time", async function () {
    await hre.network.provider.send("evm_increaseTime", ["0x" + (3600).toString(16)]);
    await hre.network.provider.send("evm_mine", []);

    const initialOwnerBalance = await hre.ethers.provider.getBalance(owner.address);
    
    const tx = await lock.withdraw();
    const receipt = await tx.wait();
    
    if (!receipt) throw new Error("No receipt");
    
    const gasUsed = (receipt as any).gasUsed * (receipt as any).gasPrice;
    
    const finalOwnerBalance = await hre.ethers.provider.getBalance(owner.address);
    expect(finalOwnerBalance).to.be.closeTo(
      initialOwnerBalance + lockedAmount - gasUsed,
      ethers.parseEther("0.1")
    );
  });
});
