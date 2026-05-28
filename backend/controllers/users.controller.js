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