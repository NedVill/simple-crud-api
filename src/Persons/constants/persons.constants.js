const codes = {
  OK: 200,
  CREATED: 201,
  DELETED: 204,
  BAD: 400,
  NOT_FOUND: 404,
  ERROR: 500,
};

const requiredFields = ["name", "age", "hobbies"];

const errorMessage = {
  code: codes.ERROR,
  message: "Mistake in server, please, try later",
};

module.exports = {
  errorMessage,
  requiredFields,
  codes,
};
