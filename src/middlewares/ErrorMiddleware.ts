import { Request, Response, NextFunction } from 'express';

interface Error {
  statusCode: number,
  data: any,
  message: string,
}

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Error occured!', error, req.path);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data || '';
  res.status(status).json({ message, data: data.toString() });
  next();
};

export default errorMiddleware;
