pragma solidity 0.6.2;

import "./ERC20PresetMinterPauser.sol";
import "@openzeppelin/contracts-ethereum-package/contracts/Initializable.sol";

/**
 * @dev ERC20 token with minting, burning and pausable token transfers.
 *
 */
contract EnhancedMinterPauser is
    Initializable,
    ERC20PresetMinterPauserUpgradeSafe
{
    bytes32 public constant FEE_EXCLUDED_ROLE = keccak256("FEE_EXCLUDED_ROLE");

    uint32 public tokenTransferFeeDivisor;
    //address where the fees will be sent
    address public feeAddress;

    function __EnhancedMinterPauser_init(
        string memory name,
        string memory symbol
    ) internal initializer {
        __ERC20_init_unchained(name, symbol);
        __ERC20PresetMinterPauser_init_unchained();
        __EnhancedMinterPauser_init_unchained();
    }

    function __EnhancedMinterPauser_init_unchained() internal initializer {
        _setupRole(FEE_EXCLUDED_ROLE, _msgSender());
        //TODO not set during intializiation
        setMintingFeeAddress(0xFEff5513B45A48D0De4f5e277eD22973a9389e0B);
        //TODO not set during intializiation
        setMintingFeePercent(2000);
    }

    // minting process does not involve fees (by design)
    function mintWithoutDecimals(address recipient, uint256 amount) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "PauseableEnhancedERC20: must have admin role to mint"
        );

        return super._mint(recipient, amount * 1000000000000000000);
    }

    function transfer(address recipient, uint256 amount)
        public
        virtual
        override
        returns (bool)
    {
        if (hasRole(FEE_EXCLUDED_ROLE, _msgSender())) {
            super.transfer(recipient, amount);
        } else
            return
                super.transfer(
                    recipient,
                    _calculateAmountSubTransferFee(amount)
                );
    }

    function setMintingFeeAddress(address _feeAddress) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "PauseableEnhancedERC20: must have admin role to set minting fee address"
        );

        feeAddress = _feeAddress;
    }

    function setMintingFeePercent(uint32 _tokenTransferFeeDivisor) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "PauseableEnhancedERC20: must have admin role to set minting fee address"
        );

        tokenTransferFeeDivisor = _tokenTransferFeeDivisor;
    }

    // calculate transfer fee and send to predefined wallet
    function _calculateAmountSubTransferFee(uint256 amount)
        private
        returns (uint256)
    {
        uint256 transferFeeAmount = amount.div(tokenTransferFeeDivisor);
        //TODO to be able to use the "real" percent value change to uint256 transferFeeAmount = mul.(1/tokenTransferFeeDivisor)
        super.transfer(feeAddress, transferFeeAmount);
        return amount.sub(transferFeeAmount);
    }

    uint256[50] private __gap;
}
