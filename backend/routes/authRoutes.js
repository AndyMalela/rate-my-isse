const express = require('express');
const router = express.Router();
const { register, login, getMe, logout, updateName} = require('../controllers/authController.js');
const { authMiddleware } = require('../middleware/authMiddleware.js');
const {authenticateToken} = require('../middleware/authMiddleware.js');

//routes
router.post('/register-user', register);
router.post('/login-user', login);
router.post('/logout', logout);
router.put('/user/:id',authMiddleware, updateName);

router.get('/me',authMiddleware, getMe); 


module.exports = router;