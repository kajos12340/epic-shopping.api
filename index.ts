import express from "express";
const app = express();
const port = process.env.PORT || 4000;

import headerSetupMiddleware from "./src/middlewares/headerSetupMiddleware";

app.use(headerSetupMiddleware);

app.get('/*', (req, res) => {
  res.status(200)
    .json({ test: '123123 super' });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});



