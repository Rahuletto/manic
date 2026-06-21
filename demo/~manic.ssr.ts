import { createManicSSRServer } from 'manicjs/server';

const server = await createManicSSRServer({
  html: () => Bun.file('./app/index.html').text(),
});

console.log(`SSR Server running on http://localhost:${server.port}`);

// Keep process alive
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));