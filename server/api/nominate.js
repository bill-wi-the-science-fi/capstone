const router = require('express').Router()
const {User, Nomination, Award} = require('../db/models')
const sendEmail = require('../email/email')

module.exports = router

// nominateUser thunk
// this will be the route attatched to the "nominate" form on the front end
router.post('/', async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      imgUrl,
      donationLimit,
      nominatorId,
      email,
      firstName,
      lastName,
      donationTotal
    } = req.body
    let recipientAddress
    // find or create the NOMINEE
    let [nominee, userWasCreated] = await User.findOrCreate({
      where: {email: email}
    })

    // Get noiminator Instance
    const nominator = await User.findOne({where: {id: nominatorId}})

    await nominator.addRecipient(nominee)

    let throughRow = await Nomination.findOne({
      where: {userId: nominator.id, recipientId: nominee.id}
    })

    const newAward = await throughRow.createAward({
      title: title,
      category: category,
      description: description,
      imgUrl: imgUrl,
      donationLimit: donationLimit,
      donationTotal: donationTotal
    })

    // Add first and last name to the nominee & set address
    // if nominee is signed up but does not have a public address available, use the nominator address
    if (userWasCreated) {
      const signUpPin = Math.floor(100000 + Math.random() * 900000)
      await nominee.update({
        firstName: firstName,
        lastName: lastName,
        signUpPin: signUpPin
      })
      //placeholder url until we create an identifier
      sendEmail(email, firstName, nominator.firstName)
      recipientAddress = nominator.ethPublicAddress
    } else {
      recipientAddress = nominee.ethPublicAddress
    }
    // Send award and recipient to our reducer.
    const result = {
      awardId: newAward.id,
      recipient: recipientAddress
    }
    res.json(result)
  } catch (err) {
    next(err)
  }
})

//email, 6 digit key salt hashing, joined t/f?,

//email link is generated using the hash and email,

//we can query our database,

//we can take the query params, based on it, check db, if true
//load form regardless

//email

//if valid key-pair, sign up, and they will be eligible an award

//otherwise regular signup

//in the database we want a hook

//hook should be before validation

//if user.pin DNE we do a math.random 6 digits

//user.update with math.random value

//await that entry into database

//if that passes, then send the email with pin.....

//user reads email- clicks to signup

//user should sign up using a special link /signup/nominee (front end)
//backend route = users/nominee

//enters pin on form

//when the user hits the post route (generic), we need to check if user previously existed or not

//if user existed, and doesnt provide a pin send error (nominee) ask to sign up with pin

//if user did not exist but tries to provide a pin send a error

//if user existed, and did provide a pin and its verified-great (nominee)

//if user didnt exist, and didnt provide a pin-great

//
