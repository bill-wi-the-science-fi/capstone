const router = require('express').Router();
const {Award, Nomination, User} = require('../db/models');
const {checkAwardRelation} = require('./securityMiddleware');
const {Op} = require('sequelize');
module.exports = router;
const buildContract = require('./Relayer/relayerToContract');

// get all awards
router.get('/', async (req, res, next) => {
  try {
    const awards = await Award.findAll({
      where: {
        open: 'open'
      }
    });
    res.json(awards);
  } catch (err) {
    next(err);
  }
});

router.get('/filter/:category', async (req, res, next) => {
  try {
    const {category} = req.params;
    console.log(category);
    const awards = await Award.findAll({
      where: {
        open: 'open',
        category: category
      }
    });
    res.status(200).send(awards);
  } catch (error) {
    next(error);
  }
});

// get one award
router.get('/:awardId', async (req, res, next) => {
  try {
    let {awardId} = req.params;
    const singleAward = await Award.findOne({
      where: {id: awardId}
    });
    const singleNomination = await Nomination.findOne({
      where: {id: singleAward.pairId},
      include: [{model: Award}]
    });
    const recipientOfAward = await User.findOne({
      where: {id: singleNomination.recipientId}
    });
    const giverOfAward = await User.findOne({
      where: {id: singleNomination.userId}
    });
    await singleAward.save();
    const sendBack = {
      award: singleAward,
      giver: giverOfAward,
      recipient: recipientOfAward
    };
    res.json(sendBack);
  } catch (err) {
    next(err);
  }
});

//change status of an open award to withdrawn after withdrawal of funds or donation reaches max limit
router.put('/:id/withdraw', checkAwardRelation, async (req, res, next) => {
  const {open} = req.body;
  try {
    let {id} = req.params;
    const singleAward = await Award.findOne({
      where: {id: id}
    });
    // make call to SC to expireAward
    const contract = buildContract();
    const txn = await contract.methods.expireAward(id).send();
    if (txn.status) {
      let result = await singleAward.update({open: open});
      res.json(result);
    } else {
      res.sendStatus(401);
    }
  } catch (err) {
    next(err);
  }
});

router.put('/:id/edit', checkAwardRelation, async (req, res, next) => {
  const {
    firstName,
    lastName,
    category,
    title,
    description,
    imageUrl
  } = req.body;

  try {
    let {id} = req.params;
    const singleAward = await Award.findOne({
      where: {id: id}
    });
    let result = await singleAward.update({
      firstName,
      lastName,
      category,
      title,
      description,
      imageUrl
    });

    res.json(result);
  } catch (err) {
    next(err);
  }
});

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
