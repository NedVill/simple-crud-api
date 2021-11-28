const { PersonsService } = require("./PersonsService");
const { getRequestData } = require("../utils/getRequestData");
const { errorMessage } = require("./constants/persons.constants");
const { codes } = require("./constants/persons.constants");

module.exports = class PersonsController {
  personsService = new PersonsService();

  errorMessage = errorMessage;

  req;

  res;

  methodCaller = {
    GET: this.getData.bind(this),
    OPTIONS: this.getData.bind(this),
    DELETE: this.deleteData.bind(this),
    PATCH: this.putData.bind(this),
    PUT: this.putData.bind(this),
    POST: this.addData.bind(this),
  };

  async getData(id) {
    let response = this.errorMessage;

    if (!id) {
      response = await this.personsService.getPersons();
    } else {
      response = await this.personsService.getPersonById(id);
    }

    return response;
  }

  async deleteData(id) {
    let response = this.errorMessage;

    response = await this.personsService.deletePersonById(id);

    return response;
  }

  async putData() {
    let response = this.errorMessage;

    const data = await getRequestData(this.req);

    if (data) {
      response = await this.personsService.editPersonById(JSON.parse(data));
    }

    return response;
  }

  async addData() {
    let response = this.errorMessage;

    const data = await getRequestData(this.req);

    if (data) {
      response = await this.personsService.addPerson(JSON.parse(data));
    }

    return response;
  }

  callNotFound(url, res) {
    res.writeHead(codes.NOT_FOUND, { "Content-Type": "application/json" });
    res.end(`404: Page ${url} not found`);
  }

  validate(url) {
    let isError = false;

    const urlParams = url.split("/");

    if (urlParams[1] !== "persons") {
      isError = true;
    }

    if (urlParams.length > 3) {
      isError = true;
    }

    if (isError) {
      this.callNotFound(url, this.res);
    }
  }

  async init(req, res) {
    this.req = req;
    this.res = res;

    this.validate(this.req.url);

    const urlSplitted = req.url.split("/");

    let id = "";

    if (urlSplitted[2]) {
      id = urlSplitted[2];
    }

    const response = await this.methodCaller[req.method](id);

    res.writeHead(response.code, { "Content-Type": "application/json" });
    res.end(JSON.stringify(response.data || response.message || ""));
  }
};
