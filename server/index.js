const path = require('path')
const express = require('express')
const morgan = require('morgan')
const compression = require('compression')
const session = require('express-session')
const passport = require('passport')
const SequelizeStore = require('connect-session-sequelize')(session.Store)
const db = require('./db')
const sessionStore = new SequelizeStore({db})
const PORT = process.env.PORT || 8080
const app = express()
const socketio = require('socket.io')

module.exports = app

// This is a global Mocha hook, used for resource cleanup.
// Otherwise, Mocha v4+ never quits after tests.
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions())
}

/**
 * In your development environment, you can keep all of your
 * app's secret API keys in a file called `secrets.js`, in your project
 * root. This file is included in the .gitignore - it will NOT be tracked
 * or show up on Github. On your production server, you can add these
 * keys as environment variables, so that they can still be read by the
 * Node process on process.env
 */
if (process.env.NODE_ENV !== 'production') require('../secrets')

// passport registration
passport.serializeUser((user, done) => done(null, user.id))

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id)
    done(null, user)
  } catch (err) {
    done(err)
  }
})

const createApp = () => {
  // logging middleware
  app.use(morgan('dev'))

  // body parsing middleware
  app.use(express.json())
  app.use(express.urlencoded({extended: true}))

  // compression middleware
  app.use(compression())

  // session middleware with passport
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'my best friend is Cody',
      store: sessionStore,
      resave: false,
      saveUninitialized: false
    })
  )
  app.use(passport.initialize())
  app.use(passport.session())

  // auth and api routes
  app.use('/auth', require('./auth'))
  app.use('/api', require('./api'))

  // static file-serving middleware
  app.use(express.static(path.join(__dirname, '..', 'public')))

  // any remaining requests with an extension (.js, .css, etc.) send 404
  app.use((req, res, next) => {
    if (path.extname(req.path).length) {
      const err = new Error('Not found')
      err.status = 404
      next(err)
    } else {
      next()
    }
  })

  // sends index.html
  app.use('*', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public/index.html'))
  })

  // error handling endware
  app.use((err, req, res, next) => {
    console.error(err)
    console.error(err.stack)
    res.status(err.status || 500).send(err.message || 'Internal server error.')
  })
}

const cron = require('node-cron')
const Nominate = require('../client/contracts/Nominate.json')
const Web3 = require('web3')
const {infuraUrl, contractAddress} = require('../secrets')
// let infuraUrl = 'wss://ropsten.infura.io/ws/v3/8cb1eb8e6e60464a8c51222f37dc5a98'
// let contractAddress = '0xd5cb8F7F6362B4D1C75489926Ae95312dDE56014'
const web3 = new Web3(infuraUrl)

/* var subscription = web3.eth
  .subscribe(
    'logs',
    {
      address: address,
      index: 'Emit_Funds_Donated'
    },
    function (error, result) {
      if (!error) console.log(result)
    }
  )
  .on('connected', function (subscriptionId) {
    console.log(subscriptionId)
  })
  .on('data', function (log) {
    console.log(log)
  })
  .on('changed', function (log) {})
 */

const initListener = async () => {
  /*   const web3 = new Web3(infuraUrl)
  const networkId = await web3.eth.net.getId()
 */

  const myContract = new web3.eth.Contract(Nominate.abi, contractAddress)
  myContract.events
    .allEvents()
    .on('data', (event) => {
      console.log('smart contract event logged \n \n', event, '\n\n')
    })
    .on('error', console.error)
}
let contractListner = initListener()

/* const getEthAmount = async () => {
  const web3 = new Web3(infuraUrl)
  const networkId = await web3.eth.net.getId()
  const myContract = new web3.eth.Contract(
    Nominate.abi,
    Nominate.networks[networkId].address
  )
}
 */

/* var contract = new Contract(
  Nominate.abi,
  '0x3AFAe04805bB556Ff14A4af4aa7875053D6C3948'
)

set provider for all later instances to use
Contract.setProvider('ws://localhost:8546')

var Contract = Web3.eth
  .contract(Nominate.abi)
  .at('0x3AFAe04805bB556Ff14A4af4aa7875053D6C3948')
 */

let counter = 0

cron.schedule('* * * * * *', () => {
  counter++
  // let contractBalance = getEthAmount()
  // if (contractBalance){
  // log it?
  // } else initListener()
  console.log('Ive been running for', counter, 'seconds')
})

const startListening = () => {
  // start listening (and create a 'server' object representing our server)
  const server = app.listen(PORT, () =>
    console.log(`Mixing it up on port ${PORT}`)
  )

  // set up our socket control center
  const io = socketio(server)
  require('./socket')(io)
}

const syncDb = () => db.sync()

async function bootApp() {
  await sessionStore.sync()
  await syncDb()
  await createApp()
  await startListening()
}
// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp()
} else {
  createApp()
}
