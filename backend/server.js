const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');

dotenv.config();

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 5000;

connectDB();

// ---- Middleware ----
const allowedOrigins = (process.env.CLIENT_URLS || 'http://localhost:5173')
  .split(',')
  .map((o) => o.trim());

app.use(
  cors({
    origin(origin, cb) {
      // Allow server-to-server / curl calls which send no Origin header
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
if (process.env.NODE_ENV !== 'production') app.use(morgan('dev'));

// ---- Health ----
app.get('/', (req, res) => res.send('Pet Care API is running'));
app.get('/api/health', (req, res) =>
  res.json({ success: true, status: 'ok', uptime: process.uptime(), env: process.env.NODE_ENV || 'development' })
);

// ---- Routes ----
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pets', require('./routes/petRoutes'));
app.use('/api/breeds', require('./routes/breedRoutes'));
app.use('/api/essentials', require('./routes/productRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/groomers', require('./routes/groomerRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));
app.use('/api/contact', require('./routes/contactRoutes'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/gallery', require('./routes/galleryRoutes'));
// predict-disease, chatbot and ai/status sit directly under /api
app.use('/api', require('./routes/aiRoutes'));

// ---- Errors (must stay last) ----
app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} on http://localhost:${PORT}`)
);

process.on('unhandledRejection', (err) => {
  console.error('Unhandled rejection:', err.message);
  server.close(() => process.exit(1));
});

module.exports = app;
