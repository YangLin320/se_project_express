const clothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/BadRequestError");
const ForbiddenError = require("../errors/ForbiddenError");
const NotFoundError = require("../errors/NotFoundError");

const getItems = (req, res, next) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send({ items }))
    .catch((err) => {
      next(err);
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(
          new BadRequestError(
            "Invalid data passed to the methods for creating an item."
          )
        );
      } else {
        next(err);
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return next(
          new ForbiddenError("You do not have permission to delete this item")
        );
      }
      return clothingItem
        .findByIdAndDelete(itemId)
        .then(() => res.status(200).send({ message: "Item Deleted" }));
    })
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID passed to the params."));
      } else if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("There is no clothing item with the requested id.")
        );
      } else {
        next(err);
      }
    });
};

const likeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID passed to the params."));
      } else if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("There is no clothing item with the requested id.")
        );
      } else {
        next(err);
      }
    });
};

const dislikeItem = (req, res, next) => {
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid ID passed to the params."));
      } else if (err.name === "DocumentNotFoundError") {
        next(
          new NotFoundError("There is no clothing item with the requested id.")
        );
      } else {
        next(err);
      }
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
