const mysql = require("mysql2/promise"); // Use promise-based API
require('dotenv').config({ path: '../.env.dev' });

const promisePool = mysql.createPool({
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  port: process.env.MYSQL_PORT
});

// Check database connection
(async () => {
  try {
    const connection = await promisePool.getConnection();
    console.log("Connected to the database successfully!");
    connection.release(); // Release the connection back to the pool
  } catch (err) {
    console.error("Database connection failed:", err.message);
  }
})();

module.exports = { promisePool };
