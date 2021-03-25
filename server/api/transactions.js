const router = require('express').Router()
const {User, Nomination, Award, Transaction} = require('../db/models')

module.exports = router
//base path: /api/transactions
router.post('/', async (req, res, next) => {
  try {
    console.log('transaction api route -------------', req.body)
    const {userId, awardId, txnHash, amountEther, scAddress} = req.body
    console.log(txnHash)
    console.log(scAddress)
    //res.json(req)
    // findOrCreate transaction
    const txn = await Transaction.create({
      transactionHash: txnHash,
      smartContractAddress: scAddress,
      amountEther: amountEther
    })
    // find award -> txn.setAward(awardInst)
    const award = await Award.findByPk(awardId)
    txn.setAward(award)
    // find user -> IF USER EXISTS txn.setAward(userInst)
    if (userId) {
      const user = await User.findByPk(userId)
      txn.setUser(user)
    }
    res.status(201).json(txn)
  } catch (error) {
    next(error)
  }
})
