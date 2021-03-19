const router = require('express').Router()
const {Award, Nomination} = require('../db/models')
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
    const singleAward = await Award.findOne({where: {id: awardId}})
    res.json(singleAward)
  } catch (err) {
    next(err)
  }
})

// edit award

// router.put('/', async (req, res, next) => {
//   try {
//     let {nominatorUserID, nomineeEmail} = req.body
//     const nominee = User.findOne({where: {email: nomineeEmail}})
//     const newAward = await Award.find()
//     res.json(newAward)
//   } catch (err) {
//     next(err)
//   }
// })
