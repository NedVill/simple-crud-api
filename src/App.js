const http = require("http");
require("dotenv").config();

const { codes } = require("./Persons/constants/persons.constants");

const PORT = process.env.PORT;

const PersonsController = require("./Persons/PersonsController");

const personsController = new PersonsController();

http
  .createServer((request, response) => {
    if (request.url === "/") {
      response.writeHead(codes.OK, { "Content-Type": "application/json" });
      response.end(
        JSON.stringify({
          message: `Enter url: '/persons' to get all users or enter url: 'persons/(uiid)' to get user by his id`,
        })
      );
    } else {
      personsController.init(request, response);
    }
  })
  .listen(PORT, () => {
    console.log(`Server is started on ${PORT} port`);
  });
