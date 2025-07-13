const db = require('../db');

// 1. Get all courses with associated professor name (for frontend dropdown)
exports.fetchAllCourses = (search, callback) => {
  let sql = `
    SELECT 
      c.id, 
      c.course_name, 
      c.period, 
      c.semester_term, 
      c.language, 
      p.id AS professor_id, 
      p.name AS professor_name
    FROM courses c
    LEFT JOIN course_professor cp ON c.id = cp.course_id
    LEFT JOIN professors p ON cp.professor_id = p.id
  `;

  const params = [];

  if (search) {
    const words = search.trim().split(/\s+/);
    if (words.length > 0) {
      const likeClauses = words.map(() => 'c.course_name LIKE ? OR p.name LIKE ?').join(' OR ');
      sql += ' WHERE ' + likeClauses;
      words.forEach(word => {
        const pattern = `%${word}%`;
        params.push(pattern, pattern);
      });
    }
  }

  sql += ' ORDER BY c.course_name ASC';

  db.all(sql, params, callback);
};

// 2. Get a single course by ID
exports.fetchCourseById = (courseId, callback) => {
  const sql = `
    SELECT id, course_name, period, semester_term, language 
    FROM courses 
    WHERE id = ?
  `;
  db.get(sql, [courseId], callback);
};

// 3. Get all professors teaching a specific course (for dropdowns or validation)
exports.fetchProfessorsForCourse = (courseId, callback) => {
  const sql = `
    SELECT p.id, p.name
    FROM professors p
    JOIN course_professor cp ON p.id = cp.professor_id
    WHERE cp.course_id = ?
  `;
  db.all(sql, [courseId], callback);
};

// 4. Fetch all ratings for a course-professor pair
exports.fetchRatings = (courseId, professorId, callback) => {
  const sql = `
    SELECT * 
    FROM ratings 
    WHERE course_id = ? AND professor_id = ?
  `;
  db.all(sql, [courseId, professorId], callback);
};
