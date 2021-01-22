import { Router, Request, Response } from "express";

import IController from "../../interfaces/IController";
import JwtUtils from '../../utils/JwtUtils';

class AuthController implements IController{
  public path = '/auth';
  public router = Router();

  constructor() {
    this.initRoutes();
  }

  initRoutes() {
    this.router.get('/user-data', this.getUserData);

    this.router.post('/login', this.login);
  }

  private login(req: Request, res: Response) {
    const { login, password } = req.body;
    console.log('POST: login', login, password);
    const token = JwtUtils.createToken(login);
    res.status(200).json({
      token,
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