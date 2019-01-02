const express = require("express");
const router = express.Router();
const admin = require("../middleware/admin");
const auth = require("../middleware/auth");
const validID = require("../middleware/validID");
const { Poem, validate } = require("../models/poem");
const { message_404, searchQuery, pagination } = require("./utils");

const poem_message = message_404("poem");

router.get("/", validID(poem_message), async (req, res) => {});

router.get("/:id", (req, res) => {});

router.post("/", (req, res) => {});

router.put("/:id", (req, res) => {});

router.delete("/:id", [auth, validID(poem_message)], async (req, res) => {
  const poem = await Poem.findOneAndRemove({ _id: req.params.id });
  if (!poem) return res.status(404).send(poem_message);
  res.send(poem);
});

module.exports = router;
