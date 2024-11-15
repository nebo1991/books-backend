const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User.model");
const authMiddleware = require("../middleware/auth.middleware");
require("dotenv").config();

const authRouter = express.Router();

require("dotenv").config();

authRouter.post("/signup", async (req, res, next) => {
  const { email, password, name } = req.body;
  try {
    if (!email || !password || !name) {
      res.status(400).json({ message: "Provide email, password and name" });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }

    const passwordRegex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!passwordRegex.test(password)) {
      res.status(400).json({
        message:
          "Password must have at least 6 characters and contain at least one number, one lowercase and one uppercase letter.",
      });
      return;
    }

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      console.log(foundUser);
      res.status(400).json({ message: "User already exists." });
      return;
    }
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);
    const createdUser = await User.create({
      email,
      name,
      password: hashedPassword,
    });
    res.status(201).json(createdUser);
  } catch (error) {
    console.error(error);
    next(error); // Remove res.status(500).json(...) here
  }
});

authRouter.post("/login", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      res.status(400).json({ message: "Provide email and password." });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(email)) {
      res.status(400).json({ message: "Provide a valid email address." });
      return;
    }

    const foundUser = await User.findOne({ email });
    if (!foundUser) {
      res.status(400).json({ message: "Wrong credentials." });
      return;
    }

    const isPasswordMatch = bcrypt.compareSync(password, foundUser.password);
    if (!isPasswordMatch) {
      res.status(400).json({ message: "Wrong credentials." });
      return;
    }

    const { _id, name } = foundUser;
    const payload = { _id, email, name };

    const authToken = jwt.sign(payload, process.env.TOKEN_SECRET, {
      algorithm: "HS256",
      expiresIn: "6h",
    });

    res.status(200).json({ authToken: authToken, id: _id });
  } catch (error) {
    console.error(error);
    next(error); // Remove res.status(500).json(...) here
  }
});

authRouter.get("/verify", authMiddleware, (req, res, next) => {
  res.status(200).json({ loggedIn: true });
});

authRouter.get("/user", authMiddleware, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate("library");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user data:", error);
    next(error);
  }
});

authRouter;

module.exports = authRouter;
