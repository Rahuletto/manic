# @manicjs/tailwind

Tailwind CSS v4 plugin for [Manic](https://manic.js.org).

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

That's it. Manic automatically registers `bun-plugin-tailwind` for dev and build — no `bunfig.toml` needed.

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
