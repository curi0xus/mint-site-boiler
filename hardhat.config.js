require("@nomiclabs/hardhat-waffle");

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
require("./tasks/faucet");

// If you are using MetaMask, be sure to change the chainId to 1337
module.exports = {
  solidity: {
    compilers: [
      {
        version: "0.8.1",
      },
      {
        version: "0.8.0",
      },
    ],
  },
  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
  networks: {
    local: {
      chainId: 31337,
      url: "http://localhost:8545",
    },
    prod: {
      url: "https://polygon-rpc.com",
      chainId: 137,
      accounts: ["INSRT MAINNET PRIVATE KEY"],
    },
    dev: {
      url: "https://rpc-mumbai.maticvigil.com/",
      chainId: 80001,
      accounts: ["INSERT TESTNET PRIVTE KEY"],
    },
  },
};
