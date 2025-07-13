const db = require('../db');

exports.fetchAllProfessors = (search, callback) => {
  let sql = 'SELECT id, name FROM professors';
  let params = [];
  if (search) {
    sql += ' WHERE name LIKE ?';
    params.push(`%${search}%`);
  }
  db.all(sql, params, callback);
};

exports.fetchProfessorById = (professorId, callback) => {
  const sql = `
    SELECT id, name FROM professors WHERE id = ?
  `;
  db.get(sql, [professorId], callback);
};

exports.fetchCoursesForProfessor = (professorId, callback) => {
  const sql = `
    SELECT c.id, c.course_name, c.period, c.semester_term, c.language
      FROM courses c
      JOIN course_professor cp ON c.id = cp.course_id
     WHERE cp.professor_id = ?`;
  db.all(sql, [professorId], callback);
}; 