const mongoose = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const { genreSchema } = require("./genre");
const { categorySchema } = require("./category");

const poemSchema = new mongoose.Schema({
  title: { type: String, minlength: 1, maxlength: 30, required: true },
  content: { type: String, minlength: 5, maxlength: 5000, required: true },
  user: { type: mongoose.SchemaTypes.objectId, ref: "User", required: true },
  genre: { type: genreSchema, required: true },
  category: {
    type: [categorySchema],
    validate: {
      validator: function(v) {
        return v.length < 6;
      },
      message: "A poem cannot exceed more than 5 categories"
    }
  },
  createdAt: { type: Date, default: Date.now }
});

const Poem = mongoose.model("Poem", poemSchema);

function validatePoem(poem) {
  const schema = {
    genreId: Joi.objectId().required(),
    userId: Joi.objectId().required(),
    title: Joi.string()
      .required()
      .min(1)
      .max(30),
    content: Joi.string()
      .min(5)
      .max(5000)
      .required(),
    categoryId: Joi.array().items(Joi.objectId()),
    category: Joi.array()
      .max(5)
      .label("A poem cannot exceed more than 5 categories")
  };

  return Joi.validate(poem, schema);
}

module.exports.Poem = Poem;
module.exports.validate = validatePoem;
