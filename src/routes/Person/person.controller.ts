import express from 'express';
import PersonService from './person.service';

import type { ApiResponse } from '../../constants/types';

class PersonController {
  private personService = new PersonService();

  public handleGetPersonById = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const { id } = req.params;
    const person = this.personService.getPersonById(id);
    const apiResponse: ApiResponse = {
      statusCode: 200,
      message: `Retrieved person with id ${id}`,
      data: person,
      errors: null,
    };

    return res.status(apiResponse.statusCode).send(apiResponse);
  };

  public handleGetPeople = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    const people = this.personService.getPeople();
    const apiResponse: ApiResponse = {
      statusCode: 200,
      message: 'Retrieved people',
      data: people,
      errors: null,
    };

    return res.status(apiResponse.statusCode).send(apiResponse);
  };
}

export default PersonController;
