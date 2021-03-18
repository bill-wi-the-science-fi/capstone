const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Nomination = db.define('nomination', {})

module.exports = Nomination
