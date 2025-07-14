const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json()); // Add JSON body parser

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Import routes
const contactRoutes = require('./routes/contactRoutes');

// Routes
app.get('/', (req, res) => {
  res.send('Hello from the backend!');
});

// Use routes
app.use('/api/contact', contactRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
