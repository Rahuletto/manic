import type { ManicPlugin } from 'manicjs/config';
import type { UserConfig } from 'unocss';

/**
 * Creates an UnoCSS plugin for Manic.
 *
 * Uses bun-plugin-unocss for hot reloading support.
 * Config is read from uno.config.ts in the project root.
 *
 * @param config - Optional UnoCSS configuration (detected from uno.config.ts if not provided)
 * @returns ManicPlugin for UnoCSS
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
