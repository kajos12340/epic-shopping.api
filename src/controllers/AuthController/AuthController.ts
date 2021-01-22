import { Router, Request, Response, NextFunction } from "express";

import IController from "../../interfaces/IController";
import JwtUtils from '../../utils/JwtUtils';
import User from '../../models/User/User';

class AuthController implements IController{
  public path = '/auth';
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/user-data', this.getUserData);

    this.router.post('/login', this.login);

    this.router.post('/register', this.register);
  }

  private async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password } = req.body;

      const user = await User.logIn(login, password);

      if (!user) {
        throw new Error('NO_USER');
      }

      const token = JwtUtils.createToken(user.login);
      res.status(200).json({
        token,
      });
    } catch (e) {
      console.log(e.message);
      let message = "Could not log in the user!";
      let statusCode = 400;
      if (e.message === 'NO_USER') {
        statusCode = 401;
        message = "There is no user for given data.";
      }

      next({
        statusCode,
        data: e,
        message,
      });
    }
  }

  private getUserData(req: Request, res: Response) {
    // TODO
  }

  private async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password,  } = req.body;
      console.log('POST: register', login, password);

      const currentDate = new Date();

      const user = await User.register({
        password,
        login,
        registrationDate: currentDate,
      });

      if (user) {
        res.status(202).send();
      }
    } catch (e) {
      let message = "Could not register the user!";
      let statusCode = 400;
      if (e.message.includes('E11000')) {
        statusCode = 409;
        message = "User with given login already exists.";
      }

      next({
        statusCode,
        data: e,
        message,
      });
    }
  }
}

export default AuthController;