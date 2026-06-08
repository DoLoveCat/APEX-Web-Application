const express = require("express");

const router = express.Router();

const { requireAuth } = require("../middleware/auth.middleware");

const {
    getCourses,
    getCourseById,
    keywordSearchCourses,
    semanticSearch,
    generateEmbedding,
    addCourse,
    editCourse,
    deleteCourse
} = require("../controllers/courseController");

router.get("/", requireAuth, getCourses);
router.get("/search", requireAuth, keywordSearchCourses);
router.get("/embed", requireAuth, generateEmbedding);
router.post("/semantic", requireAuth, semanticSearch);
router.get("/:id", requireAuth, getCourseById);
router.post("/", addCourse);
router.put("/:id", editCourse);
router.delete("/:id", deleteCourse);

module.exports = router;