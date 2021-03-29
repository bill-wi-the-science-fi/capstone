const router = require('express').Router()
const {Award, Nomination, User} = require('../db/models')
const {checkAwardRelation} = require('./securityMiddleware')
const {Op} = require('sequelize')
module.exports = router

// get all awards
router.get('/', async (req, res, next) => {
  try {
    const awards = await Award.findAll()
    res.json(awards)
  } catch (err) {
    next(err)
  }
})

// get one award
router.get('/:awardId', async (req, res, next) => {
  try {
    let {awardId} = req.params
    const singleAward = await Award.findOne({
      where: {id: awardId}
    })
    const singleNomination = await Nomination.findOne({
      where: {id: singleAward.pairId},
      include: [{model: Award}]
    })
    const recipientOfAward = await User.findOne({
      where: {id: singleNomination.recipientId}
    })
    const giverOfAward = await User.findOne({
      where: {id: singleNomination.userId}
    })
    await singleAward.save()
    const sendBack = {
      award: singleAward,
      giver: giverOfAward,
      recipient: recipientOfAward
    }
    res.json(sendBack)
  } catch (err) {
    next(err)
  }
})

router.get('/userawards/:id', async (req, res, next) => {
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
      }
    })

    // const results = await Nomination.findAll({
    //   where: {recipientId: req.params.id},
    //   include: {
    //     model: Award
    //   }
    // })

    res.json(awards)
  } catch (err) {
    next(err)
  }
})

// edit award

// router.put('/', checkAwardRelation, async (req, res, next) => {
//   try {
//     let {nominatorUserID, nomineeEmail} = req.body
//     const nominee = User.findOne({where: {email: nomineeEmail}})
//     const newAward = await Award.find()
//     res.json(newAward)
//   } catch (err) {
//     next(err)
//   }
// })
