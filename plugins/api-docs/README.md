# @manicjs/api-docs

API documentation plugin for Manic. Mounts a [Scalar](https://scalar.com) API reference UI at `/docs`.

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- Plugin docs: [manicjs.tech/docs/framework/plugins/api-docs](https://www.manicjs.tech/docs/framework/plugins/api-docs)

## Install

```bash
bun add @manicjs/api-docs
```

## Usage

```ts
// manic.config.ts
import { defineConfig } from 'manicjs';
import { apiDocs } from '@manicjs/api-docs';

export default defineConfig({
  plugins: [apiDocs()],
});
```

The docs UI is available at `/docs`. The OpenAPI spec is served at `/openapi.json` (generated automatically from your `app/api/` routes by the Manic build pipeline).

## Options

| Option    | Type     | Default           | Description                |
| --------- | -------- | ----------------- | -------------------------- |
| `path`    | `string` | `"/docs"`         | Mount path for the docs UI |
| `specUrl` | `string` | `"/openapi.json"` | URL of the OpenAPI spec    |
| `theme`   | `string` | `"default"`       | Scalar theme name          |

## License

GPL-3.0
