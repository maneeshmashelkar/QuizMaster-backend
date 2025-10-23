const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');
const { createQuiz, getAdminQuizzes, updateQuiz, deleteQuiz } = require('../controllers/quizController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

router.use(adminMiddleware);

router.post('/quiz', createQuiz);
router.get('/quiz', getAdminQuizzes);
router.put('/quiz/:id', updateQuiz);
router.delete('/quiz/:id', deleteQuiz);

module.exports = router;
