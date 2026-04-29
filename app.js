require("dotenv").config();
const express = require("express");

const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");
const { getItems } = require("./controllers/clothingItem");
const errorHandler = require("./middlewares/errorHandler");
const { errors } = require("celebrate");
const { requestLogger, errorLogger } = require("./middlewares/logger");

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
app.use(requestLogger);
app.use("/", indexRouter);
app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {
  console.info(`App working on ${PORT}`);
});
