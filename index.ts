const express = require('express');
const app = express();
const port = 4000;

import {log} from './src/app';

app.get('/*', (req, res) => {
  log('123');
  res.status(200)
    .json({ test: '123123 super' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});