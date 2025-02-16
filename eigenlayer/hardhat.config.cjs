/** @format */

require('@nomicfoundation/hardhat-toolbox');
require('@nomiclabs/hardhat-ethers');
const dotenv = require('dotenv');
dotenv.config();
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const RPC_url = process.env.RPC_URL;

module.exports = {
  solidity: '0.8.26',
  networks: {
    holesky: {
      url: RPC_url, // Replace with correct RPC URL if necessary
      accounts: [PRIVATE_KEY], // Ensure your private key is loaded
      chainId: 17000, // Holesky chain ID
    },
  },
};
