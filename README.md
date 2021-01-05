# NNN Gold Token 

The 999.9 token (NNN) is asset-backed by LBMA certified gold. 100 NNN constitute 1g of gold. The token allows tokenholders to exchange it for physical gold

## Audit

Thanks for Red4Sec Team
## Technical Information

Upgradable ERC20 Contract

Using OpenZeppelin contracts.

Thanks for the outstanding work that openzeppelin puts into it's contract and the great and near instant support from their team.

### Deploying Proxy

Using Truffle to deploying Proxy
```
contracts/Migrations.sol
```

Contracts can be deployed with
```
truffle deploy --network <network_name>
```
For local deployment ganache must be started and private keys saved into

```
.secrets.json
```

local deployment:
```
truffle deploy --network development
```

testnet deployment:
```
truffle deploy --network ropsten
```

mainnet deployment:
```
truffle deploy --network mainnet
```

## Testing

tests can be run with:
```
truffle test
```
### running individual tests

choose a test file
```
truffle test/<testname>.js
```

with the .only flag individual test can be run  
```
it.only("should run this test") async function () {
  ...
}
```
## Troubleshooting
### Error: PollingBlockTracker - encountered an error while attempting to update latest block:
Error: ESOCKETTIMEDOUT

add 
```
networkCheckTimeout: 10000
```
to truffle-config.js

More information here: https://github.com/trufflesuite/truffle/issues/3356



