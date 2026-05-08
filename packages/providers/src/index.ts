/** Vercel provider factory. @see https://www.manicjs.tech/docs/framework/deployment/vercel#setup */
export { vercel } from './vercel';
/** Cloudflare provider factory. @see https://www.manicjs.tech/docs/framework/deployment/cloudflare#setup */
export { cloudflare } from './cloudflare';
/** Netlify provider factory. @see https://www.manicjs.tech/docs/framework/deployment#official-providers */
export { netlify } from './netlify';
/** Provider contracts used by deployment adapters. @see https://www.manicjs.tech/docs/core/providers-contract#interface */
export type { ManicProvider, BuildContext } from './types';
