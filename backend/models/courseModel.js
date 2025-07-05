const db = require('../db');

exports.fetchAllCourses = callback => {
  db.all('SELECT id, course_name, period, semester_term, language FROM courses', callback);
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
