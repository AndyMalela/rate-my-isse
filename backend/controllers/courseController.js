const courseModel = require('../models/courseModel');

exports.getAllCourses = (req, res) => {
  courseModel.fetchAllCourses((err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getCourseProfessors = (req, res) => {
  courseModel.fetchProfessorsForCourse(req.params.id, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getRatings = (req, res) => {
  courseModel.fetchRatings(req.params.cid, req.params.pid, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};
