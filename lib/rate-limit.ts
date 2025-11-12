import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

const hasRedisCredentials = process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN

const redis = hasRedisCredentials
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

export const apiLimiter = hasRedisCredentials
  ? new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(100, "60 s"),
      analytics: true,
    })
  : null

export const formLimiter = hasRedisCredentials
  ? new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(5, "60 s"),
      analytics: true,
    })
  : null

export const contactLimiter = hasRedisCredentials
  ? new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(20, "1 h"),
      analytics: true,
    })
  : null

export const testimonialLimiter = hasRedisCredentials
  ? new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(30, "1 h"),
      analytics: true,
    })
  : null

export async function checkRateLimit(key: string, limiter: Ratelimit | null) {
  if (!limiter) {
    console.warn("[Rate Limit] Upstash credentials not configured. Skipping rate limiting.")
    return { success: true } // Allow request if rate limiting is not configured
  }

  try {
    const result = await limiter.limit(key)
    return result
  } catch (error) {
    console.error("[Rate Limit] Error checking rate limit:", error)
    return { success: true } // Fail open - allow request on error
  }
}
