const mongoose = require("mongoose");

const url = process.env.MONGODB_URI;

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

mongoose.connect(url);

const Note = mongoose.model("Note", {
  content: String,
  date: Date,
  important: Boolean,
});

module.exports = Note;
