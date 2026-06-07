const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    googleId: {
        type: String,
        default: null
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email']
    },
    password: {
        type: String,
        // required: [true, 'Password is required'], // removed because of google login
        minlength: [8, 'Password must be at least 8 characters']
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    },
    careerGoal: {
        type: String,
        trim: true
    },
    careerEmbedding: {
        type: [Number],
        default: []
    },
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    sentRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    receivedRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: []
    }],
    savedCourses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        default: []
    }]
});

module.exports = mongoose.model('User', userSchema);