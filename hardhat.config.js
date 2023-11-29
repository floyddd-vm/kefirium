require("@nomicfoundation/hardhat-toolbox");

require("./tasks/sample_tasks");

const PRIVATE_KEY = "";
const SEP_API_KEY = "";

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/88762928a4164487b3fcdd2dc892598d`,
      accounts: [PRIVATE_KEY],
      id: 11155111
    }
  },
  etherscan: {
    apiKey: {
      sepolia: SEP_API_KEY
    }
  },
  namedAccount: {
    deployer: 0,
    user1: 1,
    user2: 2,
  }
};
