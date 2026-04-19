import type { ManicPlugin } from 'manicjs/config';
import type { UserConfig } from 'unocss';

export function unocss(config?: UserConfig): ManicPlugin {
  // bun-plugin-unocss auto-detects uno.config.ts in the project root.
  // Pass config via uno.config.ts for full customization.
  return {
    name: '@manicjs/unocss',
    bunfig: `[serve.static]\nplugins = ["bun-plugin-unocss"]`,
  };
}
