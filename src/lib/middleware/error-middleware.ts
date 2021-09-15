import express from 'express';
import ErrorHandler from '../helpers/error-handler';

export const errorMiddleware = (
  err: ErrorHandler,
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const {
    statusCode = 500,
    message = 'Internal server error',
    errors = null,
  } = err;

  res.status(statusCode).send({
    statusCode,
    message,
    data: null,
    errors,
  });
};
