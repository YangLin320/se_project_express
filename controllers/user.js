const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const {
  ERROR_CODE_400,
  UNAUTHORIZED_ERROR_CODE,
  ERROR_CODE_404,
  ERROR_CODE_500,
  ERROR_CODE_409,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(ERROR_CODE_400)
      .send({ message: "Email and password are required" });
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      console.error("Error creating user:", err);
      console.error("Error Name:", err.name);
      if (err.name === "ValidationError") {
        return res.status(UNAUTHORIZED_ERROR_CODE).send({
          message: "Incorrect Email or Password",
        });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server." });
    });
};

// GET USERS
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      console.error(err);
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server" });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    return res
      .status(ERROR_CODE_400)
      .send({ message: "Email and password are required" });
  }
  bcrypt.hash(password, 10).then((hashedpassword) => {
    User.create({ name, avatar, email, password: hashedpassword })
      .then((user) => {
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(201).send({ userResponse });
      })
      .catch((err) => {
        console.error("Error creating user:", err);
        console.error("Error Name:", err.name);
        if (err.name === "ValidationError") {
          return res.status(ERROR_CODE_400).send({
            message: "Invalid data passed to the methods for creating a user",
          });
        }
        if (err.code === 11000) {
          return res.status(ERROR_CODE_409).send({
            message: "A user with this email already exists",
          });
        }
        return res
          .status(ERROR_CODE_500)
          .send({ message: "An error has occurred on the server." });
      });
  });
};

const getCurrentUser = (req, res) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      console.error("Error finding user by ID:", err);
      console.error("Error Name:", err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_400)
          .send({ message: "Invalid ID passed to the params." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODE_404)
          .send({ message: "There is no user with the requested id." });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server." });
    });
};

// controllers/users.js
const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;

  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    {
      new: true,
      runValidators: true,
    }
  )
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({
          message: "Invalid data passed for updating the profile.",
        });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({ message: "User not found" });
      }

      if (err.name === "CastError") {
        return res.status(ERROR_CODE_400).send({ message: "Invalid User ID" });
      }

      return res.status(ERROR_CODE_500).send({
        message: "An error has occurred on the server",
      });
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
