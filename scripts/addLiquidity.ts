import { ethers } from "hardhat";
import * as helpers from "@nomicfoundation/hardhat-network-helpers";

async function main() {
  const AssetHolder = "0xf584f8728b874a6a5c7a8d4d387c9aae9172d621";

  await helpers.impersonateAccount(AssetHolder);
  const impersonatedSigner = await ethers.getSigner(AssetHolder);

  // USDC contract Address
  const USDCAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";

  // DAI contract Address
  const DAIAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";

  const UNIRouter = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D";

  console.log("Impersonated signer:", impersonatedSigner.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
