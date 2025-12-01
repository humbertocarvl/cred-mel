import { dequeueCriticalOperation } from '../services/queueService';

export async function processQueue(queue: string, handler: (data: any) => Promise<void>) {
  let item;
  while ((item = await dequeueCriticalOperation(queue))) {
    await handler(item);
  }
}
