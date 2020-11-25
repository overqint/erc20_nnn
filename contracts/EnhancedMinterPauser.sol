pragma solidity ^0.7.0;

//import "./ERC20PresetMinterPauser.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/presets/ERC20PresetMinterPauserUpgradeable.sol";
import "../node_modules/@openzeppelin/contracts-upgradeable/math/SafeMathUpgradeable.sol";

/**
 * @dev ERC20 token with minting, burning and pausable token transfers.
 *
 */
contract EnhancedMinterPauser is
    Initializable,
    ERC20PresetMinterPauserUpgradeable
{
    using SafeMathUpgradeable for uint256;

    //role for excluding addresses for feeless transfer
    bytes32 public constant FEE_EXCLUDED_ROLE = keccak256("FEE_EXCLUDED_ROLE");

    uint32 public tokenTransferFeeDivisor;
    //address where the fees will be sent
    address public feeAddress;

    event mintingFeeAddressChanged(address newValue);
    event mintingFeePercentChanged(uint32 newValue);

    function __EnhancedMinterPauser_init(
        string memory name,
        string memory symbol
    ) internal initializer {
        __ERC20_init_unchained(name, symbol);
        __ERC20PresetMinterPauser_init_unchained(name, symbol);
        __EnhancedMinterPauser_init_unchained();
    }

    function __EnhancedMinterPauser_init_unchained() internal initializer {
        _setupRole(FEE_EXCLUDED_ROLE, _msgSender());
        setMintingFeeAddress(0xFEff5513B45A48D0De4f5e277eD22973a9389e0B);
        setTransferFeeDivisor(2000);
    }

    // minting process does not involve fees (by design)
    function mintWithoutDecimals(address recipient, uint256 amount) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Caller must have admin role to mint"
        );

        return super._mint(recipient, amount * 1000000000000000000);
    }

    function mintWithFee(address recipient, uint256 amount) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Caller must have admin role to mint"
        );
        return super._mint(recipient, _calculateAmountSubTransferFee(amount));
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
            "Caller must have admin role to set minting fee address"
        );

        feeAddress = _feeAddress;
        emit mintingFeeAddressChanged(feeAddress);
    }

    function setTransferFeeDivisor(uint32 _tokenTransferFeeDivisor) public {
        require(
            hasRole(DEFAULT_ADMIN_ROLE, _msgSender()),
            "Caller must have admin role to set minting fee percent"
        );

        tokenTransferFeeDivisor = _tokenTransferFeeDivisor;
        emit mintingFeePercentChanged(tokenTransferFeeDivisor);
    }

    // calculate transfer fee and send to predefined wallet
    function _calculateAmountSubTransferFee(uint256 amount)
        private
        returns (uint256)
    {
        //using SafeMath for uint256 transferFeeAmount = amount.div(tokenTransferFeeDivisor);
        super.transfer(feeAddress, amount.div(tokenTransferFeeDivisor));
        return amount.sub(amount.div(tokenTransferFeeDivisor));
    }

    uint256[50] private __gap;
}
