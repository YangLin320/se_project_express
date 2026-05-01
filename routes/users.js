const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/user");
const { validateUserId } = require("../middlewares/validation");

router.get("/me", validateUserId, getCurrentUser);
router.patch("/me", validateUserId, updateProfile);

module.exports = router;
