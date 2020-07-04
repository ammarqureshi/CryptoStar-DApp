# CryptoStar-DApp-ERC721

Ethereum-based decentralised star notary service using ERC721 tokens

You will first need to compile and test

```
truffle develop
compile
test
```

Then migrate to a network such as the rinkeby test network with the following steps: 

  * In ```truffle-config.js``` add your mnemonic and api key which you can get from Infura:

  ```
  const HDWalletProvider = require('truffle-hdwallet-provider');
  const endpoint = '<ENDPOINT>';

  const mnemonic = "<YOUR-MNEMONIC>";

  module.exports = {

    networks: {
      development: {
        host: "127.0.0.1",     // Localhost (default: none)
        port: 9545,            // Standard Ethereum port (default: none)
        network_id: "*",       // Any network (default: none)
       },
      // Useful for deploying to a public network.
      // NB: It's important to wrap the provider as a function.
      rinkeby: {
        provider: () => new HDWalletProvider(mnemonic, endpoint),

          network_id: 4,       // rinkeby's id
          gas: 4500000,        // rinkeby has a lower block limit than mainnet
        confirmations: 2,    // # of confs to wait between deployments. (default: 0)
        // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
        skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
      },
    },
  ```
  * Run command to migrate to rinkeby testnet

  ```
  migrate --reset all --network rinkeby

  ```
  
  Truffle should deploy your contract to the testnet and provide you with the contract address
  In this example the contract can be found on Etherscan rinkeby testnet: https://rinkeby.etherscan.io/address/0xA87146752DeFDB84AA79F0a7C72135e7D5dF511E
  ERC721 Token name: "Star Notary Token"
  ERC721 Token symbol:  "SNT"
  ![Screenshot 2020-07-04 at 19 53 36](https://user-images.githubusercontent.com/17296281/86519629-63ca4a80-be34-11ea-89b6-b1c78c762573.png)
  
  Similarly, you can run on a local testnet with: 
  
  ```
  migrate --reset all 
  ```


Run the frontend

```
cd app 
npm run
```

Versions used: 
* Truffle: v5.1.32 
* openzeppelin-solidity: 3.1.0
* truffle-hdwallet-provider: 1.0.8
