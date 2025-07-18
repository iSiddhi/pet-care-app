const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config(); // Load environment variables

const app = express();
const port = process.env.PORT || 5000;

// ✅ Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' ? 
    ['https://pet-care-app-psi.vercel.app']: 
    ['http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// ✅ Routes
const contactRoutes = require('./routes/contactRoutes');
app.use('/api/contact', contactRoutes);

// ✅ Root route to avoid render error
app.get('/', (req, res) => {
  res.send('🌐 Welcome to the backend server!');
});

// ✅ API test route
app.get('/api', (req, res) => {
  res.send('✅ Backend is working!');
});

// ✅ Serve frontend (React build) in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/build'))); // adjust if frontend is outside backend

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
  });
}

// ✅ Catch-all fallback for unknown routes
app.use((req, res) => {
  res.status(404).send('❌ 404 - Route Not Found');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server is running on port ${port}`);
});
