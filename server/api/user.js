const router = require('express').Router()
const {User, Award, Nomination} = require('../db/models')
const {Op} = require('sequelize')
const {isLoggedIn} = require('./securityMiddleware')
module.exports = router

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
      where: {email: email},
      attributes: ['email', 'firstName', 'lastName', 'imgUrl']
    })

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
