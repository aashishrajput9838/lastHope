require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/lasthope';

// Allowed CORS origins
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://127.0.0.1:5174',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in dev, cookie will match credentials
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

// Mount routes at both /auth and /api/auth
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

// Root API welcome endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'lastHope Authentication API',
    status: 'online',
    frontend: 'http://localhost:5173',
    endpoints: {
      health: 'GET /health',
      register: 'POST /auth/register',
      login: 'POST /auth/login',
      logout: 'POST /auth/logout',
      me: 'GET /auth/me',
      forgotPassword: 'POST /auth/forgot-password',
      resetPassword: 'POST /auth/reset-password',
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Fallback 404 for API
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot ${req.method} ${req.url}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Database connection & server start
mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log(`[lastHope] Connected to MongoDB at ${MONGODB_URI}`);
    app.listen(PORT, () => {
      console.log(`[lastHope] Backend server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('[lastHope] Failed to connect to MongoDB:', err.message);
    process.exit(1);
  });
