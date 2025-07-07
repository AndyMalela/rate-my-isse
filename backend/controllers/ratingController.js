const ratingModel = require('../models/ratingModel');

exports.add = (req, res) => {
  ratingModel.create(req.user.id, req.body,
    (err, result) =>
      err ? res.status(500).json({ error: err.message })
          : res.status(201).json(result)
  );
};

exports.list = (req, res) => {
  ratingModel.byCourseProf(req.params.cid, req.params.pid,
    (err, rows) =>
      err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
};

exports.features = (_, res) =>
  ratingModel.listFeatures((err, rows) =>
    err ? res.status(500).json({ error: err.message }) : res.json(rows)
  );
