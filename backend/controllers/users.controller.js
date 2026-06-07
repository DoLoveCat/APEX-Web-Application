// backend/controllers/users.controller.js

exports.getMe = async (req, res) => {
  res.json({ user: req.user });
};

exports.updateMe = async (req, res) => {
  try {
    const allowedFields = [
      'name',
      'major',
      'year',
      'school',
      'bio',
      'avatar',
      'pathTags'
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        req.user[field] = req.body[field];
      }
    });

    await req.user.save();

    res.json({
      message: 'Profile updated successfully',
      user: req.user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

const SAVED_SELECT = '-embedding -rawDescription';
const MAX_SAVED = 10;

// GET /api/users/me/saved-courses -> the user's starred courses
exports.getSavedCourses = async (req, res) => {
  try {
    await req.user.populate({ path: 'savedCourses', select: SAVED_SELECT });
    res.json(req.user.savedCourses);
  } catch (error) {
    console.error('Get saved courses error:', error);
    res.status(500).json({ error: 'Failed to load saved courses' });
  }
};

// POST /api/users/me/saved-courses { courseId } -> star a course (max 10)
exports.addSavedCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) return res.status(400).json({ error: 'courseId is required' });

    const alreadySaved = req.user.savedCourses.some((id) => id.toString() === courseId);

    if (!alreadySaved) {
      if (req.user.savedCourses.length >= MAX_SAVED) {
        return res.status(400).json({ error: `You can only save up to ${MAX_SAVED} courses` });
      }
      req.user.savedCourses.push(courseId);
      await req.user.save();
    }

    await req.user.populate({ path: 'savedCourses', select: SAVED_SELECT });
    res.json(req.user.savedCourses);
  } catch (error) {
    console.error('Add saved course error:', error);
    res.status(500).json({ error: 'Failed to save course' });
  }
};

// DELETE /api/users/me/saved-courses/:courseId -> unstar a course
exports.removeSavedCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    req.user.savedCourses = req.user.savedCourses.filter((id) => id.toString() !== courseId);
    await req.user.save();

    await req.user.populate({ path: 'savedCourses', select: SAVED_SELECT });
    res.json(req.user.savedCourses);
  } catch (error) {
    console.error('Remove saved course error:', error);
    res.status(500).json({ error: 'Failed to remove course' });
  }
};

// PUT /api/users/career-goal { careerGoal, embedding } -> persist the user's goal
exports.updateCareerGoal = async (req, res) => {
  try {
    const { careerGoal, embedding } = req.body;

    if (typeof careerGoal === 'string') req.user.careerGoal = careerGoal;
    if (Array.isArray(embedding)) req.user.careerEmbedding = embedding;

    await req.user.save();
    res.json({ careerGoal: req.user.careerGoal });
  } catch (error) {
    console.error('Update career goal error:', error);
    res.status(500).json({ error: 'Failed to save career goal' });
  }
};