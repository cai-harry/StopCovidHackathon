const Federated = artifacts.require("Federated");

module.exports = function(deployer) {
  deployer.deploy(Federated);
};
