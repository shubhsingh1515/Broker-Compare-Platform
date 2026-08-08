const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const setupSwagger = require('./config/swagger');

const app = express();

// Security Middlewares
app.use(helmet({ crossOriginResourcePolicy: false }));

// CORS setup
const allowedOrigins = [
  process.env.CLIENT_USER_URL || 'http://localhost:3000',
  process.env.CLIENT_ADMIN_URL || 'http://localhost:3001',
  'http://localhost:5173',
  'http://localhost:5174'
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(null, true); // Allow for local development
      }
    },
    credentials: true
  })
);

// Logging & Body Parsers
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 300,
  message: { success: false, message: 'Too many requests from this IP, please try again after 15 minutes.' }
});

app.use('/api', apiLimiter);

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Mount API Routes
app.use('/api', routes);

// Setup Swagger Docs
setupSwagger(app);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Broker Compare Platform API',
    swaggerDocs: '/api-docs',
    version: '1.0.0'
  });
});

// Central Error Handler
app.use(errorHandler);

module.exports = app;
