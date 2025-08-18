// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract Lock {
    uint256 public unlockTime;
    address public owner;

    event Withdrawal(uint amount, uint when);

    constructor(uint256 _unlockTime) payable {
        require(block.timestamp < _unlockTime, "Unlock time should be in the future");
        
        unlockTime = _unlockTime;
        owner = msg.sender;
    }

    function withdraw() public {
        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "Only owner can withdraw");

        emit Withdrawal(address(this).balance, block.timestamp);

        (bool sent, ) = payable(owner).call{value: address(this).balance}("");
        require(sent, "Failed to send Ether");
    }

    // To receive ETH
    receive() external payable {}
}
