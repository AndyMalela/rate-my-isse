const db = require('../db');

exports.create = (userId, data, cb) => {
  const {
    course_id, professor_id,
    rating_professor, rating_hardness,
    review_text, feature_ids = []
  } = data;

  db.run(
    `INSERT INTO ratings
       (user_id, course_id, professor_id,
        rating_professor, rating_hardness, review_text)
     VALUES (?,?,?,?,?,?)`,
    [userId, course_id, professor_id,
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

exports.listFeatures = cb =>
  db.all('SELECT * FROM rating_features', cb);
