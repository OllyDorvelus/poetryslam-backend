const mongoose = require("mongoose");
const Joi = require("joi");

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    minlength: 3,
    maxlength: 25
  },
  createdAt: { type: Date, default: Date.now }
});

const Genre = mongoose.model("Genre", genreSchema);

const validateGenre = function(genre) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
      .max(25)
  };

  return Joi.validate(genre, schema);
};

module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema;
module.exports.validate = validateGenre;
