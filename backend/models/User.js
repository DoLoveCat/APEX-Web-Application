const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Required at signup
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters']
  },
  role: {
    type: String,
    enum: ['student', 'mentor', 'admin'],
    required: [true, 'Role is required']
  },

  // Optional - filled in via profile later
  major: {
    type: String,
    trim: true
  },
  year: {
    type: String,
    enum: ['freshman', 'sophomore', 'junior', 'senior', 'graduate', 'alumni', null],
    default: null
  },
  careerGoal: {
    type: String,
    trim: true
  },
  currentCourses: {
    type: [String],
    default: []
  },
  skills: {
    type: [String],
    default: []
  },

  // Auto-generated
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);