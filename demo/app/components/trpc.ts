import { hc } from 'hono/client';
import type { AppType } from '@/api/~rpc.generated';

export const rpc = hc<AppType>('/api');

