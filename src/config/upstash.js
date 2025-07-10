import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import dotenv from 'dotenv';

dotenv.config();

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

const ratelimiter = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(4, '60 s'),
});

export default ratelimiter;