import express from "express";
const app = express();
const port = process.env.PORT || 4000;

import headerSetupMiddleware from "./src/middlewares/headerSetupMiddleware";
import { log } from './src/app';

app.use(headerSetupMiddleware);

app.get('/*', (req, res) => {
  log('123');
  res.status(200)
    .json({ test: '123123 super' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



