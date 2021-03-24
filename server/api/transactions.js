const router = require('express').Router()
const {User, Nomination, Award} = require('../db/models')

module.exports = router
//base path: /api/transactions
router.post('/', (req, res, next) => {
  try {
    console.log('transaction api route -------------', req.body)
    // let body = {userId, awardId, txnHash, amountEther, scAddress}
    //res.json(req)
    // findOrCreate transaction

    // find award -> txn.setAward(awardInst)

    // find user -> IF USER EXISTS txn.setAward(userInst)
  } catch (error) {
    next(error)
  }
})
