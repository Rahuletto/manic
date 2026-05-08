# `@manicjs/tui`

Shared terminal UI primitives for Manic CLI tooling.

`@manicjs/tui` centralizes branding, colors, status/event formatting, and interactive prompts used across `manicjs`, `create-manic`, providers, and release scripts.

## Documentation

- Website: [manicjs.tech](https://www.manicjs.tech/)
- CLI overview: [manicjs.tech/docs/cli](https://www.manicjs.tech/docs/cli)
- Build command UI: [manicjs.tech/docs/cli/build](https://www.manicjs.tech/docs/cli/build)
- Dev command UI: [manicjs.tech/docs/cli/dev](https://www.manicjs.tech/docs/cli/dev)

## Install

```bash
bun add @manicjs/tui
```

## Usage

```ts
import { brandTitle, sectionTitle, statusSuccess, PromptSession } from '@manicjs/tui';

console.log(brandTitle('build'));
console.log(sectionTitle('Pipeline', 'build'));
console.log(statusSuccess('Build completed'));

const prompts = new PromptSession();
const mode = await prompts.select('Select mode', ['dev', 'build'], 0);
prompts.close();
```

## Exports

- Branding: `brandTitle`, `divider`, `sectionTitle`
- Status/Event lines: `statusPending`, `statusSuccess`, `statusError`, `eventLine`
- Colors/styles: `red`, `green`, `yellow`, `blue`, `cyan`, `white`, `gray`, `dim`, `bold`
- Prompt API: `PromptSession` (`input`, `confirm`, `select`, `multiSelect`)
- Debug helpers: `isDebugEnabled`, `debugLog`

## License

GPL-3.0
