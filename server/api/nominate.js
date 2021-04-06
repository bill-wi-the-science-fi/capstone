const router = require('express').Router();
const {User, Nomination, Award} = require('../db/models');
const sendEmail = require('../email/email');
const {isLoggedIn} = require('./securityMiddleware');

module.exports = router;

// nominateUser thunk
// this will be the route attatched to the "nominate" form on the front end
router.post('/', isLoggedIn, async (req, res, next) => {
  console.log('jerico ocnsole logs');
  try {
    const {
      title,
      category,
      description,
      imageUrl,
      donationLimit,
      nominatorId,
      email,
      firstName,
      lastName,
      donationTotal,
      currentURL
    } = req.body;
    let openOrClosed = 'closed';
    let recipientAddress;
    // find or create the NOMINEE
    let [nominee, userWasCreated] = await User.findOrCreate({
      where: {email: email}
    });

    // Get noiminator Instance
    const nominator = await User.findOne({where: {id: nominatorId}});

    await nominator.addRecipient(nominee);

    let throughRow = await Nomination.findOne({
      where: {userId: nominator.id, recipientId: nominee.id}
    });
    //since donation is pending, donationtotal is set to zero, when transaction is accepted on blockchain,donationtotal will update

    const awardInfoToCreate = {
      title: title,
      category: category,
      description: description,
      imageUrl: imageUrl,
      donationLimit: donationLimit,
      donationTotal: '1',
      open: 'pending'
    };

    const newAward = await throughRow.createAward(awardInfoToCreate);

    // Add first and last name to the nominee & set address
    // if nominee is signed up but does not have a public address available, use the nominator address
    if (userWasCreated) {
      let pin = Math.floor(100000 + Math.random() * 900000);
      pin = pin.toString();
      await nominee.update({
        firstName: firstName,
        lastName: lastName,
        pin: pin
      });
      //placeholder url until we create an identifier
      let UserPin = nominee.pin();

      const inviteUrl = `${currentURL}signup?email=${email}&pin=${UserPin}`;

      sendEmail(email, firstName, nominator.firstName, inviteUrl);
      recipientAddress = nominator.ethPublicAddress;
    } else if (nominee.ethPublicAddress === null) {
      recipientAddress = nominator.ethPublicAddress;
    } else {
      recipientAddress = nominee.ethPublicAddress;
    }
    // Send award and recipient to our reducer.
    const result = {
      // WORKAROUND UNITL WE WIPE ETH CONTRACT db is not synced with smart contract
      awardId: newAward.id,
      recipient: recipientAddress,
      imageUrl: imageUrl
    };
    res.json(result);
  } catch (err) {
    next(err);
  }
});
