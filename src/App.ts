import express, { Application, RequestHandler, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';

import IController from "./interfaces/IController";

interface IAppSettings {
  middlewares: RequestHandler[],
  controllers: IController[],
  errorMiddlewares: ErrorRequestHandler[],
}

class App {
  public app: Application;
  public port: number;

  constructor(appSettings: IAppSettings) {
    this.app = express();
    this.port = process.env.PORT ? +process.env.PORT : 4000;

    this.setupMiddlewares(appSettings.middlewares);
    this.setupControllers(appSettings.controllers);
    this.setupErrorMiddleware(appSettings.errorMiddlewares);
  }

  private setupMiddlewares(middlewares: RequestHandler[]) {
    middlewares.forEach(middleware => {
        this.app.use(middleware);
      }
    );
  }

  private setupControllers(controllers: IController[]) {
    controllers.forEach(controller => {
      this.app.use(controller.path, controller.router);
    });
  }

  private setupErrorMiddleware(errorMiddlewares: ErrorRequestHandler[]) {
    errorMiddlewares.forEach(middleware => {
        this.app.use(middleware);
      }
    );
  }

  public run() {
    mongoose.connect(`mongodb+srv://liftit:${process.env.MONGO_DB_PASSWORD}@cluster0-1gapf.mongodb.net/shopper?retryWrites=true&w=majority`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      })
      .then(() => {
        console.log('Mongoose connected! App running on ', this.port);
        this.app.listen(this.port);
      }).catch(err => {
      console.log('Moongoose connection error: ', err);
    });
  }
}

export default App;