const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  books: [
    {
      books: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
});

const Library = mongoose.model("Library", librarySchema);
module.exports = Library;
