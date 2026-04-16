import { Hono } from 'hono';

const route = new Hono();

route.get('/', (c) => c.json({
  message: 'Hello from Manic API!',
}));

export default route;
