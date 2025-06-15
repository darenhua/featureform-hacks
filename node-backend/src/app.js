// app.js
const express = require('express');
const cors = require('cors');
const config = require('./utils/config');
const onboardingRoutes = require('./controllers/onboardingController');

require('dotenv').config();

const app = express();

// Basic test route
app.get('/', (req, res) => {
  res.json({ message: 'Backend is running successfully!', timestamp: new Date().toISOString() });
});

app.use(cors());
app.use(express.static('dist'))
app.use(express.json());

app.use('/api/onboarding', onboardingRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', uptime: process.uptime() });
});

module.exports = app;