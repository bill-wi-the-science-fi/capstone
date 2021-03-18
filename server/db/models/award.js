const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Award = db.define('award', {
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
})

module.exports = Award
