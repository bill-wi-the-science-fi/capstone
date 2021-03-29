const Sequelize = require('sequelize')
const db = require('../db')

const Award = db.define('award', {
  title: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false
  },
  category: {
    type: Sequelize.ENUM(
      'Open-Source',
      'Community',
      'Lifetime of Awesome',
      'Health and Wellness',
      'Volunteer',
      'Animals',
      'Heroic Act',
      'Enviornment',
      'Activism'
    ),
    unique: false,
    defaultValue: 'Community'
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
  // make default 2 weeks
  timeConstraint: {
    type: Sequelize.DATE,
    unique: false,
    allowNull: true,
    defaultValue: Date.now()
  },
  donationLimit: {
    type: Sequelize.STRING,
    defaultValue: 5
  },
  donationTotal: {
    type: Sequelize.STRING,
    unique: false,
    allowNull: false
  }
})

module.exports = Award
