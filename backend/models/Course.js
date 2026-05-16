const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  subject: String,
  courseNumber: String,
  title: String,
  description: String,
  rawDescription: String,
  term: String,
  crn: String,
  embedding: {
    type: [Number],
    default: []
  }
})

module.exports = mongoose.model("Course", CourseSchema);