const Quiz = require('../models/Quiz');

const createQuiz = async (req, res) => {
  try {
    const { title, questions } = req.body;

    if (!title || !questions || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: 'Title and questions are required' });
    }

    for (let question of questions) {
      if (!question.questionText || !question.type || !question.correctAnswer) {
        return res.status(400).json({ message: 'Each question must have questionText, type, and correctAnswer' });
      }

      if (question.type === 'MCQ' && (!question.options || question.options.length < 2)) {
        return res.status(400).json({ message: 'MCQ questions must have at least 2 options' });
      }
    }

    const quiz = await Quiz.create({
      title,
      questions,
      createdBy: req.admin._id
    });

    res.status(201).json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAdminQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find({ createdBy: req.admin._id })
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateQuiz = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, questions } = req.body;

    const quiz = await Quiz.findOne({ _id: id, createdBy: req.admin._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    if (title) quiz.title = title;
    if (questions) {
      for (let question of questions) {
        if (!question.questionText || !question.type || !question.correctAnswer) {
          return res.status(400).json({ message: 'Each question must have questionText, type, and correctAnswer' });
        }
      }
      quiz.questions = questions;
    }

    await quiz.save();

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteQuiz = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findOne({ _id: id, createdBy: req.admin._id });
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    await Quiz.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .select('title createdAt')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getQuizById = async (req, res) => {
  try {
    const { id } = req.params;

    const quiz = await Quiz.findById(id);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    const quizWithoutAnswers = {
      _id: quiz._id,
      title: quiz.title,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        questionText: q.questionText,
        type: q.type,
        options: q.options
      })),
      createdAt: quiz.createdAt
    };

    res.json({
      success: true,
      quiz: quizWithoutAnswers
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createQuiz,
  getAdminQuizzes,
  updateQuiz,
  deleteQuiz,
  getAllQuizzes,
  getQuizById
};
