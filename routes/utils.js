const config = require("config");
const debug = require("debug")("app:utildebug");
const mongoose = require("mongoose");
exports.pagination = function(paginationObj) {
  if (!paginationObj.pageNumber) paginationObj.pageNumber = 1;
  if (!paginationObj.pageSize)
    paginationObj.pageSize = config.get("standardPageSize");
  if (paginationObj.pageSize > config.get("maxPageSize"))
    paginationObj.pageSize = config.get("maxPageSize");
  return paginationObj;
};

exports.searchQuery = function(q, ...properties) {
  const propArry = [];
  for (prop of properties) {
    propArry.push({ [prop]: { $regex: q, $options: "i" } });
  }
  debug(propArry, "proparry");
  return propArry;
};

exports.message_404 = function(modelName) {
  return `The ${modelName} with the given ID could not be found`;
};

exports.isValidID = function(id) {
  return mongoose.Types.ObjectId.isValid(id);
};
exports.getObject = async function(Model, propertyValue) {
  return await Model.findOne(propertyValue);
};
