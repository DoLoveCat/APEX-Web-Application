const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
    updateCareerGoal,
    recommendFriends,
    sendFriendRequest,
    acceptFriendRequest,
    // getMe,
    getUsers,
    getFriends,
    getIncomingRequests
} = require("../controllers/userController");

router.put("/career-goal", authMiddleware, updateCareerGoal);
router.get("/recommend-friends", authMiddleware, recommendFriends);
router.post("/send-friend-request", authMiddleware, sendFriendRequest);
router.post("/accept-friend-request", authMiddleware, acceptFriendRequest);
// router.get("/me", authMiddleware, getMe);
router.get("/users", authMiddleware, getUsers);
router.get("/friends", authMiddleware, getFriends);
router.get("/incoming-requests", authMiddleware, getIncomingRequests);

module.exports = router;