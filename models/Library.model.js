const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const librarySchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  books: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
    },
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
});

const Library = mongoose.model("Library", librarySchema);
module.exports = Library;
