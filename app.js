const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
// const Cohort = require("../server/models/Cohort.model");
// const Student = require("../server/models/Student.model");

const port = process.env.PORT;

mongoose
  .connect("mongodb://localhost:27017/book-project")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
