import "@nomicfoundation/hardhat-ethers";
import "@nomicfoundation/hardhat-network-helpers";
import "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import * as dotenv from "dotenv";
import * as path from "path";
import { fileURLToPath } from "url";
import { HardhatUserConfig } from "hardhat/config";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, ".env") });

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      // Minimal configuration for Hardhat network
    },
    localhost: {
      chainId: 31337,
      url: "http://127.0.0.1:8545",
    }
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  typechain: {
    outDir: "types"
  },
};

export default config;