const router = require('express').Router();
const { add, list, features } = require('../controllers/ratingController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/features', features);                              // list checkbox types
router.post('/', authMiddleware, add);                          // create rating
router.get('/course/:cid/prof/:pid', list);                     // list ratings

module.exports = router;
