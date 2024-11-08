const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const bookSchema = new Schema({
  title: {
    type: String,
  },
  author: {
    type: String,
  },
  description: {
    type: String,
  },
  pages: {
    type: Number,
  },
  image: {
    type: String,
    default: "",
  },
  genre: {
    type: String,
    enum: [
      "Fiction",
      "Mystery",
      "Novel",
      "Non-Fiction",
      "Historical",
      "Romance",
    ],
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
