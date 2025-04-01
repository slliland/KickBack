const { Pool } = require('pg');
require('dotenv').config();

// const pool = new Pool({
//   user: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   host: 'localhost',
//   port: 5432,
//   database: process.env.DB_NAME
// });
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;
