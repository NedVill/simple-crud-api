const { v4: uuidv4, validate: isUiidValid } = require("uuid");

const persons = require("./presons.data");
const { codes, requiredFields } = require("./constants/persons.constants");

module.exports.PersonsService = class PersonsService {
  persons = persons;

  requiredFields = requiredFields;

  validateId(id) {
    if (!id) {
      return {
        code: codes.BAD,
        message: "id is required",
      };
    }

    if (!isUiidValid(id)) {
      return {
        code: codes.BAD,
        message: "Incorrect Person id",
      };
    }

    return true;
  }

  validateData(data) {
    const response = {};

    console.log(data);

    this.requiredFields.some((field) => {
      if (!data[field]) {
        response.code = codes.BAD;
        response.message = `${field} is required`;
        return true;
      }

      return false;
    });

    if (response.code) {
      return response;
    }

    return true;
  }

  async getPersons() {
    return new Promise((resolve, reject) =>
      resolve({
        code: codes.OK,
        data: this.persons,
      })
    );
  }

  async getPersonById(id) {
    return new Promise((resolve, reject) => {
      const isValid = this.validateId(id);

      if (typeof isValid === "object") {
        resolve(isValid);
      }

      for (const person of this.persons) {
        if (person.id === id) {
          resolve({
            code: codes.OK,
            data: person,
          });
        }
      }

      resolve({
        code: codes.NOT_FOUND,
        message: `Person with id ${id} not found`,
      });
    });
  }

  async editPersonById(data) {
    return new Promise((resolve, reject) => {
      const isValid = this.validateId(data.id);

      if (typeof isValid === "object") {
        resolve(isValid);
      }

      for (const person in Object.keys(this.persons)) {
        if (this.persons[person].id === data.id) {
          this.persons[person] = { ...this.persons[person], ...data };

          resolve({
            code: codes.OK,
            message: `Person with id ${data.id} has been updated`,
          });
        }
      }

      resolve({
        code: codes.NOT_FOUND,
        message: `Person with id ${data.id} not found`,
      });
    });
  }

  async addPerson(data) {
    return new Promise((resolve, reject) => {
      const isValidData = this.validateData(data);

      if (typeof isValidData === "object") {
        resolve(isValidData);
      }

      this.persons.push({
        id: uuidv4(),
        ...data,
      });

      resolve({
        code: codes.CREATED,
        message: `Person ${data.name} has been added`,
      });
    });
  }

  async deletePersonById(id) {
    return new Promise((resolve, reject) => {
      let newPersons = [];

      let isFound = false;

      const isValidData = this.validateId(id);

      if (typeof isValidData === "object") {
        resolve(isValidData);
      }

      for (const person of this.persons) {
        if (person.id === id) {
          isFound = true;
        } else {
          newPersons.push(person);
        }
      }

      this.persons = newPersons;

      resolve({
        code: isFound ? codes.DELETED : codes.OK,
        message: "The line wasn't found",
      });
    });
  }
};
