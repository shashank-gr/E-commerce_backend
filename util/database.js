//for connecting with MySQL DB
const mysql = require("mysql2");
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-project",
  password: "Rockergr@7",
});

module.exports = pool.promise();
