const Course = require("../models/Course")

async function getCourses(req, res) {
    const courses = await Course.find();
    res.json(books);
}

