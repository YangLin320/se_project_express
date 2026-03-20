const router = require("express").Router();
const { ERROR_CODE_404 } = require("../utils/errors");
const { createUser, login } = require("../controllers/user");
const auth = require("../middlewares/auth");

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");


router.post("/signin", login);
router.post("/signup", createUser);
router.use(auth);

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.use((req, res) => {
  res.status(ERROR_CODE_404).send({ message: "Requested resource not found" });
});

module.exports = router;
