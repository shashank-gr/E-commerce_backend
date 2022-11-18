const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const CartItem = sequelize.define("cartItem", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = CartItem;
