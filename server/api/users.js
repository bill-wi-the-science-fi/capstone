const router = require('express').Router();
const {User} = require('../db/models');
module.exports = router;

// getAllNominees thunk
router.get('/', async (req, res, next) => {
  try {
    const users = await User.findAll({
      // explicitly select only the id and email fields - even though
      // users' passwords are encrypted, it won't help if we just
      // send everything to anyone who asks!
      attributes: ['id', 'email']
    });
    res.json(users);
  } catch (err) {
    next(err);
  }
});

// Attached to the form for "sign up" new user.
// need to add logged in middleware for protection.
router.post('/', async (req, res, next) => {
  try {
    const {email, firstName, lastName, ethPublicAddress, password} = req.body;
    let newUser = await User.findOrCreate({
      where: {
        email: email,
        firstName: firstName,
        lastName: lastName,
        ethPublicAddress: ethPublicAddress,
        password: password
      }
    });
    newUser = newUser[0];
    res.json(newUser);
  } catch (err) {
    next(err);
  }
});
