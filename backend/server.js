// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors    = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('data.sqlite', err =>
  err ? console.error('DB error:', err) : console.log('SQLite connected')
);

// 1) List all courses
app.get('/api/courses', (req, res) => {
  db.all(
    'SELECT id, course_name, period, semester_term, language FROM courses',
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// 2) Get professors for a single course
app.get('/api/courses/:id/professors', (req, res) => {
  const sql = `
    SELECT p.id, p.name
      FROM professors p
      JOIN course_professor cp
        ON p.id = cp.professor_id
     WHERE cp.course_id = ?
  `;
  db.all(sql, [req.params.id], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// 3) Placeholder for ratings (if/when you add that table)
app.get('/api/courses/:cid/professors/:pid/ratings', (req, res) => {
  db.all(
    `SELECT * FROM ratings
       WHERE course_id = ? AND professor_id = ?`,
    [req.params.cid, req.params.pid],
    (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(rows);
    }
  );
});

// Start the server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
