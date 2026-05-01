const router = require("express").Router();
const {
  createItem,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItem");

const {
  validateClothingItems,
  validateUserId,
  validateItemId,
} = require("../middlewares/validation");

router.post("/", validateClothingItems, createItem);
router.delete("/:itemId", validateUserId, deleteItem);

router.put("/:itemId/likes", validateItemId, likeItem);
router.delete("/:itemId/likes", validateItemId, dislikeItem);

module.exports = router;
