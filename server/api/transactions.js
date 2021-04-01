const router = require('express').Router()
const {User, Award, Transaction} = require('../db/models')
const {isLoggedIn} = require('./securityMiddleware')
const web3 = require('web3')

module.exports = router
//base path: /api/transactions
//Will need logged in route protection plus more???

router.post('/', async (req, res, next) => {
  try {
    let {
      // userId,
      awardId,
      transactionHash,
      amountWei,
      smartContractAddress
      // recipientEmail
    } = req.body
    // findOrCreate transaction
    const txn = await Transaction.create({
      transactionHash,
      smartContractAddress,
      amountWei
    })
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
    //based on trying to donate to seed data (award<100) or a newly created award
    // if (awardId > 100) {
    //   awardId = awardId
    // }
    // find award -> txn.setAward(awardInst)
    // const singleAward = await Award.findByPk(awardId)
    // pair id
    // award id
    const recipient = await User.findOne({
      where: {
        email: recipientEmail
      }
    })
    const updatesToAward = {
      donationTotal: singleAward.donatationTotal
    }
    // if it's there, that means its a new award donation, and the smart contract is established, so we can move it's status to pending.
    if (!recipient.ethPublicAddress) {
      updatesToAward.open = 'pending'
    } else {
      updatesToAward.open = 'open'
    }
    //We need to figure out
    //update amount award instance property of donationTotal with the current donation
    let newDonationTotal = web3.utils
      .toBN(amountWei)
      .add(web3.utils.toBN(singleAward.donationTotal))
      .toString()
    updatesToAward.donationTotal = newDonationTotal
    await singleAward.update(updatesToAward)
    txn.setAward(singleAward)
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

// router.post('/', async (req, res, next) => {
//   try {
//     let {
//       awardId,
//       transactionHash,
//       amountWei,
//       smartContractAddress,
//       // userId,
//       // recipientEmail,
//       sender
//     } = req.body
//     const donator = await User.findOne({
//       where: {
//         ethPublicAddress: sender
//       }
//     })

//     // findOrCreate transaction
//     const txn = await Transaction.create({
//       transactionHash,
//       smartContractAddress,
//       amountWei
//     })
//     //based on trying to donate to seed data (award<100) or a newly created award
//     // if (awardId > 100) {
//     //   awardId = awardId
//     // }

//     // find award -> txn.setAward(awardInst)
//     const award = await Award.findByPk(awardId)
//     const recipient = await User.findOne({
//       where: {
//         email: recipientEmail
//       }
//     })

//     const updatesToAward = {
//       donationTotal: award.donatationTotal
//     }

//     // if it's there, that means its a new award donation, and the smart contract is established, so we can move it's status to pending.
//     if (!recipient.ethPublicAddress) {
//       updatesToAward.open = 'pending'
//     } else {
//       updatesToAward.open = 'open'
//     }

//     //We need to figure out

//     //update amount award instance property of donationTotal with the current donation
//     let newDonationTotal = web3.utils
//       .toBN(amountWei)
//       .add(web3.utils.toBN(award.donationTotal))
//       .toString()
//     updatesToAward.donationTotal = newDonationTotal

//     await award.update(updatesToAward)

//     txn.setAward(award)
//     // find user -> IF USER EXISTS txn.setAward(userInst)
//     if (userId) {
//       const user = await User.findByPk(userId)
//       txn.setUser(user)
//     }
//     res.status(201).json(txn)
//   } catch (error) {
//     next(error)
//   }
// })
