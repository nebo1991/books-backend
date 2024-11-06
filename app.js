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

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
