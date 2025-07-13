const db = require('../db');

exports.fetchAllCourses = (search, callback) => {
  let sql = 'SELECT id, course_name, period, semester_term, language FROM courses';
  let params = [];
  if (search) {
    const words = search.trim().split(/\s+/);
    if (words.length > 0) {
      sql += ' WHERE ' + words.map(() => 'course_name LIKE ?').join(' OR ');
      params = words.map(w => `%${w}%`);
    }
  }
  db.all(sql, params, callback);
};

// If you want to support searching by a separate code column, add OR code LIKE ? to the WHERE clause and push the param again.

exports.fetchCourseById = (courseId, callback) => {
  const sql = `SELECT id, course_name, period, semester_term, language FROM courses WHERE id = ?`;
  db.get(sql, [courseId], callback);
};

exports.fetchProfessorsForCourse = (courseId, callback) => {
  const sql = `
    SELECT p.id, p.name
      FROM professors p
      JOIN course_professor cp ON p.id = cp.professor_id
     WHERE cp.course_id = ?`;
  db.all(sql, [courseId], callback);
};

exports.fetchRatings = (courseId, professorId, callback) => {
  db.all(
    `SELECT * FROM ratings WHERE course_id = ? AND professor_id = ?`,
    [courseId, professorId],
    callback
  );
};
