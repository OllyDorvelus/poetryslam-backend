const config = require("config");
const debug = require("debug")("app:utildebug");
const mongoose = require("mongoose");
const _ = require("lodash");
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
  for (let prop of properties) {
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
exports.getObject = async function(Model, id, propertyValue) {
  if (!propertyValue) return await Model.findById(id);
  return await Model.findOne(propertyValue);
};
