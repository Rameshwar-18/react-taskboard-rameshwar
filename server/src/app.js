import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes.js';
import taskRoutes from './routes/taskRoutes.js';

const app = express();

// Allowed CORS origins (development, production Vercel frontend, and optional CLIENT_ORIGIN)
const defaultAllowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'https://react-taskboard-rameshwar.vercel.app'
];

const clientOriginEnv = process.env.CLIENT_ORIGIN;
const allowedOrigins = clientOriginEnv
  ? [...defaultAllowedOrigins, ...clientOriginEnv.split(',').map((o) => o.trim())]
  : defaultAllowedOrigins;

// Global middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);

      if (
        allowedOrigins.includes(origin) ||
        /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
      ) {
        return callback(null, true);
      }

      return callback(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true
  })
);
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API is running'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Global production-safe error handler (prevents leaking stack traces or credentials)
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const isCorsError = err.message && err.message.includes('CORS');
  const status = isCorsError ? 403 : err.status || 500;
  res.status(status).json({
    success: false,
    message: isCorsError ? 'CORS error: Origin not allowed' : 'Internal server error'
  });
});

export default app;