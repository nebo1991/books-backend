const express = require("express");
const Book = require("../models/Book.model");
const authMiddleware = require("../middleware/auth.middleware");

const bookRouter = express.Router();

bookRouter.get("/books", async (req, res) => {
  try {
    const foundBooks = await Book.find({});
    res.status(201).json(foundBooks);
  } catch (error) {
    res.json({ message: "No books found" }).send();
  }
});

bookRouter.post("/books", authMiddleware, async (req, res) => {
  try {
    const newBook = await Book.create({
      ...req.body,
      createdBy: req.user._id,
    });
    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating book", error: error.message });
  }
});

// Get a single book by ID
bookRouter.get("/books/:id", authMiddleware, async (req, res) => {
  const { id } = req.params; // Extract the book ID from the URL params
  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json(book);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error while fetching the book", error: error.message });
  }
});

bookRouter.put("/books/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  try {
    const book = await Book.findById(id);

    if (!book) {
      res.status(404).json({ message: "Book not found" });
      return;
    }

    if (book.createdBy.toString() !== req.user._id) {
      res.status(403).json({
        message: "Unauthorized - you can only update books you have created",
      });
    }

    const updatedBook = await Book.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedBook);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error while updating the book", error: error.message });
  }
});

bookRouter.delete("/books/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const book = await Book.findById(id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    if (book.createdBy.toString() !== req.user._id) {
      return res.status(403).json({
        message: "Unauthorized - you can only delete books you've created",
      });
    }

    await Book.findByIdAndDelete(id);
    return res.json({ message: "Book successfully deleted" });
  } catch (error) {
    return res.status(400).json({
      message: "Error deleting book",
      error: error.message,
    });
  }
});

module.exports = bookRouter;
