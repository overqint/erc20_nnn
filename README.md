# NNN Gold Token 

The 999.9 token (NNN) is asset-backed by LBMA certified gold. 100 NNN constitute 1g of gold. The token allows tokenholders to exchange it for physical gold

## Technical Information

Upgradable ERC20 Contract

Code Architecture inspiration from https://github.com/PresearchOfficial/PRE-Token

Using OpenZeppelin contracts.

## Troubleshooting
### Error: PollingBlockTracker - encountered an error while attempting to update latest block:
Error: ESOCKETTIMEDOUT

add 
```
networkCheckTimeout: 10000
```
to truffle-config.js

More information here: https://github.com/trufflesuite/truffle/issues/3356



