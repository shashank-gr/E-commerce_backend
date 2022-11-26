const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../util/database");

const Order = sequelize.define("order", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
  },
  total: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

module.exports = Order;
