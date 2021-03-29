const router = require('express').Router()
const {User, Nomination, Award, Transaction} = require('../db/models')
const {isLoggedIn, checkAwardRelation} = require('./securityMiddleware')
const web3 = require('web3')

module.exports = router
//base path: /api/transactions
//Will need logged in route protection plus more???

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    let {
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
      amountWei: amountEther
    })
    //based on trying to donate to seed data (award<100) or a newly created award
    if (awardId > 100) {
      awardId = awardId - 200
    }

    // find award -> txn.setAward(awardInst)
    const award = await Award.findByPk(awardId)

    //update amount award instance property of donationTotal with the current donation
    award.donatationTotal = web3.utils
      .toBN(amountEther)
      .add(web3.utils.toBN(award.donationTotal))
      .toString()
    await award.update({donationTotal: award.donatationTotal})

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
