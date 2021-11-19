import type { Namespace } from 'socket.io';
import type { Action, HistoryEvent } from '../types';
import { createClient } from 'redis';
import { nanoid } from 'nanoid/non-secure';

const redisConfig = {
  url: process.env.REDIS_TLS_URL,
};
// historyEvents is essentially the database
// Returns all the events in a given key to be replayed
async function getHistory(namespace: Namespace) {
  const redis = createClient(redisConfig);
  await redis.connect();
  const events = await redis.LRANGE(namespace.name, 0, -1);
  await redis.quit();

  return events.map((event) => JSON.parse(event));
}
// A wrapper for socket.io emit that stores the event in Redis
// as a HistoryEvent. Used to sync client states and replay events
async function createHistory(namespace: Namespace, action: Action, data) {
  const event: HistoryEvent = {
    action,
    data,
    timestamp: Date.now(),
    id: nanoid(),
  };

  const redis = createClient(redisConfig);
  await redis.connect();
  await redis.RPUSH(namespace.name, JSON.stringify(event));
  await redis.EXPIRE(namespace.name, parseInt(process.env.REDIS_EXPIRY, 10) || 0);
  await redis.quit();

  namespace.emit(action, data);
  console.log('HistoryEvent', action, data, namespace.name);
}

export { getHistory, createHistory };
