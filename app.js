const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bookRouter = require("./routes/book.routes");
const authRouter = require("./routes/auth.routes");
const libraryRouter = require("./routes/library.routes");
require("dotenv").config();

const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT;

const mongoURI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/book-project";

// Connect to MongoDB
mongoose
  .connect(mongoURI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error: ", err));

app.use("/", bookRouter);
app.use("/", authRouter);
app.use("/", libraryRouter);

if (process.env.NODE_ENV !== "production") {
  app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
  });
}

module.exports = app;
