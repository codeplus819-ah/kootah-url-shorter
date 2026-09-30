const express = require('express');
const app = express();
const path = require('path');
const crypto = require('crypto');
const loadConfig = require('./configLoader');
const pool = require('./db');
const base62 = require('./base62')

const config = loadConfig();
const port = config.port;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
});

app.post('/api/add-address', async (req, res)=>{
  const { address, } = req.body;
  if (address) {
    const [result] = await pool.query("SELECT * FROM `urls` WHERE `real_address` = ?", [ address, ])
    if (result && result.length > 0) {
      const short = base62.encode(result[0].id);
      return res.status(200).json({ status: 'success', shortAddress: `${short}` })
    } else {
      const [added] = await pool.query("INSERT INTO `urls`(`real_address`) VALUES (?)", [address]);
      const short = base62.encode(added.insertId);
      return res.status(200).json({ status: 'success', shortAddress: `${short}` })
    }
  } else {
    return res.status(422).json({ status: 'error' });
  }
});

app.get('/:short', async (req, res)=>{
  const { short } = req.params;
  console.log(short);
  const id = base62.decode(short);
  console.log(id);
  const [result] = await pool.query("SELECT * FROM `urls` WHERE `id` = ?", [ id, ])
  return result && result.length > 0 ? res.redirect(result[0].real_address) : res.sendFile(path.join(__dirname, 'public', 'undefind.html'));
});

app.listen(port, '0.0.0.0', ()=>{
  console.log(`server is running on port ${port}`);
});