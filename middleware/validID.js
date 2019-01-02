// const jwt = require("jsonwebtoken");
// const config = require("config");
const { isValidID } = require("../routes/utils");

module.exports = function(message) {
  return function(req, res, next) {
    if (!isValidID(req.params.id)) return res.status(404).send(message);
    next();
  };
};
