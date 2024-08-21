const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle data parsing
app.use (express.urlencoded ({extended: true}));
app.use (express.json());

// Serve static files from the 'public' directory
app.use (express.static ('public'));

// HTML Routes
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/notes.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

// API Routes
app.get('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf8', (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to read notes' });
        return;
      }
      res.json(JSON.parse(data));
    });
  });
app.post('/api/notes', (req, res) => {
    const newNote = req.body;
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
    if (err) throw err;
    const notes = JSON.parse(data);

// Add a unique ID to each new note
newNote.id = Date.now().toString();
    notes.push(newNote);

    fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(notes), (err) => {
      if (err) throw err;
      res.json(newNote);
    });
  });
});

// Bonus: Delete note route
app.delete('/api/notes/:id', (req, res) => {
    const noteId = req.params.id;
  
    fs.readFile(path.join(__dirname, 'db/db.json'), 'utf8', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      const filteredNotes = notes.filter(note => note.id !== noteId);
  
      fs.writeFile(path.join(__dirname, 'db/db.json'), JSON.stringify(filteredNotes), (err) => {
        if (err) throw err;
        res.json({ ok: true });
      });
    });
  });
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });  