import { Router } from 'express';

interface IController {
  router: Router,
  path: string,
  initRoutes: Function,
}

export default IController;
