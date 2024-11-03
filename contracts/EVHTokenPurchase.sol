// SPDX-License-Identifier: MIT

pragma solidity ^0.8.27;
import {IERC20}  from "./interface/IERC20.sol";

contract TokenPurchase {

    
    IERC20 public eventHubToken;
    IERC20 public usdtToken;

    address owner;
    bool internal locked;
    uint256 internal constant ONE_USDT_TO_EVH = 1600;

    enum Currency {NONE, EVH, USDT }

    mapping (Currency => uint256)  contractBalances;

    constructor(IERC20 _eventHubToken, IERC20 _usdtTokenCAddr){
        eventHubToken = _eventHubToken;
        usdtToken = _usdtTokenCAddr;
        owner = msg.sender;
    }

    event SwapSuccessful(address indexed from, address indexed to, uint256 amount);
    event WithdrawSuccessful(address indexed owner, Currency indexed _currencyName, uint256 amount);


    modifier reentrancyGuard() {
        require(!locked, "Reentrancy not allowed");
        locked = true;
        _;
        locked = false;
    }

    modifier onlyOwner(){
        require(msg.sender == owner, "Only owner can access");
        _;
    }



    function swapUsdtToEVH (address _from, uint256 _amount) external reentrancyGuard {
    require(msg.sender != address(0), "Zero not allowed");
    require(_amount > 0, "Cannot swap zero amount");


    uint256 userBal = usdtToken.balanceOf(_from);
    require(userBal >= _amount, "Your balance is not enough");

    uint256 allowance = usdtToken.allowance(_from, address(this));
    require(allowance >= _amount, "Token allowance too low");

    bool deducted = usdtToken.transferFrom(_from, address(this), _amount);
    require(deducted, "Execution failed");

    contractBalances[Currency.USDT] += _amount;

    uint256 convertedValue_ = EVH_Usdt_Rate(_amount, Currency.USDT);
    bool swapped = eventHubToken.transfer(_from, convertedValue_);

    if (swapped) {
        contractBalances[Currency.EVH] += convertedValue_;
        emit SwapSuccessful(_from, address(this), _amount);
    }
}


      function withdraw(Currency _currencyName, uint256 _amount) external onlyOwner  {
        require(_amount > 0, "balance is less");

        uint256 bal = contractBalances[_currencyName];

        require(bal >= _amount, "Insufficient contract balance");


        if(Currency.EVH == _currencyName) {

         eventHubToken.transfer(owner, _amount);

         
        emit WithdrawSuccessful(owner, _currencyName, _amount);


        }else  if(Currency.USDT == _currencyName) {
         usdtToken.transfer(owner, _amount);

         
        emit WithdrawSuccessful(owner, _currencyName, _amount);


        }

        revert("Token not defined");
    }



 function EVH_Usdt_Rate (uint256 _amount, Currency _currency) internal pure returns (uint256 convertedValue_) {
        if(_currency == Currency.USDT) {
            convertedValue_ = _amount * ONE_USDT_TO_EVH;  
        } else if(_currency == Currency.EVH) {
            convertedValue_ = _amount  / ONE_USDT_TO_EVH;
        } else {
            revert("Unsupported currency");
        }
        return convertedValue_;
    }
}