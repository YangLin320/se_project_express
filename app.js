const express = require("express");

const app = express();
const mongoose = require("mongoose");
const indexRouter = require("./routes/index");
const itemRouter = require('./routes/clothingItems');
const userRouter = require('./routes/users.js');
const {createUser, login} = require("./controllers/user");
const {getItems} = require ('./controllers/clothingItem');
const auth = require("./middlewares/auth");
const cors = require("cors");
app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(console.error);
app.use(express.json());
const { PORT = 3001 } = process.env;

app.post("/signin", login);
app.post("/signup", createUser);
app.get('/items', getItems);

app.use(auth);

app.use("/", indexRouter);
app.use("/items", itemRouter);
app.use("/users", userRouter);

app.listen(PORT, () => {
  console.log(`App working on ${PORT}`);
});
