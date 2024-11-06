const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

const userRouter = express.Router();

require("dotenv").config();

module.exports = authRouter;
