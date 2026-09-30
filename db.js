const db = require('mysql2/promise');
const loadConfig = require('./configLoader');

const config = loadConfig();

const pool = db.createPool({
  host: config.database.host,
  user: config.database.username,
  password: config.database.password,
  port: config.database.port,
  database: config.database.dbname,
  queueLimit: 10,
  connectionLimit: 10,
});

module.exports = pool;
