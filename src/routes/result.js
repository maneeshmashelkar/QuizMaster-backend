const express = require('express');
const router = express.Router();
const { getUserResults } = require('../controllers/resultController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/my-results', authMiddleware, getUserResults);

module.exports = router;
