const Sequelize = require('sequelize');
const db = require('../db');

const Nomination = db.define('nomination', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false
  }
});

module.exports = Nomination;
