const mongoose = require("mongoose");

const url = "";
mongoose.connect(url);

const Note = mongoose.model("Note", {
  content: String,
  date: Date,
  importnat: Boolean,
});

//for creating new notes
/*
const note = new Note({
  content: "HTML on helpoa",
  date: new Date(),
  importnat: true,
});
*/

//for fetching a note from the server.
Note.find({}).then((result) => {
  result.forEach((note) => {
    console.log(note);
  });
  mongoose.connection.close();
});

//to find important notes
/*
Note.find({ important: true }).then(result => {
    cotinue here like above
})
*/

note.save().then((response) => {
  console.log("note saved!");
  mongoose.connection.close();
});
