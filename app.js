const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bookRouter = require("./routes/book.routes");
const authRouter = require("./routes/auth.routes");
const app = express();
require("dotenv").config();

// Question
app.use(express.json());
// Question
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

mongoose
  .connect("mongodb://localhost:27017/book-project")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

app.use("/", bookRouter);
app.use("/", authRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
