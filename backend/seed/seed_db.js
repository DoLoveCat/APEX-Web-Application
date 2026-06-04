const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const Course = require("../models/Course");
require("dotenv").config({ path: "../.env" });

async function seed() {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");
    
    const filePath = path.join(__dirname, "embedded-courses.json");
    const raw = fs.readFileSync(filePath, "utf-8");
    const courses = JSON.parse(raw);

    let savedCourses = 0;

    for (const course of courses) {
        await Course.findOneAndUpdate(
            { subject: course.subject, courseNumber: course.courseNumber },
            {
                subject: course.subject,
                courseNumber: course.courseNumber,
                title: course.title,
                description: course.description,
                rawDescription: course.rawDescription,
                term: course.term,
                crn: course.crn,
                embedding: course.embedding
            },
            { upsert: true, new: true }
        );

        console.log(`Saved: ${course.subject} ${course.courseNumber}`);
        savedCourses++;
    }

    console.log(`Done! ${savedCourses} courses seeded.`);
    await mongoose.disconnect();
}

seed().catch(console.error);