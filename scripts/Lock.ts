import { ethers } from "hardhat";
import { impersonateAccount } from "@nomicfoundation/hardhat-network-helpers";

async function main() {
  const AssetHolder = "0xfADea771FF54329e874d4578B88782c0327B97ed";

  await impersonateAccount(AssetHolder);
  const impersonatedSigner = await ethers.getSigner(AssetHolder);

  const JAN_1ST_2030 = 1893456000;
  const ONE_GWEI: bigint = 1_000_000_000n;

  const Lock = await ethers.getContractFactory("Lock");
  const lock = await Lock.connect(impersonatedSigner).deploy(JAN_1ST_2030, {
    value: ONE_GWEI,
  });
  await lock.waitForDeployment();
  console.log("Lock deployed to:", await lock.getAddress());

  const tx_time = await lock.unlockTime();
  const owner = await lock.owner();

  console.log("Unlock time:", tx_time);
  console.log("Owner:", owner);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});