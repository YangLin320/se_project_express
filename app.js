const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const { createUser, login } = require("./controllers/user");
const { getItems } = require("./controllers/clothingItem");
const auth = require("./middlewares/auth");

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    // eslint-disable-next-line no-console
    console.info("Database Connected Successfully");
  })
  .catch(console.error);
app.use(express.json());
const { PORT = 3001 } = process.env;

app.post("/signin", login);
app.post("/signup", createUser);
app.get("/items", getItems);

app.use(auth);

app.use("/", indexRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.info(`App working on ${PORT}`);
});
