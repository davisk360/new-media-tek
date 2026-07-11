/**
 * Simple in-memory rate limiter for serverless functions
 * In production, consider using Redis for distributed rate limiting
 */

const requestCounts = new Map();
const WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS = 30; // 30 requests per minute per IP (allows ~2 messages per second)

// Whitelist IPs that bypass rate limiting (for testing)
// Add your IP addresses here, comma-separated in env var: RATE_LIMIT_WHITELIST="1.2.3.4,5.6.7.8"
const WHITELIST = process.env.RATE_LIMIT_WHITELIST 
  ? process.env.RATE_LIMIT_WHITELIST.split(',').map(ip => ip.trim())
  : [];

// Clean up old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of requestCounts.entries()) {
    if (now - data.windowStart > WINDOW_MS * 2) {
      requestCounts.delete(key);
    }
  }
}, 300000);

/**
 * Check if request should be rate limited
 * @param {string} identifier - Usually IP address or user identifier
 * @returns {Object} { allowed: boolean, remaining: number, resetAt: number }
 */
function checkRateLimit(identifier) {
  const now = Date.now();
  const key = identifier || 'anonymous';
  
  // Check if IP is whitelisted
  if (WHITELIST.includes(key)) {
    return { allowed: true, remaining: MAX_REQUESTS, resetAt: now + WINDOW_MS };
  }
  
  let record = requestCounts.get(key);
  
  // Initialize or reset window
  if (!record || now - record.windowStart > WINDOW_MS) {
    record = {
      count: 0,
      windowStart: now
    };
    requestCounts.set(key, record);
  }
  
  record.count++;
  
  const allowed = record.count <= MAX_REQUESTS;
  const remaining = Math.max(0, MAX_REQUESTS - record.count);
  const resetAt = record.windowStart + WINDOW_MS;
  
  return { allowed, remaining, resetAt };
}

module.exports = { checkRateLimit };
