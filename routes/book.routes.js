const express = require("express");
const Book = require("../models/Book.model");
const authMiddleware = require("../middleware/auth.middleware");

const bookRouter = express.Router();

bookRouter.get("/books", async (req, res) => {
  try {
    const foundBooks = await Books.find({});
    res.status(201).json(foundBooks);
  } catch (error) {
    res.json({ message: "No books found" }).send();
  }
});

bookRouter.post("/books", authMiddleware, async (req, res) => {
  try {
    const newBook = await Books.create({
      ...req.body,
      createdBy: req.user.id,
    });
    res.status(201).json(newBook);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating book", error: error.message });
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

    if (book.createdBy.toString() !== req.user.id) {
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
      res.status(404).json({ message: "Book not found" });
      return;
    }

    if (book.createdBy.toString() !== req.user.id) {
      res.status(403).json({
        message: "Unauthorized - you can only delete books you've created",
      });
    }
    await Book.findByIdAndDelete(id);
    res.json({ message: "Book successfully deleted" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error deleting book", error: error.message });
  }
});

module.exports = bookRouter;
