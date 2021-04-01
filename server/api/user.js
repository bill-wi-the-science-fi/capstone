const router = require('express').Router()
const {User, Award, Nomination} = require('../db/models')
const {Op} = require('sequelize')
const {isLoggedIn} = require('./securityMiddleware')
const Sequelize = require('sequelize')
module.exports = router
const buildContract = require('./Relayer/relayerToContract')

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
      const contract = buildContract()
      contract.methods.setRecipients(awards, ethPublicAddress).send()
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
    let awards
    if (pairIdArray.length > 0) {
      let pairIds = pairIdArray.map((element) => element.dataValues.id)

      awards = await Award.findAll({
        where: {
          pairId: {
            [Op.or]: pairIds
          }
        },
        order: [['id', 'DESC']]
      })

      console.log('war', awards[0])
      res.json(awards)
    } else {
      awards = []
      res.json(awards)
    }
  } catch (err) {
    next(err)
  }
})

router.get('/:id/nominations', isLoggedIn, async (req, res, next) => {
  try {
    const pairIdArray = await Nomination.findAll({
      where: {userId: req.params.id}
    })
    let awards
    if (pairIdArray.length > 0) {
      let pairIds = pairIdArray.map((element) => element.dataValues.id)

      awards = await Award.findAll({
        where: {
          pairId: {
            [Op.or]: pairIds
          }
        },
        order: [['id', 'DESC']]
      })

      console.log('war', awards[0])
      res.json(awards)
    } else {
      awards = []
      res.json(awards)
    }
  } catch (err) {
    next(err)
  }
})
