import redisClient from "../config/redis.js";

const rateLimiter = (limit, windowSeconds) => {
  return async (req, res, next) => {
    const ip = req.ip || req.headers['x-forwarded-for']; // Better for production/proxies
    const key = `rate:${ip}`;

    try {
      // INCR returns the new value after incrementing
      const current = await redisClient.incr(key);

      // If it's the first request in this window, set the expiration
      if (current === 1) {
        await redisClient.expire(key, windowSeconds);
      }

      if (current > limit) {
        return res.status(429).json({
          message: `Too many requests. Please try again in ${windowSeconds} seconds.`,
        });
      }

      next();
    } catch (err) {
      console.error("Rate Limiter Error:", err);
      next(); // Don't block the user if Redis fails
    }
  };
};

export default rateLimiter;