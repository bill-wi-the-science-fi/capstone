const Nominate = require('../../../build/contracts/Nominate.json');
const abiNominate = Nominate.abi;
const nominateContractAddress = Nominate.networks[3].address;
const relayerAddress = '0x7714e9182799ce2f92b26e70c9cd55cd1b3c1d38';
const Web3 = require('web3');
const {DefenderRelayProvider} = require('defender-relay-client/lib/web3');
const RELAYER_KEY = process.env.RELAYER_KEY;
const RELAYER_SECRET = process.env.RELAYER_SECRET;
const credentials = {apiKey: RELAYER_KEY, apiSecret: RELAYER_SECRET};

const provider = new DefenderRelayProvider(credentials, {speed: 'fast'});
const web3 = new Web3(provider);
const from = relayerAddress;

const buildContract = () => {
  const contract = new web3.eth.Contract(abiNominate, nominateContractAddress, {
    from
  });
  return contract;
};

module.exports = buildContract;
