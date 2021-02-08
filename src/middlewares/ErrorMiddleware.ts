import { Request, Response, NextFunction } from 'express';

interface Error {
  statusCode: number,
  data: any,
  message: string,
}

const errorMiddleware = (error: Error, req: Request, res: Response, next: NextFunction) => {
  console.log('Error occured!', error, req.path);
  const { statusCode = 500, message, data = '' } = error;
  res.status(statusCode).json({ message, data: data.toString() });
  next();
};

export default errorMiddleware;
