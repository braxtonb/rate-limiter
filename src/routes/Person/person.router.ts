import express from 'express';
import { rateLimiterMiddleware } from '../../lib/middleware/rate-limiter-middleware';
import PersonController from './person.controller';
import {
  validateGetPersonByIdRules,
  validatePersonRules,
} from './person.validators';

const PersonRouter = express.Router();
const personController = new PersonController();

// layer path /api/person
PersonRouter.get(
  '/:id',
  validateGetPersonByIdRules,
  validatePersonRules,
  rateLimiterMiddleware,
  personController.handleGetPersonById,
);
PersonRouter.get('/', rateLimiterMiddleware, personController.handleGetPeople);

export default PersonRouter;
