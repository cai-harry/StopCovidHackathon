pragma solidity >=0.4.21 <0.7.0;


contract Contributions {
    address public owner;

    mapping(address => uint256) public tokens;
    uint256 public totalTokens;

    // Eth withdrawable for each account.
    // The owner's balance is the stake which is released to trainers.
    mapping(address => uint256) public balance;

    // The non-owner addresses with non-zero balance.
    address[] public payableAddresses;

    constructor() public {
        owner = msg.sender;
    }

    modifier ownerOnly {
        require(
            msg.sender == owner,
            "Only the contract owner can perform this operation"
        );
        _;
    }

    receive () external payable {
        balance[msg.sender] += msg.value;
    }

    function giveTokens(address recipient, uint256 _numTokens)
        external
        ownerOnly()
    {
        totalTokens = totalTokens + _numTokens;
        if (tokens[recipient] == 0) {
            payableAddresses.push(recipient);
        }
        tokens[recipient] = tokens[recipient] + _numTokens;
    }

    function releaseFunds() external ownerOnly() {
        if (totalTokens > balance[owner]) {
            uint256 tokensPerWei = totalTokens / balance[owner];
            for (uint256 i = 0; i < payableAddresses.length; i++) {
                address recipient = payableAddresses[i];
                uint256 amount = tokens[recipient] / tokensPerWei;
                giveFunds(recipient, amount);
            }
        } else {
            uint256 weiPerToken = balance[owner] / totalTokens;
            for (uint256 i = 0; i < payableAddresses.length; i++) {
                address recipient = payableAddresses[i];
                uint256 amount = tokens[recipient] * weiPerToken;
                giveFunds(recipient, amount);
            }
        }
    }

    function withdrawFunds(uint256 _amount) external {
        require(
            balance[msg.sender] >= _amount,
            "Withdrawal amount exceeds balance"
        );
        balance[msg.sender] = balance[msg.sender] - _amount;
        address payable recipient = msg.sender;
        recipient.transfer(_amount);
    }

    function giveFunds(address recipient, uint256 _amount)
        internal
        ownerOnly()
    {
        require(
            balance[msg.sender] >= _amount,
            "Payment amount exceeds balance"
        );
        balance[owner] = balance[owner] - _amount;
        balance[recipient] = balance[recipient] + _amount;
    }
}
