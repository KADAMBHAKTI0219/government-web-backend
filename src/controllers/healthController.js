import mongoose from 'mongoose';
import { ApiResponse } from '../utils/apiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

/**
 * @desc Get system health status including DB connectivity, uptime, and memory usage
 * @route GET /api/v1/health
 * @access Public
 */
export const getHealth = asyncHandler(async (req, res) => {
  const startTime = Date.now();
  let dbStatus = 'disconnected';
  let dbPingMs = null;

  try {
    if (mongoose.connection.readyState === 1 && mongoose.connection.db) {
      const pingStart = Date.now();
      await mongoose.connection.db.admin().ping();
      dbPingMs = Date.now() - pingStart;
      dbStatus = 'connected';
    } else {
      dbStatus = 'connecting_or_disconnected';
    }
  } catch (err) {
    dbStatus = `error: ${err.message}`;
  }

  const memoryUsage = process.memoryUsage();
  const formatMb = (bytes) => `${(bytes / 1024 / 1024).toFixed(2)} MB`;

  const healthData = {
    status: dbStatus === 'connected' ? 'healthy' : 'degraded',
    service: 'Chhattisgarh State Creator & Influencer Awards API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    responseLatencyMs: Date.now() - startTime,
    uptimeSeconds: Math.floor(process.uptime()),
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: dbStatus,
      pingMs: dbPingMs,
      host: mongoose.connection?.host || 'unknown',
      name: mongoose.connection?.name || 'unknown'
    },
    system: {
      nodeVersion: process.version,
      memory: {
        rss: formatMb(memoryUsage.rss),
        heapTotal: formatMb(memoryUsage.heapTotal),
        heapUsed: formatMb(memoryUsage.heapUsed),
        external: formatMb(memoryUsage.external)
      }
    }
  };

  const statusCode = dbStatus === 'connected' ? 200 : 503;
  return ApiResponse.success(res, 'Health status fetched successfully', healthData, statusCode);
});

/**
 * @desc Lightweight ping-pong endpoint for uptime monitoring & load balancers
 * @route GET /api/v1/health/ping
 * @access Public
 */
export const ping = (req, res) => {
  return res.status(200).json({
    status: 'pong',
    timestamp: new Date().toISOString()
  });
};

/**
 * @desc Dedicated Database health check
 * @route GET /api/v1/health/db
 * @access Public
 */
export const getDbHealth = asyncHandler(async (req, res) => {
  const pingStart = Date.now();
  if (mongoose.connection.readyState !== 1 || !mongoose.connection.db) {
    return res.status(503).json({
      success: false,
      status: 'disconnected',
      message: 'Database connection is not active'
    });
  }

  await mongoose.connection.db.admin().ping();
  const latency = Date.now() - pingStart;

  return res.status(200).json({
    success: true,
    status: 'connected',
    latencyMs: latency,
    database: mongoose.connection.name,
    timestamp: new Date().toISOString()
  });
});
