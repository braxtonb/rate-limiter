import express from 'express';
import { validationResult, param } from 'express-validator';
import ErrorHandler from '../../lib/helpers/error-handler';

export const validateGetPersonByIdRules = [
  // PARAMS
  // required
  param('id')
    .isAlphanumeric()
    .withMessage('Person ID is a required alphanumeric parameter'),
];

export const validatePersonRules = (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      console.error(
        `[validatePersonRules] invalid person resource request error=${JSON.stringify(
          errors.array(),
          null,
          2,
        )}`,
      );
      throw new ErrorHandler(400, 'Bad request', errors.array());
    }

    next();
  } catch (error) {
    next(error);
  }
};
