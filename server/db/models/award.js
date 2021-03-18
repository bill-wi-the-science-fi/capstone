const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Award = db.define('award', {
  title: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
  },
  category: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: true,
  },
  open: {
    type: Sequelize.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open',
  },
  description: {
    type: Sequelize.TEXT,
    unique: true,
    allowNull: true,
  },
  imageUrl: {
    type: Sequelize.TEXT,
    unique: false,
    defaultValue:
      'https://media.npr.org/assets/img/2015/10/16/undefined_wide-3e974801314a154e108c3ed9c07f501ad477e14b.jpg',
  },
  timeConstraint: {
    type: Sequelize.TEXT,
    unique: false,
    defaultValue:
      'https://media.npr.org/assets/img/2015/10/16/undefined_wide-3e974801314a154e108c3ed9c07f501ad477e14b.jpg',
  },
})

module.exports = Award
