const router = require('express').Router()
const {User, Award, Nomination} = require('../db/models')
const {Op} = require('sequelize')
const {isLoggedIn} = require('./securityMiddleware')
const Sequelize = require('sequelize')
module.exports = router

const relayerAddress = '0x7714e9182799ce2f92b26e70c9cd55cd1b3c1d38'
const nominateContractAddress = '0x3AFAe04805bB556Ff14A4af4aa7875053D6C3948'
const Web3 = require('web3')
const {DefenderRelayProvider} = require('defender-relay-client/lib/web3')
// PUT SECRET IS SECRETS.JS FILE (PROCESS_ENV)
// relayer address: 0x7714e9182799ce2f92b26e70c9cd55cd1b3c1d38
const credentials = {
  apiKey: 'GD43DTA3A7xqWowrRENrsYRnicGToHni',
  apiSecret: 'yUL1zuDV9zYrdX5ka51XiqqwCb4CgVZTM8BaDsRKM1TUiPFrjkhYP1ev239UNdKi'
}
// Attached to the form for "sign up" and returns True or false based on them being verified.
router.put('/', async (req, res, next) => {
  try {
    const {email, pin} = req.body

    let verified = await User.findOne({
      where: {
        email: email,
        pin: pin
      }
    })

    const userVerified = {userHasPin: false}
    if (verified) userVerified.userHasPin = true
    res.json(userVerified)
  } catch (err) {
    next(err)
  }
})

//if the link for user signup is verified, find user and update information
router.put('/verified', async (req, res, next) => {
  try {
    const {
      ethPublicAddress,
      firstName,
      lastName,
      email,
      password,
      imgUrl,
      pin
    } = req.body
    let user = await User.findOne({
      where: {
        email: email,
        pin: pin
      }
    })
    if (user) {
      await user.update({
        ethPublicAddress,
        firstName,
        lastName,
        password,
        imgUrl
      })
    }
    //sending back limited information
    user = await User.findOne({
      where: {email: email, pin: pin},
      attributes: ['id', 'email', 'firstName', 'lastName', 'imgUrl']
    })
    const nominations = await Nomination.findAll({
      where: {
        recipientId: user.id
      }
    })
    let pairIds = nominations.map((pair) => pair.id)
    let awardInstances = await Award.findAll({
      where: {
        pairId: {
          [Sequelize.Op.in]: pairIds
        }
      }
    })
    // change status for awards associated with new user from pending to open
    // pending = placeholder user account set up but user not verified yet (no donations)
    // open = able to accept donations
    for (let i = 0; i < awardInstances.length; i++) {
      if (awardInstances[i].open === 'pending') {
        await awardInstances[i].update({open: 'open'})
      }
    }
    const awards = awardInstances.map((awardInstance) => awardInstance.id)
    // optimization: create method in smart contract to accept a list of award ids for a given recipient
    if (awards.length > 0) {
      const provider = new DefenderRelayProvider(credentials, {speed: 'fast'})
      const web3 = new Web3(provider)
      const from = relayerAddress
      const contract = new web3.eth.Contract(
        abiNominate,
        nominateContractAddress,
        {from}
      )
      for (let awardId of awards) {
        contract.methods.setRecipient(awardId, ethPublicAddress).send()
      }
    }
    res.json(user)
  } catch (err) {
    next(err)
  }
})

//grab user awards based on user id on the user page
router.get('/:id', isLoggedIn, async (req, res, next) => {
  try {
    const pairIdArray = await Nomination.findAll({
      where: {recipientId: req.params.id}
    })
    let pairIds = pairIdArray.map((element) => element.dataValues.id)

    const awards = await Award.findAll({
      where: {
        pairId: {
          [Op.or]: pairIds
        }
      },
      order: [['id', 'DESC']]
    })

    res.json(awards)
  } catch (err) {
    next(err)
  }
})

const abiNominate = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Award_Deactivated',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Award_Distributed',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_to',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Award_Goal_Reached',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: '_from',
        type: 'address'
      },
      {
        indexed: true,
        internalType: 'address',
        name: '_contract',
        type: 'address'
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: '_value',
        type: 'uint256'
      }
    ],
    name: 'Emit_Funds_Donated',
    type: 'event'
  },
  {
    stateMutability: 'nonpayable',
    type: 'fallback'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    name: 'allAwards',
    outputs: [
      {
        internalType: 'address payable',
        name: 'recipientAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'donationLimit',
        type: 'uint256'
      },
      {
        internalType: 'uint256',
        name: 'donationTotal',
        type: 'uint256'
      },
      {
        internalType: 'address',
        name: 'nominatorAddress',
        type: 'address'
      },
      {
        internalType: 'uint256',
        name: 'expires',
        type: 'uint256'
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  },
  {
    stateMutability: 'payable',
    type: 'receive',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      }
    ],
    name: 'donateFunds',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      },
      {
        internalType: 'address payable',
        name: '_recipientAddress',
        type: 'address'
      }
    ],
    name: 'startAwardAndDonate',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
    payable: true
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      },
      {
        internalType: 'address payable',
        name: '_recipientAddress',
        type: 'address'
      }
    ],
    name: 'setRecipient',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      }
    ],
    name: 'expireAward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: '_awardId',
        type: 'uint256'
      }
    ],
    name: 'deactivateAward',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'balanceOfContract',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256'
      }
    ],
    stateMutability: 'view',
    type: 'function',
    constant: true
  }
]
