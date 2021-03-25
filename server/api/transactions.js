const router = require('express').Router()
const {User, Nomination, Award, Transaction} = require('../db/models')

module.exports = router
//base path: /api/transactions
router.post('/', async (req, res, next) => {
  try {
    const {
      userId,
      awardId,
      transactionHash,
      amountEther,
      smartContractAddress
    } = req.body
    // findOrCreate transaction
    const txn = await Transaction.create({
      transactionHash,
      smartContractAddress,
      amountEther
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
