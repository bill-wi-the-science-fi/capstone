const router = require('express').Router()
const {User, Nomination} = require('../db/models')
module.exports = router

// getAllNominees thunk
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    })
    res.json(users)
  } catch (err) {
    next(err)
  }
})

// Attached to the form for "sign up" new user.

router.post('/', async (req, res, next) => {
  console.log('\n --------🚀 \n router.post \n req.body', req.body)
  try {
    const {email, firstName, lastName, ethPublicAddress, password} = req.body
    let newUser = await User.findOrCreate({
      where: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        ethPublicAddress: ethPublicAddress,
        password: password
      }
    })
    newUser = newUser[0]
    res.json(newUser)
  } catch (err) {
    next(err)
  }
})

// nominateUser thunk
// this will be the route attatched to the "nominate" form on the front end
router.post('/nominate', async (req, res, next) => {
  try {
    const {
      title,
      category,
      description,
      nominatorUserID,
      email,
      timeConstraint,
      donationLimit,
      donationTotal,
      img
    } = req.body
    let nominee = await User.findOrCreate({where: {email: email}})
    //If they are found, we have an address, if created, we don't.
    let userWasCreated = nominee[1] //false means they existed already
    nominee = nominee[0]
    //

    const nominator = await User.findOne({where: {id: nominatorUserID}})
    await nominator.addRecipient(nominee)
    let throughRow = await Nomination.findOne({
      where: {userId: nominator.id, recipientId: nominee.id}
    })
    const newAward = await throughRow.createAward({
      title: title,
      category: category,
      description: description,
      timeConstraint: timeConstraint,
      donationLimit: donationLimit,
      donationTotal: donationTotal,
      img: img
    })
    //Send additonal info where we want to (like AwardID, recipient address)

    //send user instead

    res.json(newAward)
  } catch (err) {
    next(err)
  }
})
