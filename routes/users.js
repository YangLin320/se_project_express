const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/user");

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
