// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

enum Currency {
    NONE,
    EVH,
    USDT
}

interface IEVHTokenPurchase {
    function swapUsdtToEVH(address _from, uint256 _amount) external;

    function withdraw(Currency _currencyName, uint256 _amount) external;
}
