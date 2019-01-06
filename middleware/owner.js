const config = require("config");

module.exports = function(Model) {
  return async function(req, res, next) {
    if (!config.get("auth")) return next();
    const instance = await Model.findById(req.params.id);
    if (!instance) return next();
    if (req.user._id != instance.user._id && !req.user.isAdmin)
      return res.status(403).send("Access denied");
    next();
  };
};
