const User = require('../models/User');

function cosineSimilarity(a, b) {
    const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
    const magB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
    if (magA === 0 || magB === 0) return 0;   // avoid NaN
    return dot / (magA * magB);
}

async function updateCareerGoal(req, res) {
    try {
        const { careerGoal, embedding } = req.body;
        const userId = req.session.user?.id || req.user?._id;

        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const updatedUser = await User.findByIdAndUpdate(
        userId,
        { careerGoal, careerEmbedding: embedding },
        { returnDocument: "after" }
        // { new: true }
        ).select("-careerEmbedding -password");
        
        
        res.json({ message: "Career goal updated", careerGoal: updatedUser.careerGoal });
    } catch (error) {
        
        res.status(500).json({ message: error.message });
    }
}

async function recommendFriends(req, res) {
    try {
        const userId = req.session.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const currentUser = await User.findById(userId);
        const queryEmbedding = currentUser.careerEmbedding;
        if (!queryEmbedding || queryEmbedding.length === 0) return res.json([]);

        // 1. Everyone we should NOT recommend: self, friends, and pending requests
        const excludeIds = [
            userId,
            ...currentUser.friends,
            ...currentUser.sentRequests,
            ...currentUser.receivedRequests,
        ];

        // 2. Candidate pool: users with an embedding, not already connected
        const candidates = await User.find({
            _id: { $nin: excludeIds },
            careerEmbedding: { $exists: true, $ne: [] },
        });

        // 3. Score by career similarity, sort, take top 3
        const recommendations = candidates
            .map(user => ({
                _id: user._id,
                name: user.name,
                email: user.email,
                careerGoal: user.careerGoal,
                score: cosineSimilarity(queryEmbedding, user.careerEmbedding),
            }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3);

        res.json(recommendations);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

// async function getMe(req, res) {
//     try {
//         const userId = req.session.user?.id || req.user?._id;
//         if (!userId) return res.status(401).json({ message: "Unauthorized" });

//         const currentUser = await User.findById(userId).populate("name email careerGoal");
//         if (!currentUser) return res.status(404).json({ message: "Current user not found"});

//         res.json(currentUser);

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// }

async function getUsers(req, res) {
    try {
        const userId = req.session.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        // Not including current user
        const users = await User.find({ _id: { $ne: userId } }).select("-password -role -careerEmbedding -friends");
        res.json(users);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getFriends(req, res) {
    try {
        const userId = req.session.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const currentUser = await User.findById(userId).populate("friends", "name careerGoal");
        if (!currentUser) return res.status(404).json({ message: "Current user not found"});

        res.json(currentUser.friends);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getIncomingRequests(req, res) {
    try {
        const userId = req.session.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const currentUser = await User.findById(userId).populate("receivedRequests", "name email careerGoal");
        if (!currentUser) return res.status(404).json({ message: "Current user not found"});

        res.json(currentUser.receivedRequests);
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function sendFriendRequest(req, res) {
    try {
        const userId = req.session.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { friendId } = req.body;
        if (!friendId) return res.status(400).json({ message: "Friend ID required"});

        const currentUser = await User.findById(userId);
        if (!currentUser) return res.status(404).json({ message: "Current user not found"});

        const friendUser = await User.findById(friendId);
        if (!friendUser) return res.status(404).json({ message: "Friend user not found"});

        if (friendUser.receivedRequests.includes(userId) && currentUser.sentRequests.includes(friendId)) return res.status(400).json({ message: "Request already sent" });
        if (friendUser.friends.includes(userId) && currentUser.friends.includes(friendId)) return res.status(400).json({ message: "Already friends" });

        currentUser.sentRequests.push(friendId);
        await currentUser.save();

        friendUser.receivedRequests.push(userId);
        await friendUser.save();

        res.json({ message: "Friend request sent" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}

async function acceptFriendRequest(req, res) {
    try {
        const userId = req.session.user?.id || req.user?._id;
        if (!userId) return res.status(401).json({ message: "Unauthorized" });

        const { incomingId } = req.body;
        if (!incomingId) return res.status(400).json({ message: "Friend ID required"});

        const currentUser = await User.findById(userId);
        if (!currentUser) return res.status(404).json({ message: "Current user not found"});

        if (!currentUser.receivedRequests.includes(incomingId)) return res.status(400).json({ message: "No friend request from this user" });

        await User.findByIdAndUpdate(userId, {
            $push: { friends: incomingId },
            $pull: { receivedRequests: incomingId }
        });

        await User.findByIdAndUpdate(incomingId, {
            $push: { friends: userId },
            $pull: { sentRequests: userId }
        });

        res.json({ message: "Friend request accepted" });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}



module.exports = {
    updateCareerGoal,
    recommendFriends,
    sendFriendRequest,
    acceptFriendRequest,
    // getMe,
    getUsers,
    getFriends,
    getIncomingRequests
};