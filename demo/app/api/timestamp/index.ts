import { Hono } from 'hono';

const app = new Hono().get('/', c =>
  c.json({
    timestamp: new Date().toISOString(),
    unix: Date.now(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })
);

export default app;
