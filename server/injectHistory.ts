require('dotenv').config();
import * as historyState from '../tests/history-states';
import logo from './logo';
import { createClient } from 'redis';

async function injectHistory() {
  let namespace = process.env.NAME;
  const initHistory = historyState[process.env.HISTORY] || [];

  logo(`HISTORY INJECTION      NAME:${namespace}      HISTORY:${process.env.HISTORY}`);
  namespace = `/${namespace}`; // Prepend the trailing slash, required for the URL

  const redis = createClient();
  await redis.connect();

  for (const history of initHistory) {
    console.log('HistoryEvent', history.action, history.data);
    await redis.RPUSH(namespace, JSON.stringify(history));
  }

  await redis.EXPIRE(namespace, parseInt(process.env.REDIS_EXPIRY, 10) || 0);
  await redis.quit();

  console.log('\nHistory injection complete\n');

  process.exit();
}

if (!process.env.NAME || !process.env.HISTORY) {
  console.log(
    '\x1b[33m%s\x1b[0m',
    'FAILED: Must pass NAME and HISTORY env vars to inject history\n',
  );
  process.exit(1);
}

injectHistory();
