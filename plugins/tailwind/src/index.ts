import type { ManicPlugin } from 'manicjs/config';

export function tailwind(): ManicPlugin {
  return {
    name: '@manicjs/tailwind',
    bunfig: `[serve.static]\nplugins = ["bun-plugin-tailwind"]`,
  };
}
