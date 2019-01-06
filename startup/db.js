const mongoose = require("mongoose");
const config = require("config");
const dbDebug = require("debug")("app:db-debug");

module.exports = function() {
  mongoose
    .connect(
      config.get("mongodbConnectionString"),
      { useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false }
    )
    .then(() => dbDebug("connected to mongoDB"));
};
