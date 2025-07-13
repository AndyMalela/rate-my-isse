const professorModel = require('../models/professorModel');

exports.getAllProfessors = (req, res) => {
  const search = req.query.search || '';
  professorModel.fetchAllProfessors(search, (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
};

exports.getProfessorById = (req, res) => {
  const id = req.params.id;
  professorModel.fetchProfessorById(id, (err, professor) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!professor) return res.status(404).json({ error: 'Professor not found' });
    professorModel.fetchCoursesForProfessor(id, (err, courses) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ ...professor, courses });
    });
  });
}; 