import express from 'express';
import RedisClient from '../clients/redis-client';

export const rateLimiterMiddleware = async (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction,
) => {
  const redisClient = new RedisClient();

  try {
    await redisClient.updateSlidingWindowRequests(req.ip);
  } catch (error) {
    next(error);
  }

  next();
};
