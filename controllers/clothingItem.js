const clothingItem = require("../models/clothingItem");
const {
  ERROR_CODE_400,
  FORBIDDEN_ERROR_CODE,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require("../utils/errors");

// GET ITEMS
const getItems = (req, res) => {
  clothingItem
    .find({})
    .then((items) => res.status(200).send({ items }))
    .catch((err) => {
      console.error("Error finding items:", err);
      console.log("Error Name:", err.name);
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server." });
    });
};

const createItem = (req, res) => {
  console.log(req.user._id);
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  clothingItem
    .create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ item }))
    .catch((err) => {
      console.error("Error creating item:", err);
      console.log("Error Name:", err.name);

      if (err.name === "ValidationError") {
        return res.status(ERROR_CODE_400).send({
          message: "Invalid data passed to the methods for creating an item.",
        });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server." });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const userId  = req.user._id;
  clothingItem
    .findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== userId) {
        return res
          .status(FORBIDDEN_ERROR_CODE)
          .send({ message: "You do not have permission to delete this item" });
      }
      clothingItem.findByIdAndDelete(itemId).then((item) => {
        res.status(200).send({ message: "Item Deleted" });
      });
    })
    .catch((err) => {
      console.error("Error deleting item:", err);
      console.log("Error Name:", err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_400)
          .send({ message: "Invalid ID passed to the params." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({
          message: "There is no clothing item with the requested id.",
        });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server." });
    });
};

const likeItem = (req, res) => {
  console.log(req.user._id);
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $addToSet: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then(() => res.status(200).send({ message: "item liked" }))
    .catch((err) => {
      console.error("Error liking item:", err);
      console.log("Error Name:", err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_400)
          .send({ message: "Invalid ID passed to the params." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({
          message: "There is no clothing item with the requested id.",
        });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server." });
    });
};

const dislikeItem = (req, res) => {
  console.log(req.user._id);
  clothingItem
    .findByIdAndUpdate(
      req.params.itemId,
      { $pull: { likes: req.user._id } },
      { new: true }
    )
    .orFail()
    .then(() => res.status(200).send({ message: "item disliked" }))
    .catch((err) => {
      console.error("Error disliking item:", err);
      console.log("Error Name:", err.name);
      if (err.name === "CastError") {
        return res
          .status(ERROR_CODE_400)
          .send({ message: "Invalid ID passed to the params." });
      }
      if (err.name === "DocumentNotFoundError") {
        return res.status(ERROR_CODE_404).send({
          message: "There is no clothing item with the requested id.",
        });
      }
      return res
        .status(ERROR_CODE_500)
        .send({ message: "An error has occurred on the server." });
    });
};

module.exports = { getItems, createItem, deleteItem, likeItem, dislikeItem };
