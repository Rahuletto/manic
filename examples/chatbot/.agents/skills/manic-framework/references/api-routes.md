# API Routes

API routes in Manic are built with Hono.

## Basic API

```tsx
// app/api/hello/index.ts
import { Hono } from 'hono';

const route = new Hono();

route.get('/', c => {
  return c.json({ message: 'Hello World' });
});

export default route;
```

## Dynamic API

```tsx
// app/api/users/[id]/index.ts
import { Hono } from 'hono';

const route = new Hono();

route.get('/', c => {
  const id = c.req.param('id');
  return c.json({ id });
});

export default route;
```

## OpenAPI Support

```tsx
import { Hono } from 'hono';
import { z } from 'zod';
import { swaggerUI } from '@hono/swagger-ui';

const route = new Hono();

route.get(
  '/users',
  c => {
    return c.json({ users: [] });
  },
  {
    operationId: 'listUsers',
    summary: 'List users',
    responses: {
      200: {
        description: 'List of users',
        content: {
          'application/json': {
            schema: z.object({
              users: z.array(z.string()),
            }),
          },
        },
      },
    },
  }
);

export default route;
```
