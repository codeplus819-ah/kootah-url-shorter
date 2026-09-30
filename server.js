const express = require('express');
const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.send("test");
});

app.listen(port, '0.0.0.0', ()=>{
  console.log(`server is running on port ${port}`);
});