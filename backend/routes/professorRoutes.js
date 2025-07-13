const express = require('express');
const router = express.Router();
const professorController = require('../controllers/professorController');

// GET /api/professors
router.get('/', professorController.getAllProfessors);

// GET /api/professors/:id
router.get('/:id', professorController.getProfessorById);

module.exports = router; 