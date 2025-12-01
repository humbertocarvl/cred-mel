import redis from '../config/redis';

export async function enqueueCriticalOperation(queue: string, data: any) {
  await redis.lpush(queue, JSON.stringify(data));
}

export async function dequeueCriticalOperation(queue: string) {
  const item = await redis.rpop(queue);
  return item ? JSON.parse(item) : null;
}
