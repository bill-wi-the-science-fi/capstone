const router = require('express').Router()
const {User} = require('../db/models')
module.exports = router

// Attached to the form for "sign up" and returns True or false based on them being verified.

//Not sure about this route's security... might need to create an error below
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

//needs protection?? when is this used in the process?
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
