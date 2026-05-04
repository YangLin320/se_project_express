const router = require("express").Router();
const NotFoundError = require("../errors/NotFoundError");
const { createUser, login } = require("../controllers/user");
const auth = require("../middlewares/auth");
const { getItems } = require("../controllers/clothingItem");

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

const {
  validateNewUser,
  validateUserLogIn,
} = require("../middlewares/validation");

router.post("/signin", validateUserLogIn, login);
router.post("/signup", validateNewUser, createUser);

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.get("/items", getItems);
router.use((req, res, next) => {
  next(new NotFoundError("Not Found"));
});

router.use(auth);

module.exports = router;
