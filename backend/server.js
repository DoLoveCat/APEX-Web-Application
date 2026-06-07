const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth.routes');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());

// Any request that starts with /api/auth/... should go to the auth routes file
app.use('/api/auth', authRoutes);
app.use('/api/users', require('./routes/users.routes'));
app.use('/api/courses', require('./routes/courseRoutes'));
app.use('/api/chat', require('./routes/chat.routes'));
app.use('/api/friends', require('./routes/friend.routes'));

// add users.routes here to handle user profile related routes like /api/users/me

// Routes
app.get('/', (req, res) => {
  res.send('Hello from Apex backend!!!!');
});

app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.json({
    status: 'ok',
    server: 'running',
    database: dbStatus,
    timestamp: new Date()
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

