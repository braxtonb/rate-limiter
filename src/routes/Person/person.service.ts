import faker from 'faker';
import { v4 as uuidv4 } from 'uuid';

class PersonService {
  public getPersonById = (id: string) => {
    return this._createPerson(id);
  };

  public getPeople = () => {
    return [
      this._createPerson(),
      this._createPerson(),
      this._createPerson(),
      this._createPerson(),
      this._createPerson(),
    ];
  };

  private _createPerson = (id = uuidv4()) => {
    return {
      id,
      name: `${faker.name.firstName()} ${faker.name.lastName()}`,
      occupation: faker.commerce.department(),
      age: faker.datatype.number({
        min: 20,
        max: 80,
      }),
    };
  }
}

export default PersonService;
