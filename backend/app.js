const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const professorRoutes = require('./routes/professorRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Mount your route files
app.use("/api/courses", courseRoutes);
app.use('/api/professors', professorRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/ratings", ratingRoutes);

// Serve static files from the React app
const path = require('path');
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't match an API route, send back React's index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
module.exports = app;
