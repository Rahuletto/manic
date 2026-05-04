# API Routes

<Callout type="note">
API routes in Manic are built with Hono and automatically mounted under `/api/`.
</Callout>

## Basic API

```tsx
// app/api/hello/index.ts → /api/hello
import { Hono } from 'hono';

const route = new Hono();

route.get('/', c => {
  return c.json({ message: 'Hello World' });
});

export default route;
```

<Callout type="important">
API routes must be in `app/api/*/index.ts` format.
</Callout>

## Dynamic API

```tsx
// app/api/users/[id]/index.ts → /api/users/:id
import { Hono } from 'hono';

const route = new Hono();

route.get('/', c => {
  const id = c.req.param('id');
  return c.json({ id });
});

export default route;
```

<Callout type="tip">
Dynamic parameters work the same as in page routes.
</Callout>

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

<Callout type="tip">
OpenAPI spec is auto-generated at `/openapi.json`.
</Callout>
