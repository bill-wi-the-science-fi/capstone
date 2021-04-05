const path = require('path');
const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const session = require('express-session');
const passport = require('passport');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db');
const sessionStore = new SequelizeStore({db});
const PORT = process.env.PORT || 8080;
const app = express();
const socketio = require('socket.io');
const {Award, Nomination, User} = require('./db/models');
const cron = require('node-cron');
const Nominate = require('../build/contracts/Nominate.json');
const contractAddress = Nominate.networks[3].address;
const Web3 = require('web3');
const infuraUrl = process.env.INFURA_WSS;
const web3 = new Web3(infuraUrl);
const myContract = new web3.eth.Contract(Nominate.abi, contractAddress);

module.exports = app;

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions());
}

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */

// passport registration
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'));

  // body parsing middleware
  app.use(express.json());
  app.use(express.urlencoded({extended: true}));

  // compression middleware
  app.use(compression());

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my best friend is Cody',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // auth and api routes
  app.use('/auth', require('./auth'));
  app.use('/api', require('./api'));

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')));

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found');
      err.status = 404;
      next(err);
    } else {
      next();
    }
  });

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'));
  });

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

async function createTransactionInDB(event) {
  const {transactionHash, address, returnValues} = event;
  const smartContractAddress = address;
  const awardId = returnValues['3'];
  console.log('awardid', awardId);
  const donatorAddress = returnValues['0'];
  const amountWei = returnValues['2'];
  console.log('amountWei', amountWei);
  const singleAward = await Award.findOne({
    where: {id: awardId}
  });
  console.log('singleAward', singleAward);

  const singleNomination = await Nomination.findOne({
    where: {id: singleAward.pairId}
  });
  console.log('singleNomination', singleNomination);

  const recipientOfAward = await User.findOne({
    where: {id: singleNomination.recipientId}
  });
  console.log('recipientOfAward', recipientOfAward);

  const giverOfAward = await User.findOne({
    where: {id: singleNomination.userId}
  });
  console.log('giverOfAward', giverOfAward);

  await giverOfAward.createTransaction({
    transactionHash,
    smartContractAddress,
    amountWei,
    awardId
  });
  const updatesToAward = {
    donationTotal: singleAward.donatationTotal
  };
  // if it's there, that means its a new award donation, and the smart contract is established, so we can move it's status to pending.
  console.log(
    '!recipientOfAward.ethPublicAddress',
    !recipientOfAward.ethPublicAddress
  );

  if (!recipientOfAward.ethPublicAddress) {
    await singleAward.update({open: 'pending'});
  } else {
    await singleAward.update({open: 'open'});
  }
  console.log('updatestoaward', updatesToAward, singleAward);
  //We need to figure out
  //update amount award instance property of donationTotal with the current donation
  let newDonationTotal = web3.utils
    .toBN(amountWei)
    .add(web3.utils.toBN(singleAward.donationTotal))
    .toString();
  let donationTotal = newDonationTotal;
  console.log(
    'newDonation',
    newDonationTotal,
    amountWei,
    singleAward.donationTotal
  );
  await singleAward.update({donationTotal});
}

async function deactivateAwardInDb(event) {
  const awardId = event.returnValues['3'];
  const singleAward = await Award.findOne({
    where: {id: awardId}
  });
  await singleAward.update({open: 'withdrawn'});
}

const initListener = () => {
  myContract.events
    .allEvents()
    .on('data', (event) => {
      console.log('\n --------🚀 ', event.event, '\n\n');
      console.log('smart contract event logged \n \n', event, '\n\n');
      if (event.event === 'Emit_Funds_Donated') createTransactionInDB(event);
      if (event.event === 'Award_Deactivated') deactivateAwardInDb(event);
    })
    .on('error', console.error);
};

// if this goes down , what next
let contractListner = initListener();
console.log('initialized', contractListner);

async function ping() {
  let balance = await myContract.methods.balanceOfContract().call();
  console.log('\ncontract balance in ETH', balance * 1e-18, 'ETH\n');
}

let counter = 0;
cron.schedule('10 * * * *', () => {
  counter = counter + 10;
  ping();
  console.log('Listener has been running for', counter, 'minutes');
});

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  );
  // set up our socket control center
  const io = socketio(server);
  require('./socket')(io);
};

const syncDb = () => db.sync();

async function bootApp() {
  await sessionStore.sync();
  await syncDb();
  await createApp();
  await startListening();
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp();
} else {
  createApp();
}
