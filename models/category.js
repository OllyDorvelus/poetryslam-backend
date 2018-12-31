const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minlength: 3,
    maxlength: 25
  },
  createdAt: { type: Date, default: Date.now }
});

const Category = mongoose.model("Category", categorySchema);

function validate(category) {
  const schema = {
    name: Joi.string()
      .required()
      .min(3)
      .max(25)
  };
  return Joi.validate(category, schema);
}

exports.categorySchema = categorySchema;
exports.Category = Category;
exports.validate = validate;
