const Quiz = require('../models/Quiz');
const Result = require('../models/Result');

const submitQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Answers array is required' });
    }

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (answers.length !== quiz.questions.length) {
      return res.status(400).json({ message: 'Number of answers must match number of questions' });
    }

    let score = 0;
    const processedAnswers = [];

    for (let i = 0; i < quiz.questions.length; i++) {
      const question = quiz.questions[i];
      const userAnswer = answers[i].answer;
      let isCorrect = false;

      if (question.type === 'Text') {
        isCorrect = userAnswer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
      } else {
        isCorrect = userAnswer === question.correctAnswer;
      }

      if (isCorrect) score++;

      processedAnswers.push({
        questionId: question._id,
        answer: userAnswer,
        isCorrect
      });
    }

    const result = await Result.create({
      quizId: id,
      userId: req.user ? req.user._id : null,
      answers: processedAnswers,
      score,
      totalQuestions: quiz.questions.length,
      isAnonymous: !req.user
    });

    const correctAnswers = quiz.questions.map(q => ({
      questionId: q._id,
      questionText: q.questionText,
      correctAnswer: q.correctAnswer
    }));

    res.json({
      success: true,
      result: {
        score,
        totalQuestions: quiz.questions.length,
        percentage: Math.round((score / quiz.questions.length) * 100),
        submittedAt: result.submittedAt,
        isAnonymous: result.isAnonymous
      },
      correctAnswers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getUserResults = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const results = await Result.find({ userId: req.user._id })
      .populate('quizId', 'title')
      .sort({ submittedAt: -1 });

    res.json({
      success: true,
      results
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitQuiz,
  getUserResults
};
