const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const BadRequestError = require("../errors/BadRequestError");
const UnauthorizedError = require("../errors/UnauthorizedError");
const NotFoundError = require("../errors/NotFoundError");
const ConflictError = require("../errors/ConflictError");

const { JWT_SECRET } = require("../utils/config");

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
  }
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.status(200).send({ token });
    })
    .catch((err) => {
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect Email or Password"));
      } else {
        next(err);
      }
    });
};

// GET USERS
const getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.status(200).send({ users }))
    .catch((err) => {
      next(err);
    });
};

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;
  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
  }
  return bcrypt.hash(password, 10).then((hashedpassword) => {
    User.create({ name, avatar, email, password: hashedpassword })
      .then((user) => {
        const userResponse = user.toObject();
        delete userResponse.password;
        return res.status(201).send({ userResponse });
      })
      .catch((err) => {
        if (err.name === "ValidationError") {
          next(
            new BadRequestError(
              "Invalid data passed to the methods for creating a user"
            )
          );
        } else if (err.code === 11000) {
          next(new ConflictError("A user with this email already exists"));
        } else {
          next(err);
        }
      });
  });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send({ user }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID passed to the params."));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("There is no user with the requested id."));
      } else {
        next(err);
      }
    });
};

// controllers/users.js
const updateProfile = (req, res, next) => {
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
      if (err.name === "ValidationError") {
        next(
          new BadRequestError("Invalid data passed for updating the profile.")
        );
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Invalid User ID"));
      } else {
        next(err);
      }
    });
};

module.exports = { getUsers, createUser, getCurrentUser, login, updateProfile };
