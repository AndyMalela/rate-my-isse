const db = require('../db');

exports.create = (userId, data, cb) => {
  const {
    course_id, professor_id,
    rating_professor, rating_hardness,
    review_text, feature_ids = []
  } = data;

  // Handle "no_professor" case
  const actualProfessorId = professor_id === 'no_professor' ? null : professor_id;

  // Check for existing review by this user for this course+professor
  db.get(
    `SELECT id FROM ratings WHERE user_id = ? AND course_id = ? AND (professor_id = ? OR (professor_id IS NULL AND ? IS NULL))`,
    [userId, course_id, actualProfessorId, actualProfessorId],
    (err, row) => {
      if (err) return cb(err);
      if (row) return cb(new Error('User has already reviewed this course/professor'));
      // Insert new review
      db.run(
        `INSERT INTO ratings
           (user_id, course_id, professor_id,
            rating_professor, rating_hardness, review_text)
         VALUES (?,?,?,?,?,?)`,
        [userId, course_id, actualProfessorId,
         rating_professor, rating_hardness, review_text],
        function (err) {
          if (err) return cb(err);
          const rid = this.lastID;
          feature_ids.forEach(fid => {
            db.run(
              'INSERT OR IGNORE INTO rating_to_feature(rating_id,feature_id) VALUES(?,?)',
              [rid, fid]
            );
          });
          cb(null, { rating_id: rid });
        }
      );
    }
  );
};
exports.getRecentRatings = (callback) => {
  const sql = `
    SELECT r.*, p.name AS professor_name, c.course_name
    FROM ratings r
    JOIN professors p ON r.professor_id = p.id
    JOIN courses c ON r.course_id = c.id
    ORDER BY r.created_at DESC
    LIMIT 5
  `;
  db.all(sql, [], callback);
};

exports.byCourseProf = (cid, pid, cb) =>
  db.all(
    `SELECT r.*, GROUP_CONCAT(f.name) AS features
       FROM ratings r
       LEFT JOIN rating_to_feature rf ON r.id = rf.rating_id
       LEFT JOIN rating_features   f ON f.id = rf.feature_id
      WHERE r.course_id = ? AND r.professor_id = ?
      GROUP BY r.id`,
    [cid, pid],
    cb
  );

exports.byCourse = (cid, cb) =>
  db.all(
    `SELECT r.*, 
            c.course_name,
            u.name as user_name,
            CASE 
              WHEN p.name IS NOT NULL THEN p.name 
              ELSE 'No Professor Assigned' 
            END as professor_name, 
            GROUP_CONCAT(f.name) AS features
       FROM ratings r
       LEFT JOIN courses c ON r.course_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN professors p ON r.professor_id = p.id
       LEFT JOIN rating_to_feature rf ON r.id = rf.rating_id
       LEFT JOIN rating_features   f ON f.id = rf.feature_id
      WHERE r.course_id = ?
      GROUP BY r.id`,
    [cid],
    cb
  );

exports.byProfessor = (pid, cb) =>
  db.all(
    `SELECT r.*, c.course_name, u.name as user_name, GROUP_CONCAT(f.name) AS features
       FROM ratings r
       LEFT JOIN courses c ON r.course_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN rating_to_feature rf ON r.id = rf.rating_id
       LEFT JOIN rating_features   f ON f.id = rf.feature_id
      WHERE r.professor_id = ?
      GROUP BY r.id`,
    [pid],
    cb
  );

exports.byUserCourse = (uid, cid, cb) =>
  db.get(
    `SELECT r.*, 
            c.course_name,
            u.name as user_name,
            CASE 
              WHEN p.name IS NOT NULL THEN p.name 
              ELSE 'No Professor Assigned' 
            END as professor_name, 
            GROUP_CONCAT(f.name) AS features
       FROM ratings r
       LEFT JOIN courses c ON r.course_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN professors p ON r.professor_id = p.id
       LEFT JOIN rating_to_feature rf ON r.id = rf.rating_id
       LEFT JOIN rating_features   f ON f.id = rf.feature_id
      WHERE r.user_id = ? AND r.course_id = ?
      GROUP BY r.id`,
    [uid, cid],
    cb
  );

exports.update = (rid, userId, data, cb) => {
  const {
    rating_professor, rating_hardness, review_text, feature_ids = []
  } = data;
  db.run(
    `UPDATE ratings SET rating_professor = ?, rating_hardness = ?, review_text = ? WHERE id = ? AND user_id = ?`,
    [rating_professor, rating_hardness, review_text, rid, userId],
    function (err) {
      if (err) return cb(err);
      // Update features: remove old, add new
      db.run('DELETE FROM rating_to_feature WHERE rating_id = ?', [rid], () => {
        feature_ids.forEach(fid => {
          db.run('INSERT OR IGNORE INTO rating_to_feature(rating_id,feature_id) VALUES(?,?)', [rid, fid]);
        });
        cb(null, { updated: true });
      });
    }
  );
};

exports.delete = (rid, userId, cb) => {
  db.run('DELETE FROM ratings WHERE id = ? AND user_id = ?', [rid, userId], function (err) {
    if (err) return cb(err);
    db.run('DELETE FROM rating_to_feature WHERE rating_id = ?', [rid], () => cb(null, { deleted: true }));
  });
};

exports.listFeatures = cb =>
  db.all('SELECT * FROM rating_features', cb);

exports.byUser = (userId, cb) =>
  db.all(
    `SELECT r.*, 
            c.course_name,
            u.name as user_name,
            CASE 
              WHEN p.name IS NOT NULL THEN p.name 
              ELSE 'No Professor Assigned' 
            END as professor_name,
            GROUP_CONCAT(f.name) AS features
       FROM ratings r
       LEFT JOIN courses c ON r.course_id = c.id
       LEFT JOIN users u ON r.user_id = u.id
       LEFT JOIN professors p ON r.professor_id = p.id
       LEFT JOIN rating_to_feature rf ON r.id = rf.rating_id
       LEFT JOIN rating_features   f ON f.id = rf.feature_id
      WHERE r.user_id = ?
      GROUP BY r.id
      ORDER BY r.id DESC`,
    [userId],
    cb
  );

exports.getProfessorStats = (pid, cb) =>
  db.get(
    `SELECT 
       AVG(rating_professor) as avg_professor_rating,
       AVG(rating_hardness) as avg_hardness_rating,
       COUNT(*) as total_reviews
     FROM ratings 
     WHERE professor_id = ?`,
    [pid],
    cb
  );
