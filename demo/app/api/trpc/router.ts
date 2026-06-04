import { initTRPC } from '@trpc/server';

const t = initTRPC.create();

export const appRouter = t.router({
  health: t.procedure.query(() => ({
    ok: true,
    service: 'manic-trpc',
  })),

  greeting: t.procedure
    .input((value: unknown) => {
      if (
        typeof value === 'object' &&
        value !== null &&
        'name' in value &&
        typeof value.name === 'string'
      ) {
        return { name: value.name };
      }
      return { name: 'Manic' };
    })
    .query(({ input }) => ({
      message: `Hello ${input.name} from tRPC on Hono!`,
    })),

  timestamp: t.procedure.query(() => ({
    timestamp: new Date().toISOString(),
    unix: Date.now(),
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  })),
});

export type AppRouter = typeof appRouter;
