const router = require('express').Router()
const {User, Nomination, Award} = require('../db/models')
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
      nomineeEmail,
      nomineeFirst,
      nomineeLast,
      donationTotal
    } = req.body
    let recipientAddress
    // find or create the NOMINEE
    let [nominee, userWasCreated] = await User.findOrCreate({
      where: {email: nomineeEmail}
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
    if (userWasCreated) {
      await nominee.update({firstName: nomineeFirst, lastName: nomineeLast})
      recipientAddress = nominator.ethPublicAddress
    } else recipientAddress = nominee.ethPublicAddress

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
