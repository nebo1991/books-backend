const express = require("express");
const Library = require("../models/Library.model");
const authMiddleware = require("../middleware/auth.middleware");
const { models } = require("mongoose");

const libraryRouter = express.Router();

libraryRouter.get("/libraries", authMiddleware, async (req, res) => {
  try {
    const foundLibraries = await Library.find({}).populate("books");

    res.status(201).json(foundLibraries);
  } catch (error) {
    res.status(400).json({
      message: "Error when fetching the libraries",
      error: error.message,
    });
  }
});

libraryRouter.post("/libraries", authMiddleware, async (req, res) => {
  try {
    const newLibrary = await Library.create({
      name: req.body.name,
      createdBy: req.user._id,
      books: req.body.books || [],
    });

    return res.status(201).json(newLibrary);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        message: "You already have a library",
      });
    }

    return res.status(400).json({
      message: error.message || "Error creating library",
    });
  }
});

libraryRouter.put("/libraries/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { bookId } = req.body;

  try {
    const library = await Library.findById(id);

    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }

    if (library.createdBy.toString() !== req.user._id) {
      return res.status(403).json({
        message:
          "Unauthorized - you can only update libraries you have created",
      });
    }

    if (bookId) {
      const updatedLibrary = await Library.findByIdAndUpdate(
        id,
        { $push: { books: bookId } },
        { new: true }
      );

      return res.status(200).json(updatedLibrary);
    } else {
      return res.status(400).json({ message: "No bookId provided" });
    }
  } catch (error) {
    return res.status(400).json({
      message: "Error while updating the library",
      error: error.message,
    });
  }
});

libraryRouter.put(
  "/libraries/:id/remove-book",
  authMiddleware,
  async (req, res) => {
    const { id } = req.params;
    const { bookId } = req.body;

    try {
      const library = await Library.findById(id);

      if (!library) {
        return res.status(404).json({ message: "Library not found" });
      }

      if (library.createdBy.toString() !== req.user._id) {
        return res.status(403).json({
          message:
            "Unauthorized - you can only update libraries you have created",
        });
      }

      const updatedLibrary = await Library.findByIdAndUpdate(
        id,
        { $pull: { books: bookId } },
        { new: true }
      );

      return res.status(200).json(updatedLibrary);
    } catch (error) {
      return res.status(400).json({
        message: "Error while removing the book from the library",
        error: error.message,
      });
    }
  }
);

module.exports = libraryRouter;
