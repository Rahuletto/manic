# @manicjs/tailwind

Tailwind CSS plugin for Manic.

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- Plugin docs: [manicjs.tech/docs/framework/plugins/tailwind](https://www.manicjs.tech/docs/framework/plugins/tailwind)

## Install

```bash
bun add @manicjs/tailwind
```

## Usage

```ts
// manic.config.ts
import { defineConfig } from 'manicjs/config';
import { tailwind } from '@manicjs/tailwind';

export default defineConfig({
  plugins: [tailwind()],
});
```

Add Tailwind to your CSS entry:

```css
/* app/global.css */
@import 'tailwindcss';
```

Manic auto-registers `bun-plugin-tailwind` for development and production builds. No manual `bunfig.toml` setup is required.

## Customization

Configure Tailwind via a `tailwind.config.ts` or CSS `@theme` block:

```css
@import 'tailwindcss';

@theme {
  --color-brand: #f15156;
  --font-sans: 'Inter', sans-serif;
}
```

## Swapping CSS frameworks

To switch to UnoCSS, replace this plugin with [`@manicjs/unocss`](../unocss):

```ts
import { unocss } from '@manicjs/unocss';

export default defineConfig({
  plugins: [unocss()],
});
```

## License

GPL-3.0
