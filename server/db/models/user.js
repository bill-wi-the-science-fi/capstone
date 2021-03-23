const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const User = db.define('user', {
  firstName: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true
  },
  lastName: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false
  },
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('password')
    }
  },
  signUpPin: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('signUpPin')
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt')
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  ethPublicAddress: {
    type: Sequelize.STRING,
    unique: false,
    defaultValue: '0x76a992fdc12221DEade9b0c299C3deDde5414f7d'
  },
  imgUrl: {
    type: Sequelize.STRING,
    unique: false,
    defaultValue:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Oxygen480-emotes-face-smile-big.svg/1200px-Oxygen480-emotes-face-smile-big.svg.png'
  }
})

module.exports = User

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password()
}

User.prototype.correctSignUpPin = function (candidatePin) {
  return User.encryptSignUpPin(candidatePin, this.salt()) === this.signUpPin()
}

/**
 * classMethods
 */
User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64')
}

User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}
User.encryptSignUpPin = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex')
}

/**
 * hooks
 */
const setSaltAndPassword = (user) => {
  if (user.changed('password')) {
    user.salt = User.generateSalt()
    user.password = User.encryptPassword(user.password(), user.salt())
  }
}
const setSignUpPin = (user) => {
  if (user.changed('signUpPin')) {
    user.signUpPin = User.encryptSignUpPin(user.signUpPin(), user.salt())
  }
}

User.beforeCreate(setSaltAndPassword)
User.beforeUpdate(setSaltAndPassword)
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword)
})
User.beforeCreate(setSignUpPin)
User.beforeUpdate(setSignUpPin)
User.beforeBulkCreate((users) => {
  users.forEach(setSignUpPin)
})
