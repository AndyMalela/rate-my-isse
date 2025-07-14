const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const courseRoutes = require("./routes/courseRoutes");
const authRoutes = require("./routes/authRoutes");
const professorRoutes = require('./routes/professorRoutes');
const ratingRoutes = require('./routes/ratingRoutes');

const app = express();

// Monkey-patch app.use to log all calls
const originalUse = app.use;
app.use = function(...args) {
  console.log("app.use called with:", args[0]);
  return originalUse.apply(this, args);
};

console.log("Registering middleware: cors");
app.use(cors());
console.log("Registering middleware: express.json");
app.use(express.json());
console.log("Registering middleware: cookieParser");
app.use(cookieParser());

// Mount your route files
console.log("Registering route: /api/courses");
app.use("/api/courses", courseRoutes);
console.log("Registering route: /api/professors");
app.use('/api/professors', professorRoutes);
console.log("Registering route: /api/auth");
app.use("/api/auth", authRoutes);
console.log("Registering route: /api/ratings");
app.use("/api/ratings", ratingRoutes);

// Serve static files from the React app
const path = require('path');
console.log("Registering static file serving for /frontend/build");
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't match an API route, send back React's index.html
console.log("Registering catch-all route: *");
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});
module.exports = app;
