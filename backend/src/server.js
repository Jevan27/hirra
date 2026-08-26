import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { corsMiddleware } from './middleware/corsConfig.js';
import { apiRateLimiter, locationRateLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import jobsRouter from './routes/jobs.js';
import companiesRouter from './routes/companies.js';
import categoriesRouter from './routes/categories.js';
import locationRouter from './routes/location.js';
import authRouter from './routes/auth.js';
import { isSupabaseConfigured } from './config/supabase.js';
import { isDatabaseConfigured, prisma } from './config/prisma.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables reliably from backend/.env and workspace root .env
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config(); // fallback to default cwd

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

// CORS Configuration
app.use(corsMiddleware);

// Global Rate Limiting
app.use('/api', apiRateLimiter);

// Body Parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logging
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== 'test') {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    service: 'hirra-api',
    integrations: {
      supabase: isSupabaseConfigured() ? 'configured' : 'pending_configuration',
      database: isDatabaseConfigured() ? 'configured' : 'pending_configuration'
    }
  });
});

// Mount Resource API Routes
app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);
app.use('/api/companies', companiesRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/location', locationRateLimiter, locationRouter);

// Catch-all 404 handler
app.use(notFound);

// Centralized Error Handler
app.use(errorHandler);

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\nGracefully shutting down Hirra API...');
  if (isDatabaseConfigured()) {
    try {
      await prisma.$disconnect();
    } catch (_) {
      // ignore
    }
  }
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start Server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`🚀 Hirra API Server is running securely on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🔐 Auth API:     http://localhost:${PORT}/api/auth`);
    console.log(`💼 Jobs API:     http://localhost:${PORT}/api/jobs`);
    console.log(`📍 Location API: http://localhost:${PORT}/api/location/autocomplete`);
    console.log(`🔑 Supabase:     ${isSupabaseConfigured() ? 'Configured ✅' : 'Awaiting credentials in .env ⚠️'}`);
    console.log(`🗄️  Prisma DB:    ${isDatabaseConfigured() ? 'Configured ✅' : 'Awaiting credentials in .env ⚠️'}`);
  });
}

export default app;
