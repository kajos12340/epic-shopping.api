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
    this.router.get('/get-user-data', this.getUserData);

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

      const token = JwtUtils.createToken(user.login, user._id);
      res.status(200).json({
        token,
        email: user.email,
        id: user._id,
        login: user.login,
      });
    } catch (e) {
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

  private async getUserData(req: Request, res: Response, next: NextFunction) {
    try {
      const token = req.headers.authorization;
      const userId = JwtUtils.getUserId(token);

      const user = await User.findById(userId);

      if (!user) {
        throw new Error('NO_USER');
      }

      res.status(200).json({
        email: user.email,
        id: user._id,
        login: user.login,
      });
    } catch (e) {
      next({
        statusCode: 400,
        data: e,
        message: 'No user for given token',
      });
    }
  }

  private async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { login, password, email, repassword } = req.body;

      const currentDate = new Date();

      if (password !== repassword) {
        throw new Error("PASSWORD_DONT_MATCH");
      }

      const user = await User.register({
        password,
        login,
        email,
        registrationDate: currentDate,
      });

      if (user) {
        res.status(202).send();
      }
    } catch (e) {
      let message = "Could not register the user!";
      let statusCode = 400;
      if (e.message === 'PASSWORD_DONT_MATCH') {
        message = "Passwords must be the same.";
      } else if (e.message.includes('E11000')) {
        statusCode = 409;
        message = "User with given login or email already exists.";
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