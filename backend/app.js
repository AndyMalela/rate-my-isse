const express = require('express');
const cors = require('cors');
const courseRoutes = require('./routes/courseRoutes');
// const professorRoutes = require('./routes/professorRoutes'); (UNCOMMENT WHEN WE IMPLEMENT)

const app = express();
app.use(cors());
app.use(express.json());

// Mount your route files
app.use('/api/courses', courseRoutes);
// app.use('/api/professors', professorRoutes);(UNCOMMENT WHEN WE IMPLEMENT)

module.exports = app;
