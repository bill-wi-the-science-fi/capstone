const crypto = require('crypto')
const Sequelize = require('sequelize')
const db = require('../db')

const Award = db.define('award', {
  title: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false
  },
  category: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: true
  },
  open: {
    type: Sequelize.ENUM('open', 'closed'),
    allowNull: false,
    defaultValue: 'open'
  },
  description: {
    type: Sequelize.TEXT,
    unique: false,
    allowNull: true
  },
  imageUrl: {
    type: Sequelize.TEXT,
    unique: false,
    defaultValue:
      'https://media.npr.org/assets/img/2015/10/16/undefined_wide-3e974801314a154e108c3ed9c07f501ad477e14b.jpg'
  },
  timeConstraint: {
    type: Sequelize.DATE,
    unique: false,
    allowNull: true,
    defaultValue: Date.now()
  },
  donationLimit: {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: false
  },
  donationTotal: {
    type: Sequelize.INTEGER,
    unique: false,
    allowNull: false
  }
})

module.exports = Award
