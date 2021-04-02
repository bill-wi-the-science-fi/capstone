var Nominate = artifacts.require('Nominate');
module.exports = function (deployer) {
  deployer.deploy(Nominate);
  // Additional contracts can be deployed here
};
