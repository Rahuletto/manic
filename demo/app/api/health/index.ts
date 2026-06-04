import { Hono } from 'hono';

const route = new Hono();

route.get('/', c =>
  c.json({
    ok: true,
    service: 'manic-demo',
  })
);

export default route;
