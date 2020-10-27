const NNN = artifacts.require("NNNToken");
//const Roles = artifacts.require("Roles");
//const WhitelistAdminRole = artifacts.require("WhitelistAdminRole");
//const WhitelistedRole = artifacts.require("WhitelistedRole");

module.exports = function(deployer) {
  deployer.deploy(NNN, 200, "0x23d14f765b8B8B0Ca604fF673E84cD6BB286021f");
  //deployer.deploy(Roles);
  //deployer.deploy(WhitelistAdminRole);
  //deployer.deploy(WhitelistedRole);
};