const router = require('express').Router();
const { add, list, features, listByCourse, listByProfessor, getUserCourseReview, update, delete: del, getUserReviews, getProfessorStats } = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/features', features);                              // list checkbox types
router.post('/', authMiddleware, add);                          // create rating
router.get('/course/:cid/prof/:pid', list);                     // list ratings
router.get('/course/:cid', listByCourse);
router.get('/prof/:pid', listByProfessor);
router.get('/prof/:pid/stats', getProfessorStats);              // get professor statistics
router.get('/user/:uid/course/:cid', getUserCourseReview);
router.get('/user/:uid', getUserReviews);
router.put('/:rid', authMiddleware, update);
router.delete('/:rid', authMiddleware, del);

module.exports = router;
