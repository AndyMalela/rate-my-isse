const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('data.sqlite', err =>
  err ? console.error('DB error:', err) : console.log('SQLite connected')
);

module.exports = db;
