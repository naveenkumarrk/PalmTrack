// palm_sugar_backend/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const neeraRoutes = require('./routes/neeraRoutes');
const processingRoutes = require('./routes/processingRoutes');
const inventoryRoutes = require('./routes/inventoryRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const dbConnect = require("./config/dbConnect")

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: ['http://localhost:5173','https://palm-track.vercel.app/','https://palm-track-a8qn.vercel.app/'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.options('*', cors()); // handle preflight OPTIONS
app.use(express.json());



// Routes
app.get("/", (req, res) => {
  res.send("Hello from Express on Vercel!");
});

app.use('/api/auth', authRoutes);
app.use('/api/neera', neeraRoutes);
app.use('/api/processing', processingRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to DB and start server
dbConnect()
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;