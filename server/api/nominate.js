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

    // find or create the NOMINEE
    let nominee = await User.findOrCreate({where: {email: nomineeEmail}})
    // Get nominee instance
    nominee = nominee[0]

    // T / F | New user
    let userWasCreated = nominee[1]
    // Add first and last name to the nominee

    if (userWasCreated) {
      await nominee.update({firstName: nomineeFirst, lastName: nomineeLast})
    }

    // Get noiminator Instance
    const nominator = await User.findOne({where: {id: nominatorId}})
    //
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

    let stuff = Award.findOne({
      where: {id: newAward.id},
      include: {
        model: Nomination,
        include: {
          model: User
        }
      }
    })

    res.json(stuff)
  } catch (err) {
    next(err)
  }
})
