const express = require('express');
const app = express();
const path = require('path');
const loadConfig = require('./configLoader');
const pool = require('./db');

const config = loadConfig();
const port = config.port;

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.get('/:short', async (req, res)=>{
  const { short } = req.params;
  const [result] = await pool.query("SELECT * FROM `urls` WHERE `shorter_address` = ?", [ short, ])
  return result && result.length > 0 ? res.redirect(result[0].real_address) : res.sendFile(path.join(__dirname, 'public', 'undefind.html'));
});

app.listen(port, '0.0.0.0', ()=>{
  console.log(`server is running on port ${port}`);
});