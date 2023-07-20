import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "hardhat-deploy";

import "./tasks/invite";

const config: HardhatUserConfig = {
  solidity: "0.8.18",
  namedAccounts: {
    deployer: {
      default: 0,
    },
  },
};

export default config;
