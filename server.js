const express = require('express');
const app = express();
const loadConfig = require('./configLoader');
const pool = require('./db');

const config = loadConfig();
const port = config.port;

app.get('/', (req, res) => {
  res.send("test");
});

app.get('/:short', async (req, res)=>{
  const { short } = req.params;
  const [result] = await pool.query("SELECT * FROM `urls` WHERE `shorter_address` = ?", [ short, ])
  return result && result.length > 0 ? res.redirect(result[0].real_address) : res.send(404);
});

app.listen(port, '0.0.0.0', ()=>{
  console.log(`server is running on port ${port}`);
});