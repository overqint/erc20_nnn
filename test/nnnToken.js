var constants = require('./include_in_tesfiles.js')

contract("NNNToken", async accounts => {
  it("token transfer fee should be 0.005 percent", () =>
    constants._t_c.NNNToken.deployed()
      .then(async instance => {
        let tokenTransferFeeDivisor = await instance.tokenTransferFeeDivisor();
        assert.equal(tokenTransferFeeDivisor.toString(), constants._t_c.FEE);
      })
  );

  it("token transfer address should be " + constants._t_c.FEE_COLLECTOR_ADDRESS, () =>
    constants._t_c.NNNToken.deployed()
      .then(async instance => {
        let feeAddress = await instance.feeAddress();
        assert.equal(feeAddress.toString(), constants._t_c.FEE_COLLECTOR_ADDRESS);
      })
  );

  it("fee exclude role should be " + constants._t_c.FEE_EXCLUDED_ROLE, () =>
    constants._t_c.NNNToken.deployed()
      .then(async instance => {
        let feeExcludeRole = await instance.FEE_EXCLUDED_ROLE();
        assert.equal(feeExcludeRole.toString(), constants._t_c.FEE_EXCLUDED_ROLE);
      })
  );

  it("mint tokens without decimal places and sent to address", () =>
    constants._t_c.NNNToken.deployed()
      .then(async instance => {
        instance.mintWithoutDecimals(accounts[0], 1)
        let balance = (await instance.balanceOf(accounts[0])).toString()
        assert.equal(balance, 1000000000000000000);
      })
  );

  it("grant fee exclude role to address", () =>
    constants._t_c.NNNToken.deployed()
      .then(async instance => {
        instance.grantRole(constants._t_c.FEE_EXCLUDED_ROLE, constants._t_c.FEE_COLLECTOR_ADDRESS)
        let hasFeeExcludeRole = (await instance.hasRole(constants._t_c.FEE_EXCLUDED_ROLE, constants._t_c.FEE_COLLECTOR_ADDRESS)).toString()
        assert.equal(hasFeeExcludeRole, "true");
      })
  );
});