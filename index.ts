import bodyParser from "body-parser";
import dotenv from 'dotenv';

import App from './src/App';

import AuthController from "./src/controllers/AuthController/AuthController";

import ShoppingListController from './src/controllers/ShoppingListController/ShoppingListController';

import HeaderSetupMiddleware from "./src/middlewares/HeaderSetupMiddleware";
import ErrorMiddleware from "./src/middlewares/ErrorMiddleware";
import AuthenticationMiddleware from './src/middlewares/AuthenticationMiddleware';

dotenv.config();

console.log('process.env.JWT_SECRET', process.env.JWT_SECRET);

const allowedAnonymousRoutes = [
  '/auth/login',
  '/auth/register',
  '/test'
];

const app = new App({
  middlewares: [
    bodyParser.urlencoded({
      extended: true,
    }),
    bodyParser.json(),
    HeaderSetupMiddleware,
    AuthenticationMiddleware(allowedAnonymousRoutes),
  ],
  controllers: [
    new AuthController(),
  ],
  socketControllers: [
    ShoppingListController,
  ],
  errorMiddlewares: [
    ErrorMiddleware,
  ]
});

app.run();
