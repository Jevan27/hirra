import cors from 'cors';

const parseAllowedOrigins = () => {
  const configured = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
    : [];

  const defaults = [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:3000'
  ];

  return Array.from(new Set([...configured, ...defaults])).filter(Boolean);
};

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);

    const allowedOrigins = parseAllowedOrigins();
    const normalizedOrigin = origin.replace(/\/+$/, '');
    
    if (allowedOrigins.includes(normalizedOrigin) || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    return callback(new Error(`Origin ${origin} not allowed by CORS policy`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
});
