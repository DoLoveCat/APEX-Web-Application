const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    getCourses,
    getCourseById,
    keywordSearchCourses,
    semanticSearch
} = require("../controllers/courseController");

router.get("/", authMiddleware, getCourses);
router.get("/search", authMiddleware, keywordSearchCourses);
router.get("/semantic", authMiddleware, semanticSearch);
router.get("/:id", authMiddleware, getCourseById);

module.exports = router;