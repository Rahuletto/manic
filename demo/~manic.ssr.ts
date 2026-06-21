import { createManicSSRServer } from 'manicjs/server';

const server = await createManicSSRServer({
  html: () => Bun.file('./app/index.html').text(),
});

process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));