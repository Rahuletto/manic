/**
 * A mock Vite plugin to test Rosetta's translation capabilities.
 */
export function viteTestPlugin() {
  return {
    name: 'vite-test-plugin',

    transformIndexHtml(html: string) {
      // Test HTML injection
      return html.replace(
        '</head>',
        '  <meta name="vite-plugin-test" content="injected-value">\n</head>'
      );
    },

    configureServer(server: any) {
      // Test Connect middleware adapter on Hono dev server
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/api/vite-connect-test') {
          res.setHeader('content-type', 'application/json');
          res.statusCode = 200;
          res.write(JSON.stringify({ success: true, engine: 'connect-via-hono' }));
          res.end();
        } else {
          next();
        }
      });
    },

    transform(code: string, id: string) {
      // Test bundler asset load/transform hook for text files
      if (id.endsWith('.txt')) {
        return {
          code: `export default ${JSON.stringify(code.toUpperCase().trim())};`,
          map: null,
        };
      }
      return null;
    },
  };
}
