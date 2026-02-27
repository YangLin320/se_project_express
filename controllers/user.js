const User = require("../models/user");
const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require("../utils/errors");

//GET USERS
const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      console.log("Error Name:", err.name);
      console.error("Error finding clothing items:", err);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res
          .status(ERROR_CODE_400)
          .send({ message: "Invalid data passed" });
      } else if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({ message: "User not found" });
      } else {
        return res
          .status(ERROR_CODE_500)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error("Error creating user:", err);
      console.log("Error Name:", err.name);
      if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(ERROR_CODE_400).send({
          message: "Invalid data passed to the methods for creating a user",
        });
      } else {
        return res
          .status(ERROR_CODE_500)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const getUserById = (req, res) => {
  const { userId } = req.params;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      console.error("Error finding user by ID:", err);
      console.log("Error Name:", err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_400)
          .send({ message: "Invalid ID passed to the params." });
      } else if (err.name === "DocumentNotFoundError") {
        return res
          .status(ERROR_CODE_404)
          .send({ message: "There is no user with the requested id." });
      } else {
        return res
          .status(ERROR_CODE_500)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = { getUsers, createUser, getUserById };
