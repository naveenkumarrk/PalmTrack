// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

router.get('/summary', dashboardController.getDashboardSummary);
router.post('/chat-summary', dashboardController.getChatSummary);
module.exports = router;
