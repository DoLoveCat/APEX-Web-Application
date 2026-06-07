const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

const USER_FIELDS = 'name email careerGoal';

// GET /api/friends/search?q=...  -> find users by name (to add)
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) return res.json([]);

    const users = await User.find({
      name: { $regex: q.trim(), $options: 'i' },
      _id: { $ne: req.user._id }
    })
      .select(USER_FIELDS)
      .limit(20);

    res.json(users);
  } catch (error) {
    console.error('Search users error:', error);
    res.status(500).json({ error: 'Server error searching users' });
  }
};

// POST /api/friends/request { toUserId }  -> send a friend request
exports.sendRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    if (!toUserId) return res.status(400).json({ error: 'toUserId is required' });

    if (toUserId === req.user._id.toString()) {
      return res.status(400).json({ error: "You can't friend yourself" });
    }

    // already friends?
    if (req.user.friends.some((id) => id.toString() === toUserId)) {
      return res.status(400).json({ error: 'You are already friends' });
    }

    // existing pending request in either direction?
    const existing = await FriendRequest.findOne({
      status: 'pending',
      $or: [
        { from: req.user._id, to: toUserId },
        { from: toUserId, to: req.user._id }
      ]
    });
    if (existing) {
      return res.status(400).json({ error: 'A pending request already exists' });
    }

    const request = await FriendRequest.create({
      from: req.user._id,
      to: toUserId
    });
    res.status(201).json(request);
  } catch (error) {
    console.error('Send request error:', error);
    res.status(500).json({ error: 'Server error sending request' });
  }
};

// GET /api/friends/requests  -> my incoming pending requests
exports.getIncomingRequests = async (req, res) => {
  try {
    const requests = await FriendRequest.find({
      to: req.user._id,
      status: 'pending'
    })
      .populate('from', USER_FIELDS)
      .sort({ createdAt: -1 });

    res.json(requests);
  } catch (error) {
    console.error('Get incoming requests error:', error);
    res.status(500).json({ error: 'Server error fetching requests' });
  }
};

// POST /api/friends/accept { requestId }  -> accept, add each to the other's friends
exports.acceptRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await FriendRequest.findById(requestId);

    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only accept your own requests' });
    }

    request.status = 'accepted';
    await request.save();

    // add to each other's friends list (no duplicates)
    await User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } });
    await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } });

    res.json({ success: true });
  } catch (error) {
    console.error('Accept request error:', error);
    res.status(500).json({ error: 'Server error accepting request' });
  }
};

// POST /api/friends/decline { requestId }
exports.declineRequest = async (req, res) => {
  try {
    const { requestId } = req.body;
    const request = await FriendRequest.findById(requestId);

    if (!request) return res.status(404).json({ error: 'Request not found' });
    if (request.to.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'You can only decline your own requests' });
    }

    request.status = 'declined';
    await request.save();

    res.json({ success: true });
  } catch (error) {
    console.error('Decline request error:', error);
    res.status(500).json({ error: 'Server error declining request' });
  }
};

// GET /api/friends  -> my friends list
exports.getFriends = async (req, res) => {
  try {
    const me = await User.findById(req.user._id).populate('friends', USER_FIELDS);
    res.json(me.friends);
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ error: 'Server error fetching friends' });
  }
};
