import bodyParser from "body-parser";
import dotenv from 'dotenv';

import App from './src/App';

import AuthController from "./src/controllers/AuthController/AuthController";

import ShoppingListController from './src/controllers/ShoppingListController/ShoppingListController';
import MessagesController from "./src/controllers/MessagesController/MessagesController";

import HeaderSetupMiddleware from "./src/middlewares/HeaderSetupMiddleware";
import ErrorMiddleware from "./src/middlewares/ErrorMiddleware";
import AuthenticationMiddleware from './src/middlewares/AuthenticationMiddleware';

dotenv.config();

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
    MessagesController,
  ],
  errorMiddlewares: [
    ErrorMiddleware,
  ]
});

app.run();
