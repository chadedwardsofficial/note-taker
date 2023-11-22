const express = require('express');
const path = require('path');
const uuid = require('uuid');
const noteData = require('./db/notes.json');
const fs = require('fs');

const PORT = 3001;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));





app.get('/api/notes', (req, res) => res.json(noteData));

app.post('/api/notes', (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Please Enter a Note Title and Sub Notes' });
  }

  const newNote = {
    id: uuid.v4(), 
    title,
    text,
  };


  noteData.push(newNote);
  fs.writeFile(`./db/notes.json`,JSON.stringify(noteData), (err) =>
      err
        ? console.error(err)
        : console.log(
            `note saved`
          )
    );

  res.status(201).json(noteData);
});



// Route to Notes.html
app.get('/notes', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'notes.html');
  res.sendFile(filePath);
});

// Everything else goes to index.html
app.get('*', (req, res) => {
  const filePath = path.join(__dirname, 'public', 'index.html');
  res.sendFile(filePath);
});

app.listen(PORT, () => {
  console.log(`App listening at http://localhost:${PORT}`);
});