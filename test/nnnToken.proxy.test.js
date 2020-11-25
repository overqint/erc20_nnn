// Load dependencies
const { expect } = require('chai');
const { deployProxy } = require('@openzeppelin/truffle-upgrades');

var constants = require('./include_in_tesfiles.js')

// Start test block
contract('NNNToken (proxy)', async accounts => {
  before(async function () {
    // Deploy a new contract before the tests
    this.nnnToken = await deployProxy(
      constants._t_c.NNNToken,
      [constants._t_c.TOKEN_NAME, constants._t_c.TOKEN_SYMBOL],
      { initializer: "__initialize", unsafeAllowCustomTypes: true });
    console.log('Deployed', this.nnnToken.address);
  });

  it("token name should be " + constants._t_c.TOKEN_NAME, async function () {
    expect((await this.nnnToken.name()).toString()).to.equal(constants._t_c.TOKEN_NAME);
  });

  it("token symbol should be " + constants._t_c.TOKEN_SYMBOL, async function () {
    expect((await this.nnnToken.symbol()).toString()).to.equal(constants._t_c.TOKEN_SYMBOL);
  });

  it("token transfer fee should be 1/" + constants._t_c.FEE, async function () {
    let tokenTransferFeeDivisor = await this.nnnToken.tokenTransferFeeDivisor();
    assert.equal(tokenTransferFeeDivisor.toString(), constants._t_c.FEE);
  });

  it("token transfer address should be " + constants._t_c.FEE_COLLECTOR_ADDRESS, async function () {
    let feeAddress = await this.nnnToken.feeAddress();
    assert.equal(feeAddress.toString(), constants._t_c.FEE_COLLECTOR_ADDRESS);
  });

  it("fee exclude role should be " + constants._t_c.FEE_EXCLUDED_ROLE, async function () {
    let feeExcludeRole = await this.nnnToken.FEE_EXCLUDED_ROLE();
    assert.equal(feeExcludeRole.toString(), constants._t_c.FEE_EXCLUDED_ROLE);
  });

  it("mint tokens without decimal places and sent to address", async function () {
    this.nnnToken.mintWithoutDecimals(accounts[0], 1)
    let balance = (await this.nnnToken.balanceOf(accounts[0])).toString()
    assert.equal(balance, 1000000000000000000);
  });

  it("grant fee exclude role to address", async function () {
    this.nnnToken.grantRole(constants._t_c.FEE_EXCLUDED_ROLE, constants._t_c.FEE_COLLECTOR_ADDRESS)
    let hasFeeExcludeRole = (await this.nnnToken.hasRole(constants._t_c.FEE_EXCLUDED_ROLE, constants._t_c.FEE_COLLECTOR_ADDRESS)).toString()
    assert.equal(hasFeeExcludeRole, "true");
  });

  it("sets minting fee", async function () {
    let newFeeAdddress = "0xC1b1943A087A738461e77DFF2b84218f69e7759D"
    this.nnnToken.setMintingFeeAddress(newFeeAdddress);
    assert.equal((await this.nnnToken.feeAddress()).toString(), newFeeAdddress);
  });

  it("sets minting fee address", async function () {
    let newFee = 1000
    this.nnnToken.setTransferFeeDivisor(1000);
    assert.equal((await this.nnnToken.tokenTransferFeeDivisor()).toString(), newFee);
  });
});