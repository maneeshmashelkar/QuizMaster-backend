const express = require('express');
const router = express.Router();
const { getAllQuizzes, getQuizById } = require('../controllers/quizController');
const { submitQuiz } = require('../controllers/resultController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', getAllQuizzes);
router.get('/:id', getQuizById);
router.post('/:id/submit', authMiddleware, submitQuiz);

module.exports = router;
