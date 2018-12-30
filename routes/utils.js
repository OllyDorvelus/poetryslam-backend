const config = require("config");
const debug = require("debug")("app:utildebug");
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
