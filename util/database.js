//using sequelize

const { Sequelize } = require("sequelize");
const sequelize = new Sequelize("node-project", "root", "Rockergr@7", {
  host: "localhost",
  dialect: "mysql",
}); // creates a connnection pool to the DB in the back

module.exports = sequelize;

// //for connecting with MySQL DB
// const mysql = require("mysql2");
// const pool = mysql.createPool({
//   host: "localhost",
//   user: "root",
//   database: "node-project",
//   password: "Rockergr@7",
// });

// module.exports = pool.promise();
