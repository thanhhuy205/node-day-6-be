const createRateLimiter = ({ windowMs, maxRequests, message }) => {
  const store = new Map();
  return (req, res, next) => {
    const ipRequest = req.ip ?? "notfound";
    const now = Date.now();

    const storeIp = store.get(ipRequest);

    if (!storeIp || now - storeIp.startWindowMs >= windowMs) {
      store.set(ipRequest, {
        countRequest: 1,
        startWindowMs: now,
      });
      return next();
    }

    storeIp.countRequest += 1;
    if (storeIp.countRequest > maxRequests) {
      return res.status(429).json({
        error: message,
      });
    }

    return next();
  };
};

const apiRateLimiter = createRateLimiter({
  windowMs: 60 * 1000,
  max: 100,
  message: "Too many requests",
});

module.exports = apiRateLimiter;
