# @manicjs/unocss

UnoCSS plugin for Manic.

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- Plugin docs: [manicjs.tech/docs/framework/plugins/unocss](https://www.manicjs.tech/docs/framework/plugins/unocss)

## Install

```bash
bun add @manicjs/unocss unocss
```

## Usage

```ts
// manic.config.ts
import { defineConfig } from 'manicjs/config';
import { unocss } from '@manicjs/unocss';

export default defineConfig({
  plugins: [unocss()],
});
```

Manic auto-registers `bun-plugin-unocss` for development and production builds. No manual `bunfig.toml` setup is required.

## Configuration

Create a `uno.config.ts` at your project root — `bun-plugin-unocss` picks it up automatically:

```ts
// uno.config.ts
import { defineConfig, presetUno, presetIcons } from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons(),
  ],
  theme: {
    colors: {
      brand: '#f15156',
    },
  },
});
```

## Swapping CSS frameworks

To switch to Tailwind, replace this plugin with [`@manicjs/tailwind`](../tailwind):

```ts
import { tailwind } from '@manicjs/tailwind';

export default defineConfig({
  plugins: [tailwind()],
});
```

## License

GPL-3.0
