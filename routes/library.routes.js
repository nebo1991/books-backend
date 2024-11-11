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
    const { name, books = [] } = req.body;
    const createdBy = req.user._id; // Assuming `authMiddleware` attaches user info to `req.user`

    // Create a new library
    const newLibrary = await Library.create({
      name,
      books,
      createdBy,
    });

    res.status(201).json(newLibrary);
  } catch (error) {
    res.status(500).json({ message: `${error.message}` });
  }
});

libraryRouter.put("/libraries/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  const { bookId } = req.body; // Expecting bookId in the request body

  try {
    // Check if library exists
    const library = await Library.findById(id);

    if (!library) {
      return res.status(404).json({ message: "Library not found" });
    }

    // Check if the library belongs to the current user
    if (library.createdBy.toString() !== req.user._id) {
      return res.status(403).json({
        message:
          "Unauthorized - you can only update libraries you have created",
      });
    }

    // Add the book ID to the books array
    if (bookId) {
      const updatedLibrary = await Library.findByIdAndUpdate(
        id,
        { $push: { books: bookId } }, // Using $push to add the book ID
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
    const { id } = req.params; // Library ID
    const { bookId } = req.body; // Book ID to remove

    try {
      // Check if library exists
      const library = await Library.findById(id);

      if (!library) {
        return res.status(404).json({ message: "Library not found" });
      }

      // Check if the library belongs to the current user
      if (library.createdBy.toString() !== req.user._id) {
        return res.status(403).json({
          message:
            "Unauthorized - you can only update libraries you have created",
        });
      }

      // Remove the book ID from the books array
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
