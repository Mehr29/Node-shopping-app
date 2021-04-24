const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Product = sequelize.define('cartItem', {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true
  },
  quantity:Sequelize.INTEGER
});

module.exports = Product;
