const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText: {
    type: String,
    required: [true, 'Question text is required']
  },
  type: {
    type: String,
    enum: ['MCQ', 'TrueFalse', 'Text'],
    required: [true, 'Question type is required']
  },
  options: [{
    type: String
  }],
  correctAnswer: {
    type: String,
    required: [true, 'Correct answer is required']
  }
});

const quizSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Quiz title is required'],
    trim: true
  },
  questions: [questionSchema],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Quiz', quizSchema);
