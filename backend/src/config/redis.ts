import Redis from 'ioredis';
import dotenv from 'dotenv';

dotenv.config();

const redisUrl: string = process.env.REDIS_URL ?? '';
const redis = new Redis(redisUrl);

export default redis;
