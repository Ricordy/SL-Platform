import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";
import { hardhat } from "wagmi/chains";

dotenv.config();

const ALCHEMY_API_KEY_URL = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;

const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

const PRIVATE_KEY = process.env.PRIVATE_KEY;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  paths: { tests: "tests", artifacts: "./src/artifacts" },
  networks: {
    hardhat: {
      accounts: {
        count: 16,
      },
      chainId: 31337,
      blockGasLimit: 1000000004297200,
    },
    goerli: {
      url: ALCHEMY_API_KEY_URL,
      accounts: [PRIVATE_KEY ?? ""],
    },
  },
  etherscan: {
    apiKey: {
      goerli: ETHERSCAN_API_KEY
    }
  },
  defaultNetwork: "hardhat",
};

export default config;
