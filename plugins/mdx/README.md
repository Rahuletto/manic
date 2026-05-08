# `@manicjs/mdx`

MDX plugin for Manic.

Use MDX pages and content modules with first-class support in Manic apps.

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- Plugin docs: [manicjs.tech/docs/framework/plugins/mdx](https://www.manicjs.tech/docs/framework/plugins/mdx)

## Install

```bash
bun add @manicjs/mdx
```

## Usage

```ts
import { defineConfig } from 'manicjs/config';
import { mdx } from '@manicjs/mdx';

export default defineConfig({
  plugins: [mdx()],
});
```

## License

GPL-3.0
