const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const validID = require("../middleware/validID");
const { Genre, validate } = require("../models/genre");
const { message_404, isValidID, searchQuery, pagination } = require("./utils");

const genre_404 = message_404("genre");

router.get("/", async (req, res) => {
  const { pageNumber, pageSize } = pagination({
    pageSize: req.query.pageSize,
    pageNumber: req.query.page
  });
  const skipPages = (pageNumber - 1) * pageSize;
  const q = req.query.q || "";
  const order = req.query.order || "name";
  let genres = await Genre.find({ $or: searchQuery(q, "name") })
    .sort(order)
    .skip(skipPages)
    .limit(parseInt(pageSize));
  res.send({ results: genres });
});

router.get("/:id", validID(genre_404), async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) return res.status(404).send(genre_404);
  res.send(genre);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  let genre = await Genre.findOne({ name: req.body.name });
  if (genre) return res.status(400).send("The Genre already exists");
  genre = new Genre({
    name: req.body.name
  });
  await genre.save();
  res.send(genre);
});

router.put("/:id", [auth, admin, validID(genre_404)], async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send(genre_404);
  res.send(genre);
});

router.delete("/:id", [auth, admin, validID(genre_404)], async (req, res) => {
  const genre = await Genre.findOneAndRemove({ _id: req.params.id });
  if (!genre) return res.status(404).send(genre_404);
  res.send(genre);
});
module.exports = router;
