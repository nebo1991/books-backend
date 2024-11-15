const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  name: {
    type: String,
  },
  library: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Library",
    default: null,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
