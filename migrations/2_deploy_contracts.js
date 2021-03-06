
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const NNNToken = artifacts.require('NNNToken');

module.exports = async function (deployer, network, accounts) {
  const instance = await deployProxy(
    NNNToken,
    ["Novem Gold Token", "NNN"],
    { deployer, initializer: "initialize", unsafeAllowCustomTypes: true });
  //unsafeAllowCustomTypes Ignores struct mapping in AccessControl, which is fine because it's used in a mapping
  //See: https://solidity.readthedocs.io/en/v0.6.2/miscellaneous.html#mappings-and-dynamic-arrays
  console.log('Deployed', instance.address);
  console.log('Fee in percent', 100/(await instance.tokenTransferFeeDivisor()).toString());
  console.log('Fee address', (await instance.feeAddress()).toString());
};