const express = require("express");
const error = require("../middleware/error");
const auth = require("../routes/auth");
const users = require("../routes/users");
const categories = require("../routes/categories");
const genres = require("../routes/genres");

module.exports = function(app) {
  app.use(express.json());
  app.use("/api/auth", auth);
  app.use("/api/users", users);
  app.use("/api/categories", categories);
  app.use("/api/genres", genres);
  app.use(error);
};
