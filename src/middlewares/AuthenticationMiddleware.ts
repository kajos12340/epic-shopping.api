import { Request, Response } from 'express';

import JwtUtils from '../utils/JwtUtils';

const headerSetupMiddleware = (anonymousRoutes: string[]) => (
  req: Request, res: Response, next: Function,
) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!anonymousRoutes.includes(req.url) && !JwtUtils.verifyToken(token)) {
      throw new Error();
    }
    next();
  } catch (e) {
    res.status(401).send();
  }
};

export default headerSetupMiddleware;
