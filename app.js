const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const { getItems } = require("./controllers/clothingItem");

app.use(cors());

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.info("Database Connected Successfully");
  })
  .catch(console.error);
app.use(express.json());
const { PORT = 3001 } = process.env;

app.get("/items", getItems);

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.info(`App working on ${PORT}`);
});