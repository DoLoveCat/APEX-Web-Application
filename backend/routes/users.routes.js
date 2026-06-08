// backend/routes/users.routes.js

// match controllers/users.controller.js

const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth.middleware');
const usersController = require('../controllers/users.controller');

router.get('/me', requireAuth, usersController.getMe);
router.put('/me', requireAuth, usersController.updateMe);

router.get('/me/saved-courses', requireAuth, usersController.getSavedCourses);
router.post('/me/saved-courses', requireAuth, usersController.addSavedCourse);
router.delete('/me/saved-courses/:courseId', requireAuth, usersController.removeSavedCourse);

router.put('/career-goal', requireAuth, usersController.updateCareerGoal);

router.get("/users", requireAuth, usersController.getUsers);
router.delete("/:id", requireAuth, usersController.deleteUser);

// keep this LAST so it doesn't shadow /me, /me/saved-courses, etc.
router.get('/:id', requireAuth, usersController.getUserById);


module.exports = router;