const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');

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
      return () => this.getDataValue('password');
    }
  },
  pin: {
    type: Sequelize.STRING,
    // Making `.pin` act like a func hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('pin');
    }
  },
  salt: {
    type: Sequelize.STRING,
    // Making `.salt` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('salt');
    }
  },
  saltpin: {
    type: Sequelize.STRING,
    // Making `.saltpin` act like a function hides it when serializing to JSON.
    // This is a hack to get around Sequelize's lack of a "private" option.
    get() {
      return () => this.getDataValue('saltpin');
    }
  },
  googleId: {
    type: Sequelize.STRING
  },
  ethPublicAddress: {
    type: Sequelize.STRING,
    unique: false,
    defaultValue: null
  },
  imageUrl: {
    type: Sequelize.STRING,
    unique: false,
    defaultValue:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Oxygen480-emotes-face-smile-big.svg/1200px-Oxygen480-emotes-face-smile-big.svg.png'
  }
});

module.exports = User;

/**
 * instanceMethods
 */
User.prototype.correctPassword = function (candidatePwd) {
  return User.encryptPassword(candidatePwd, this.salt()) === this.password();
};

User.prototype.correctPin = function (candidatePin) {
  return User.encryptPin(candidatePin, this.saltpin()) === this.pin();
};

/**
 * classMethods
 */
User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};
User.generatePinSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};

User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};
User.encryptPin = function (plainText, saltpin) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(saltpin)
    .digest('hex');
};

/**
 * hooks
 */
const setSaltAndPassword = (user) => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};
const setsaltpinAndPin = (user) => {
  if (user.changed('pin')) {
    user.saltpin = User.generatePinSalt();
    user.pin = User.encryptPin(user.pin(), user.saltpin());
  }
};

User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword);
});
User.beforeCreate(setsaltpinAndPin);
User.beforeUpdate(setsaltpinAndPin);
User.beforeBulkCreate((users) => {
  users.forEach(setsaltpinAndPin);
});
