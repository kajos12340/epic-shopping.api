import { Router } from "express";
import IController from "../interfaces/IController";

class AuthController implements IController{
  path = '/auth';
  router = Router();


}

export default AuthController;