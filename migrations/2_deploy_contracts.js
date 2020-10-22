const NNN = artifacts.require("NNN Token");
const Roles = artifacts.require("Roles");
const WhitelistAdminRole = artifacts.require("WhitelistAdminRole");
const WhitelistedRole = artifacts.require("WhitelistedRole");

module.exports = function(deployer) {
  deployer.deploy(NNN);
  //deployer.link(ConvertLib, MetaCoin);
  deployer.deploy(Roles);
  deployer.deploy(WhitelistAdminRole);
  deployer.deploy(WhitelistedRole);
};