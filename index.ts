const express = require('express');
const app = express();
const port = 4000;

import {log} from './src/app';

app.get('/', (req, res) => {
  log('123');
  res.send('Hello World! xddd');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});