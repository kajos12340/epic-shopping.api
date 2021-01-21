import { Router, Request, Response } from "express";
import IController from "../interfaces/IController";

class AuthController implements IController{
  path = '/auth';
  router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/user-data', this.getUserData);

    this.router.post('/login', this.login);
  }

  // eslint-disable-next-line class-methods-use-this
  private login(req: Request, res: Response) {
    const { login, password } = req.body;
    console.log('POST: login', login, password);
    res.status(200).json({
      token: 'hehehehehehehehe'
    });
  }

  private getUserData(req: Request, res: Response) {
    const { userId } = req.query;
    console.log('GET: getUserData', userId);
    res.status(200).json({
      name: 'Piotr',
      surname: 'Kajka'
    });
  }
}

export default AuthController;