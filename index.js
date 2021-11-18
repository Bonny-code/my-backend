const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const { response } = require("express");
app.use(bodyparser.json());
const cors = require("cors");
app.use(cors());
app.use(express.static("build"));

const Note = require("./models/note");

const mongoose = require("mongoose");

const url = "";
mongoose.connect(url);

const Note = mongoose.model("Note", {
  content: String,
  date: Date,
  importnat: Boolean,
});

let notes = [
  {
    id: 1,
    content: "HTML on helppoa",
    date: "2017-12-10T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Selain pystyy suorittamaan vain javascriptiä",
    date: "2017-12-10T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "HTTP-protokollan tärkeimmät metodit ovat GET ja POST",
    date: "2017-12-10T19:20:14.298Z",
    important: true,
  },
];

const logger = (request, response, next) => {
  console.log("Method:", request.method);
  console.log("Path:  ", request.path);
  console.log("Body:  ", request.body);
  console.log("---");
  next();
};

app.use(logger);

const generateId = () => {
  const maxId =
    notes.length > 0
      ? notes
          .map((n) => n.id)
          .sort((a, b) => a - b)
          .reverse()[0]
      : 1;
  return maxId + 1;
};

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (body.content === undefined) {
    return response.status(400).json({ error: "content missing" });
  }

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  note.save().then((savedNote) => {
    response.json(formatNote(savedNote));
  });
});

app.get("/", (req, res) => {
  res.send("<h1>This is my Backend App</h1>");
});

/*
const formatNote = (note) => {
  return {
    content: note.content,
    date: note.date,
    important: note.important,
    id: note._id,
  };
}; */

const formatNote = (note) => {
  const formattedNote = { ...note._doc, id: note._id };
  delete formattedNote._id;
  delete formattedNote.__v;

  return formattedNote;
};

app.get("/api/notes", (request, response) => {
  Note.find({}, { __v: 0 }).then((notes) => {
    response.json(notes.map(formatNote));
  });
});

app.get("/api/notes/:id", (request, response) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(formatNote(note));
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.put("/api/notes/:id", (request, response) => {
  const body = request.body;

  const note = {
    content: body.content,
    important: body.important,
  };

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then((updatedNote) => {
      response.json(formatNote(updatedNote));
    })
    .catch((error) => {
      console.log(error);
      response.status(400).send({ error: "malformatted id" });
    });
});

app.delete("/api/notes/:id", (request, response) => {
  Note.findByIdAndRemove(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => {
      response.status(400).send({ error: "malformatted id" });
    });
});

const error = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(error);

const port = 3001;
app.listen(port);
console.log(`server running on ${port}`);
