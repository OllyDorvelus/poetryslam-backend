const express = require("express");
const router = express.Router();
const { Category, validate } = require("../models/category");
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validID = require("../middleware/validID");
const { message_404, pagination, searchQuery } = require("./utils");

const category_404 = message_404("category");

router.get("/", async (req, res) => {
  const { pageNumber, pageSize } = pagination({
    pageSize: req.query.pageSize,
    pageNumber: req.query.page
  });
  const skipPages = (pageNumber - 1) * pageSize;
  const q = req.query.q || "";
  const order = req.query.order || "name";
  let categories = await Category.find({ $or: searchQuery(q, "name") })
    .sort(order)
    .skip(skipPages)
    .limit(parseInt(pageSize));
  res.send({ results: categories });
});

router.get("/:id", validID(category_404), async (req, res) => {
  const category = await Category.findOne({ _id: req.params.id });
  if (!category) return res.status(404).send(category_404);
  res.send(category);
});
router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let category = await Category.findOne({ name: req.body.name });
  if (category) return res.status(400).send("This category already exists");
  category = new Category({
    name: req.body.name
  });

  await category.save();
  res.send(category);
});

router.put("/:id", [auth, admin, validID(category_404)], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const category = await Category.findOneAndUpdate(
    { _id: req.params.id },
    {
      name: req.body.name
    },
    { new: true }
  );
  if (!category) return res.status(404).send(category_404);
  res.send(category);
});

router.delete(
  "/:id",
  [auth, admin, validID(category_404)],
  async (req, res) => {
    const category = await Category.findOneAndDelete({ _id: req.params.id });
    if (!category) return res.status(404).send(category_404);
    res.send(category);
  }
);

module.exports = router;
