var constants = require('./include_in_tesfiles.js')

contract("NNNToken", async accounts => {
  it("mint coins and transfer with fee to account, fee should be collected", () =>
    constants._t_c.NNNToken.deployed()
      .then(async instance => {
        const transferAmount = 10000000000000000000

        instance.setMintingFeeAddress(constants._t_c.FEE_COLLECTOR_ADDRESS);
        assert.equal((await instance.feeAddress()).toString(), constants._t_c.FEE_COLLECTOR_ADDRESS);

        instance.setMintingFeePercent(constants._t_c.FEE); 
        assert.equal((await instance.tokenTransferFeeDivisor()).toString(), constants._t_c.FEE);

         instance.mintWithoutDecimals(accounts[0], 10)
        let balance = (await instance.balanceOf(accounts[0])).toString()
        assert.equal(balance, 10000000000000000000);

        instance.mintWithFee(accounts[4], "10000000000000000000")
        let accountBalance = (await instance.balanceOf(accounts[4])).toString()
        assert.equal(accountBalance, 10000000000000000000 - (transferAmount/constants._t_c.FEE))

        let feeCollectorAccountBalance = (await instance.balanceOf(accounts[2])).toString()
        assert.equal(feeCollectorAccountBalance, transferAmount/constants._t_c.FEE)     

      })
  );
});