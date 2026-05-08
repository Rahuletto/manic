import type { ManicPlugin } from 'manicjs/config';
import type { UserConfig } from 'unocss';

/**
 * Creates an UnoCSS plugin for Manic.
 *
 * Uses bun-plugin-unocss for hot reloading support.
 * Config is read from uno.config.ts in the project root.
 *
 * @param config - Config is ignored — use uno.config.ts instead
 * @returns ManicPlugin for UnoCSS
 * @see https://www.manicjs.tech/docs/framework/plugins/unocss#quick-start
 *
 * @example
 * import { unocss } from '@manicjs/unocss';
 *
 * unocss()
 */
export function unocss(config?: UserConfig): ManicPlugin {
  // bun-plugin-unocss auto-detects uno.config.ts in the project root.
  // Pass config via uno.config.ts for full customization.
  return {
    name: '@manicjs/unocss',
    bunfig: `[serve.static]\nplugins = ["bun-plugin-unocss"]`,
  };
}
