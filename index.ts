import bodyParser from "body-parser";

import App from './src/app';

import AuthController from "./src/controllers/AuthController";

import headerSetupMiddleware from "./src/middlewares/headerSetupMiddleware";
import errorMiddleware from "./src/middlewares/errorMiddleware";

const app = new App({
  middlewares: [
    bodyParser.urlencoded({
      extended: true,
    }),
    bodyParser.json(),
    headerSetupMiddleware,
  ],
  controllers: [
    new AuthController(),
  ],
  errorMiddlewares: [
    errorMiddleware,
  ]
});

// app.use(headerSetupMiddleware);
//
// app.get('/*', (req, res) => {
//   res.status(200)
//     .json({ test: '123123 super' });
// });
//
// app.listen(port, () => {
//   console.log(`Example app listening at http://localhost:${port}`);
// });



