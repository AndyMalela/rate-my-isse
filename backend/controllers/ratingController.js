const ratingModel = require('../models/ratingModel');

exports.add = (req, res) => {
  ratingModel.create(req.user.id, req.body,
    (err, result) => {
      if (err) {
        if (err.message && err.message.includes('already reviewed')) {
          return res.status(400).json({ error: err.message });
        }
        return res.status(500).json({ error: err.message });
      }
      res.status(201).json(result);
    }
  );
};

exports.list = (req, res) => {
  ratingModel.byCourseProf(req.params.cid, req.params.pid,
    (err, rows) =>
      err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
};

exports.listByCourse = (req, res) => {
  ratingModel.byCourse(req.params.cid, (err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
};

exports.listByProfessor = (req, res) => {
  ratingModel.byProfessor(req.params.pid, (err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
};

exports.getUserCourseReview = (req, res) => {
  ratingModel.byUserCourse(req.params.uid, req.params.cid, (err, row) =>
    err ? res.status(500).json({ error: err.message }) : res.json(row)
  );
};

exports.update = (req, res) => {
  ratingModel.update(req.params.rid, req.user.id, req.body, (err, result) =>
    err ? res.status(500).json({ error: err.message }) : res.json(result)
  );
};

exports.delete = (req, res) => {
  ratingModel.delete(req.params.rid, req.user.id, (err, result) =>
    err ? res.status(500).json({ error: err.message }) : res.json(result)
  );
};

exports.features = (_, res) =>
  ratingModel.listFeatures((err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );

exports.getUserReviews = (req, res) => {
  ratingModel.byUser(req.params.uid, (err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
};

exports.getProfessorStats = (req, res) => {
  ratingModel.getProfessorStats(req.params.pid, (err, stats) =>
    err ? res.status(500).json({ error: err.message }) : res.json(stats)
  );
};
