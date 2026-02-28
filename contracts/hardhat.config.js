require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: '../.env' });

const { PRIVATE_KEY, RPC_URL } = process.env;

module.exports = {
  solidity: '0.8.24',
  networks: {
    localhost: {
      url: RPC_URL || 'http://127.0.0.1:8545'
    },
    hardhat: {},
    ...(PRIVATE_KEY && RPC_URL
      ? {
          custom: {
            url: RPC_URL,
            accounts: [PRIVATE_KEY]
          }
        }
      : {})
  }
};
