// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const verifyToken = require('../middlewares/verifyToken');
const checkRole = require('../middlewares/checkRole');

router.post('/register', authController.register);
router.post('/login', authController.login);

// Get current user data
router.get('/me', verifyToken, authController.getMe);

// Only manager can verify employees
router.patch('/verify/:userId', verifyToken, checkRole('manager'), authController.verifyUser);

router.get('/users', authController.getAllUsers);


module.exports = router;
