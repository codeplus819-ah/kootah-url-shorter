const express = require('express');
const app = express();
const loadConfig = require('./configLoader');

const config = loadConfig();
const port = config.port;

app.get('/', (req, res) => {
  res.send("test");
});

app.listen(port, '0.0.0.0', ()=>{
  console.log(`server is running on port ${port}`);
});