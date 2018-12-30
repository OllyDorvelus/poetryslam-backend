const jwt = require("jsonwebtoken");
const config = require("config");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  first_name: { type: String, required: true, minLength: 2, maxLength: 30 },
  last_name: { type: String, required: true, minlength: 2, maxLength: 30 },
  username: {
    type: String,
    required: true,
    minlength: 3,
    maxLength: 20,
    unique: true
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true
  },
  password: { type: String, required: true, minLength: 5, maxLength: 1024 },
  createdAt: { type: Date, default: Date.now },
  isAdmin: { type: Boolean }
});

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      isAdmin: this.isAdmin,
      first_name: this.first_name,
      last_name: this.last_name,
      email: this.email,
      username: this.username
    },
    config.get("jwtPrivateKey")
  );
  return token;
};

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = {
    email: Joi.string()
      .min(5)
      .max(255)
      .required()
      .email(),
    password: Joi.string()
      .min(5)
      .max(255)
      .required(),
    username: Joi.string()
      .min(3)
      .max(20)
      .required(),
    first_name: Joi.string()
      .min(2)
      .max(30)
      .required(),
    last_name: Joi.string()
      .min(2)
      .max(30)
      .required()
  };

  return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;
