const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const professorRoutes = require('./routes/professorRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000', // ✅ Frontend origin
  credentials: true                // ✅ Send cookies
}));
app.use(express.json());
app.use(cookieParser());

// Mount your route files
app.use("/api/courses", courseRoutes);
app.use('/api/professors', professorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ratings", ratingRoutes);

module.exports = app;
