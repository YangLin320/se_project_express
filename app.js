const express = require("express");
const app = express();
const mongoose = require("mongoose");
const indexRouter = require("./routes/index.js");

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Database Connected Successfully");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "69a2157547a97c90c79e13cc",
  };
  next();
});
app.use(express.json());
app.use("/", indexRouter);
const { PORT = 3001 } = process.env;

app.listen(PORT, () => {
  console.log(`App working on ${PORT}`);
});
