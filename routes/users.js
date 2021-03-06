const express = require("express");
const router = express.Router();
const { User, validate } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");
const { pagination, searchQuery } = require("./utils");
router.get("/me", auth, async (req, res) => {
  user = await User.findOne({ _id: req.user._id }).select("-password");
  res.send(user);
});

router.get("/", async (req, res) => {
  const { pageNumber, pageSize } = pagination({
    pageSize: req.query.pageSize,
    pageNumber: req.query.page
  });
  const skipPages = (pageNumber - 1) * pageSize;
  const q = req.query.q || "";
  const order = req.query.order || "-username";
  let users = await User.find({
    $or: searchQuery(q, "username", "first_name", "last_name")
  })
    .sort(order)
    .skip(skipPages)
    .limit(parseInt(pageSize))
    .select("-password");
  res.send({ results: users });
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(
    _.pick(req.body, [
      "first_name",
      "last_name",
      "username",
      "email",
      "password"
    ])
  );

  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);

  await user.save();

  const token = user.generateAuthToken();
  res
    .header("x-auth-token", token)
    .send(
      _.pick(user, ["_id", "first_name", "last_name", "username", "email"])
    );
  // res.send(_.pick(user, ['_id', 'name', 'email']))
});

module.exports = router;
