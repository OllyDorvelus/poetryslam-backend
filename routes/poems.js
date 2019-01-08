const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const owner = require("../middleware/owner");
const validID = require("../middleware/validID");
const { Poem, validate } = require("../models/poem");
const { User } = require("../models/user");
const { Category } = require("../models/category");
const { Genre } = require("../models/genre");
const { message_404, searchQuery, pagination, getObject } = require("./utils");

const poem_message = message_404("poem");

router.get("/", async (req, res) => {
  const { pageNumber, pageSize } = pagination({
    pageSize: req.query.pageSize,
    pageNumber: req.query.page
  });
  const skipPages = (pageNumber - 1) * pageSize;
  const q = req.query.q || "";
  const order = req.query.order || "title";
  let poems = await Poem.find({
    $or: searchQuery(q, "title", "content", "genre.name")
  })
    .sort(order)
    .skip(skipPages)
    .limit(parseInt(pageSize));
  res.send({ results: poems });
});

router.get("/:id", validID(poem_message), async (req, res) => {
  const poem = await Poem.findById(req.params.id);
  if (!poem) return res.status(404).send(poem_message);
  const user = await User.findById(poem.user).select("-password");
  poem.user = user;
  res.send(poem);
});

router.post("/", auth, async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const user = await User.findById(req.body.userId).select("-password");
  if (!user) return res.status(400).send("There is no matching user");
  const genre = await getObject(Genre, req.body.genreId);
  if (!genre) return res.status(400).send("There is no matching genre");
  const categories = [];
  for (categoryId of req.body.categories) {
    let category = await getObject(Category, categoryId);
    if (!category)
      return res
        .status(400)
        .send("There must be one or more categories that do not match.");
    categories.push(category);
  }
  const poem = new Poem({
    user: user._id,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    categories: categories,
    title: req.body.title,
    content: req.body.content
  });
  await poem.save();
  poem.user = user;
  res.send(poem);
});

router.put(
  "/:id",
  [auth, validID(poem_message), owner(Poem)],
  async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const genre = await Genre.findById(req.body.genreId);
    if (!genre) return res.status(400).send("There is no matching genre");
    const categories = [];
    for (categoryId of req.body.categories) {
      let category = await getObject(Category, categoryId);
      if (!category)
        return res
          .status(400)
          .send("There must be one or more categories that do not match.");
      categories.push(category);
    }
    const poem = await Poem.findByIdAndUpdate(
      req.params.id,
      {
        genre: { _id: genre._id, name: genre.name },
        categories: categories,
        title: req.body.title,
        content: req.body.content
      },
      { new: true }
    );
    if (!poem) return res.status(404).send(poem_message);
    res.send(poem);
  }
);

router.delete(
  "/:id",
  [auth, validID(poem_message), owner(Poem)],
  async (req, res) => {
    const poem = await Poem.findByIdAndRemove(req.params.id);
    if (!poem) return res.status(404).send(poem_message);
    res.send(poem);
  }
);

module.exports = router;
