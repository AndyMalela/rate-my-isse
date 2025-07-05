// importProfessors.js
const sqlite3 = require('sqlite3').verbose();
const fs      = require('fs');
const { parse } = require('csv-parse');


const db = new sqlite3.Database('data.sqlite');

db.serialize(() => {
  const parser = fs
    .createReadStream('courses_filtered.csv')
    .pipe(parse({ columns: true, trim: true }));

  parser.on('data', row => {
    const courseName = row.course_name;
    const profList   = row.professor_name.split(/,\s*/);

    // 1) find the course id
    db.get(
      'SELECT id FROM courses WHERE course_name = ?',
      [courseName],
      (err, course) => {
        if (err || !course) return;
        const cid = course.id;

        // for each professor name
        profList.forEach(name => {
          if (!name) return;

          // a) insert into professors if new
          db.run(
            'INSERT OR IGNORE INTO professors(name) VALUES(?)',
            [name],
            err => {
              if (err) console.error(err);
            }
          );

          // b) link course↔professor
          db.get(
            'SELECT id FROM professors WHERE name = ?',
            [name],
            (err, prof) => {
              if (err || !prof) return;
              db.run(
                'INSERT OR IGNORE INTO course_professor(course_id, professor_id) VALUES(?, ?)',
                [cid, prof.id]
              );
            }
          );
        });
      }
    );
  });

  parser.on('end', () => {
    console.log('professors import complete');
    db.close();
  });
});
