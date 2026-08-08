import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

import morganMiddleware from './middleware/logger.js';
import { globalLimiter } from './middleware/rateLimiter.js';
import { notFoundHandler, globalErrorHandler } from './middleware/errorHandler.js';
import apiRouter from './routes/index.js';
import { serveSwagger, setupSwagger } from './docs/swagger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet({ contentSecurityPolicy: false }));
app.use(
  cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
  })
);

// Performance & Parsing Middlewares
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser(process.env.COOKIE_SECRET || 'cg_awards_cookie_secret'));

// Logging & Rate Limiting
app.use(morganMiddleware);
app.use('/api', globalLimiter);

// Static Uploads Directory
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Swagger API Documentation
app.use('/api/docs', serveSwagger, setupSwagger);

// Root & Health Check Endpoint
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Chhattisgarh State Creator & Influencer Awards Portal API',
    version: '1.0.0',
    documentation: '/api/docs',
    timestamp: new Date().toISOString()
  });
});

// Master API Routes
app.use('/api/v1', apiRouter);
app.use('/api', apiRouter);

// Error Handling Middlewares
app.use(notFoundHandler);
app.use(globalErrorHandler);

export default app;
