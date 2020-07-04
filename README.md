# StarNotaryService-ERC721

You will first need to compile and test

```
truffle develop
compile
test
```

Then migrate to a network such as the rinkeby test network with the following steps: 

  1. Change the ```truffle-config.js``` settings and add your mnemonic and api key 

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
          // gasPrice: 10000000000,
        confirmations: 2,    // # of confs to wait between deployments. (default: 0)
        // timeoutBlocks: 200,  // # of blocks before a deployment times out  (minimum/default: 50)
        skipDryRun: true     // Skip dry run before migrations? (default: false for public nets )
      },
    },
  ```
  2. Run command to migrate to rinkeby testnet

  ```
  migrate --reset all --network rinkeby

  ```


Run the frontend

```
cd app 
npm run
```
