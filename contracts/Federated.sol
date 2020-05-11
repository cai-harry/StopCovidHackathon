pragma solidity >=0.4.21 <0.7.0;

contract Federated {

  mapping (address => string) models;
  address[] public dataScientists;

  function request_training(string memory _modelHash) public payable returns (uint256) {
    require(msg.value > 0, "You must send some ether!");

    address dataScientist = msg.sender;

    models[dataScientist] = _modelHash;
    dataScientists.push(dataScientist);

    return dataScientists.length;
  }

}

