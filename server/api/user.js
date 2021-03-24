const router = require('express').Router()
const {User} = require('../db/models')
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
router.put('/verified', async (req, res, next) => {
  try {
    const {
      ethPublicAddress,
      firstName,
      lastName,
      email,
      password,
      imgUrl
    } = req.body
    let user = await User.findOne({
      where: {
        email: email
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
    user = await User.findOne({
      where: {email: email},
      attributes: ['email', 'firstName', 'lastName', 'imgUrl']
    })

    res.json(user)
    // const {email, pin} = req.body
    // let verified = await User.findOne({
    //   where: {
    //     email: email,
    //     pin: pin
    //   }
    // })
    // const userVerified = {userHasPin: false}
    // if (verified) userVerified.userHasPin = true
    // res.json(userVerified)
  } catch (err) {
    next(err)
  }
})
