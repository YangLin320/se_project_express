const router = require("express").Router();
const { ERROR_CODE_404 } = require("../utils/errors");
const { createUser, login } = require("../controllers/user");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

const {
  validateNewUser,
  validateUserLogIn,
} = require("../middlewares/validation");

router.post("/signin", validateUserLogIn, login);
router.post("/signup", validateNewUser, createUser);
router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.use((req, res, next) => {
  const err = new Error("The requested resource was not found");
  err.statusCode = ERROR_CODE_404;
  next(err);
});

module.exports = router;
