const courseModel = require('../models/courseModel');

exports.getAllCourses = (req, res) => {
  const search = req.query.search || '';
  courseModel.fetchAllCourses(search, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getCourseById = (req, res) => {
  const id = req.params.id;
  courseModel.fetchCourseById(id, (err, course) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    courseModel.fetchProfessorsForCourse(id, (err, professors) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...course, professors });
    });
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
