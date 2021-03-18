const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Transaction = db.define('transaction', {
  tid: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
})

module.exports = Transaction
