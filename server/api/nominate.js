const router = require('express').Router()
const {User, Nomination} = require('../db/models')
module.exports = router

// nominateUser thunk
// this will be the route attatched to the "nominate" form on the front end
router.post('/', async (req, res, next) => {
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
    // find or create the NOMINEE
    let nominee = await User.findOrCreate({where: {email: email}})
    // T / F | New user
    let userWasCreated = nominee[1]
    // Get nominee instance
    nominee = nominee[0]
    // Get noiminator Instance
    const nominator = await User.findOne({where: {id: nominatorUserID}})
    //
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
    res.json(newAward)
  } catch (err) {
    next(err)
  }
})
