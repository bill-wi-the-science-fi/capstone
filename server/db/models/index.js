const User = require('./user')
const Transaction = require('./transaction')
const Award = require('./award')
const Nomination = require('./nomination')

/**
 * If we had any associations to make, this would be a great place to put them!
 * ex. if we had another model called BlogPost, we might say:
 *
 *    BlogPost.belongsTo(User)
 */

/**
 * We'll export all of our models here, so that any time a module needs a model,
 * we can just require it from 'db/models'
 * for example, we can say: const {User} = require('../db/models')
 * instead of: const User = require('../db/models/user')
 */

// User.belongsToMany(User, {as: 'nominee', through: 'nomination'})
User.belongsToMany(User, {as: 'recipient', through: 'nomination'})

Nomination.hasMany(Award, {foreignKey: 'recipientId'})

User.hasMany(Award)
Award.belongsTo(User)

Award.hasMany(Transaction)
Transaction.belongsTo(Award)

User.hasMany(Transaction)
Transaction.belongsTo(User)

// These will print all magic methods for a model!
const userModel = User
console.log('\n\nUser model can use:\n\n')
for (let assoc of Object.keys(userModel.associations)) {
  for (let accessor of Object.keys(userModel.associations[assoc].accessors)) {
    console.log(
      userModel.name +
        '.' +
        userModel.associations[assoc].accessors[accessor] +
        '()'
    )
  }
}

// These will print all magic methods for a model!
const awardModel = Award
console.log('\n\nAward model can use:\n\n')
for (let assoc of Object.keys(awardModel.associations)) {
  for (let accessor of Object.keys(awardModel.associations[assoc].accessors)) {
    console.log(
      awardModel.name +
        '.' +
        awardModel.associations[assoc].accessors[accessor] +
        '()'
    )
  }
}

// These will print all magic methods for a model!
const transactionModel = Transaction
console.log('\n\nTransaction model can use:\n\n')
for (let assoc of Object.keys(transactionModel.associations)) {
  for (let accessor of Object.keys(
    transactionModel.associations[assoc].accessors
  )) {
    console.log(
      transactionModel.name +
        '.' +
        transactionModel.associations[assoc].accessors[accessor] +
        '()'
    )
  }
}

const nominationModel = Nomination
console.log('\n\nNomination model can use:\n\n')
for (let assoc of Object.keys(nominationModel.associations)) {
  for (let accessor of Object.keys(
    nominationModel.associations[assoc].accessors
  )) {
    console.log(
      nominationModel.name +
        '.' +
        nominationModel.associations[assoc].accessors[accessor] +
        '()'
    )
  }
}

module.exports = {
  User,
  Transaction,
  Award,
  Nomination,
}
