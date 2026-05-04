import type { ManicPlugin } from 'manicjs/config';

/**
 * Creates a Tailwind CSS plugin for Manic.
 *
 * Uses bun-plugin-tailwind for hot reloading support in development.
 * In production, Tailwind classes are bundled with the client.
 *
 * @returns ManicPlugin for Tailwind CSS
 *
 * @example
 * import { tailwind } from '@manicjs/tailwind';
 *
 * tailwind()
 */
export function tailwind(): ManicPlugin {
  return {
    name: '@manicjs/tailwind',
    bunfig: `[serve.static]\nplugins = ["bun-plugin-tailwind"]`,
  };
}
