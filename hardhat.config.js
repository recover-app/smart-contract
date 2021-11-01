require("@nomiclabs/hardhat-waffle");
require('hardhat-contract-sizer');

const path = require('path');
require("dotenv").config({ path: path.join(__dirname, './.env') });

const {INFURA_PROJECT_ID, PRIVATE_KEY_DEPLOYER} = process.env;

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
module.exports = {
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_PROJECT_ID}`,
      accounts: [PRIVATE_KEY_DEPLOYER]
    }
  },
  solidity: "0.8.7"
};
