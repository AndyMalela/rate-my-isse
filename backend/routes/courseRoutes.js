const express = require('express');
const router = express.Router();
const courseController = require('../controllers/courseController');

// GET /api/courses
router.get('/', courseController.getAllCourses);

// GET /api/courses/:id/professors
router.get('/:id/professors', courseController.getCourseProfessors);

// GET /api/courses/:cid/professors/:pid/ratings (UNCOMMENT WHEN IMPLEMENT)
// router.get('/:cid/professors/:pid/ratings', courseController.getRatings);

module.exports = router;
