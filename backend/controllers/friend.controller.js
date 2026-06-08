const User = require('../models/User');
const FriendRequest = require('../models/FriendRequest');

const USER_FIELDS = 'name email careerGoal';

// Measures how similar two career-goal embeddings are (1 = identical direction,
// 0 = unrelated). Returns 0 for empty/zero vectors to avoid NaN.
function cosineSimilarity(a, b) {
  const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

// GET /api/friends/search?q=...  -> find users by name (to add)
exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) return res.json([]);

    const users = await User.find({
      name: { $regex: q.trim(), $options: 'i' },
      _id: { $ne: req.user._id },
      role: { $ne: "admin" }
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

// GET /api/friends/recommendations  -> users with the most similar career goals
exports.getRecommendations = async (req, res) => {
  try {
    const queryEmbedding = req.user.careerEmbedding;
    // No career goal set yet -> nothing to compare against
    if (!queryEmbedding || queryEmbedding.length === 0) return res.json([]);

    // Anyone with a pending request in either direction shouldn't be suggested
    const pending = await FriendRequest.find({
      status: 'pending',
      $or: [{ from: req.user._id }, { to: req.user._id }]
    }).select('from to');

    // Exclude: myself + existing friends + pending requests
    const excludeIds = new Set([
      req.user._id.toString(),
      ...req.user.friends.map((id) => id.toString()),
      ...pending.flatMap((r) => [r.from.toString(), r.to.toString()])
    ]);

    // Candidate pool: other users who have a career embedding
    const candidates = await User.find({
      _id: { $nin: [...excludeIds] },
      careerEmbedding: { $exists: true, $ne: [] },
      role: { $ne: "admin" }
    }).select('name email careerGoal careerEmbedding');

    // Score by career similarity, sort high-to-low, return the top 5
    const recommendations = candidates
      .map((user) => ({
        _id: user._id,
        name: user.name,
        email: user.email,
        careerGoal: user.careerGoal,
        score: cosineSimilarity(queryEmbedding, user.careerEmbedding)
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    res.json(recommendations);
  } catch (error) {
    console.error('Get recommendations error:', error);
    res.status(500).json({ error: 'Server error fetching recommendations' });
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
