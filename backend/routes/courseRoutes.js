const express = require("express");

const router = express.Router();

const {
    getCourses,
    getCourseById,
    searchCourses
} = require("../controllers/courseController");

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.get("/search", searchCourses);

module.exports = router;