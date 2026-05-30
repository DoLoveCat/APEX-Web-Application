const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser');

const connectDB = require("./config/db");

const passport = require('passport');
require("./config/passport");

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(
    session({
        secret: process.env.SESSION_SECRET || "secretKey",
        resave: false,
        saveUninitialized: false,

        store: MongoStore.create({
            mongoUrl: process.env.MONGO_URI
        }),

        cookie: {
            maxAge: 1000 * 60 * 60 * 24,
            httpOnly: true,
            secure: false
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api/courses", require("./routes/courseRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
