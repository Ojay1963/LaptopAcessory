const buckets = new Map()

function pruneExpired(now) {
  for (const [key, record] of buckets.entries()) {
    if (record.resetAt <= now) {
      buckets.delete(key)
    }
  }
}

export function rateLimit({ key = 'global', windowMs = 60_000, max = 60, message = 'Too many requests.' }) {
  return (req, res, next) => {
    const now = Date.now()
    pruneExpired(now)
    const identifier = `${key}:${req.ip}`
    const current = buckets.get(identifier)

    if (!current || current.resetAt <= now) {
      buckets.set(identifier, {
        count: 1,
        resetAt: now + windowMs,
      })
      return next()
    }

    if (current.count >= max) {
      const retryAfter = Math.ceil((current.resetAt - now) / 1000)
      res.setHeader('Retry-After', String(retryAfter))
      return res.status(429).json({
        ok: false,
        message,
      })
    }

    current.count += 1
    return next()
  }
}
