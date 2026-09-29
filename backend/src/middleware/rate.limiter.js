import { RateLimiterMemory } from "rate-limiter-flexible";

export const createRateLimiter = (points, duration, errorMessage) => {
  const rateLimiter = new RateLimiterMemory({
    points: points,
    duration: duration,
  });
  return async (req, res, next) => {
    try {
      const userId = req.user.id.toString();
      await rateLimiter.consume(userId, 1);
      next();
    } catch (error) {
      res
        .status(429)
        .json({ success: false, message: errorMessage || "Too Many Requests" });
    }
  };
};
