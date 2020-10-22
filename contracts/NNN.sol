pragma solidity ^0.6.0;

import "openzeppelin-solidity/contracts/presets/ERC20PresetMinterPauser.sol";
import "./WhitelistedRole.sol";
/*
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.1.1/contracts/access/Roles.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.1.1/contracts/access/roles/WhitelistAdminRole.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v2.1.1/contracts/access/roles/WhitelistedRole.sol";
*/

contract NNNToken is WhitelistedRole, ERC20PresetMinterPauser("NNN Token", "NNN") {

    using SafeMath for uint256;
    //WhitelistedRole w = new WhitelistedRole();

    // the amount of fee during every transfer, i.e. 2000 = 0,05% 100 = 1%, 50 = 2%, 40 = 2.5%
    uint32 public tokenTransferFeeDivisor;
    //address where the fees will be sent
    address public feeAddress;
    
    constructor( uint32 _tokenTransferFee, address _feeAddress) public {
        require(_tokenTransferFee > 0, "NNN Token contract: fee must be bigger than 0");
        tokenTransferFeeDivisor = _tokenTransferFee;
        feeAddress = _feeAddress;
        
    }
    function transfer(address recipient, uint256 amount) public virtual override returns (bool) {
        if(isWhitelisted(address(this)) == false){
            // calculate transfer fee and send to predefined wallet
            uint256 transferFeeAmount = amount.div(tokenTransferFeeDivisor);
            super.transfer(feeAddress, transferFeeAmount);
            return super.transfer(recipient, amount.sub(transferFeeAmount));
        } else return super.transfer(recipient, amount);
    }
    function transferFrom(address sender, address recipient, uint256 amount) public virtual override returns (bool) {
        if(isWhitelisted(sender) == false){
            // calculate transfer fee and send to predefined wallet
            uint256 transferFeeAmount = amount.div(tokenTransferFeeDivisor);
            super.transferFrom(sender, feeAddress, transferFeeAmount);
            return super.transferFrom(sender, recipient, amount.sub(transferFeeAmount));
        }
        else return super.transferFrom(sender, recipient, amount);
    }
    
    
    /*function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);

        if (from == address(0)) { // When minting tokens
            require(totalSupply().add(amount) <= _cap, "ERC20Capped: cap exceeded");
        }
    }*/
    
}