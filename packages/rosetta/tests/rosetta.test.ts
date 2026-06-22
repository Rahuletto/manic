import { expect, test, describe } from 'bun:test';
import { rosetta } from '../src/index';
import {
  parseHtmlInjections,
  getLoaderForExtension,
  adaptConnectMiddleware,
} from '../src/adapter';
import { Hono } from 'hono';

// Define a mock Connect-style middleware globally to avoid recreate warning
const mockConnectMiddleware = (req: any, res: any, next: any) => {
  if (req.url === '/api/test-route') {
    res.setHeader('content-type', 'application/json');
    res.statusCode = 201;
    res.write(JSON.stringify({ success: true }));
    res.end();
  } else {
    next();
  }
};

describe('Rosetta Translation Engine', () => {
  test('should wrap a Vite plugin and expose ManicPlugin structure', () => {
    const mockVitePlugin = {
      name: 'test-vite-plugin',
      resolveId(id: string) {
        return id === 'virtual:my-module' ? '\0virtual:my-module' : null;
      },
      load(id: string) {
        if (id === '\0virtual:my-module') return 'export const val = 42;';
        return null;
      },
    };

    const manicPlugin = rosetta(mockVitePlugin);
    expect(manicPlugin.name).toBe('rosetta:test-vite-plugin');
    expect(manicPlugin.preload).toBe('@manicjs/rosetta/preload');
    expect(manicPlugin.rosettaBunPlugin).toBeDefined();
    expect(manicPlugin.rosettaBunPlugin.name).toBe(
      'rosetta-bun:test-vite-plugin'
    );
  });

  test('should map loaders correctly based on file extensions', () => {
    expect(getLoaderForExtension('js')).toBe('js');
    expect(getLoaderForExtension('ts')).toBe('ts');
    expect(getLoaderForExtension('tsx')).toBe('tsx');
    expect(getLoaderForExtension('css')).toBe('css');
    expect(getLoaderForExtension('json')).toBe('json');
    // default extension fallback
    expect(getLoaderForExtension('png')).toBe('js');
  });

  test('should parse new HTML injections added to the head', () => {
    const originalHtml = `
      <html>
        <head>
          <title>Test Page</title>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `;

    const transformedHtml = `
      <html>
        <head>
          <title>Test Page</title>
          <meta name="viewport" content="width=device-width">
          <script src="/vite-client.js"></script>
        </head>
        <body>
          <div id="root"></div>
        </body>
      </html>
    `;

    const injections = parseHtmlInjections(transformedHtml, originalHtml);
    expect(injections).toContain(
      '<meta name="viewport" content="width=device-width">'
    );
    expect(injections).toContain('<script src="/vite-client.js"></script>');
  });

  test('should successfully adapt a Connect middleware to Hono', async () => {
    // 2. Wrap it
    const honoMiddleware = adaptConnectMiddleware(mockConnectMiddleware);

    // 3. Run Hono mock app
    const app = new Hono();
    app.all('/*', honoMiddleware as any);
    app.get('/api/fallback', c => c.text('fallback'));

    // 4. Test intercepted route
    const resIntercept = await app.request('http://localhost/api/test-route');
    expect(resIntercept.status).toBe(201);
    expect(resIntercept.headers.get('content-type')).toBe('application/json');
    const bodyIntercept = await resIntercept.json();
    expect(bodyIntercept.success).toBe(true);

    // 5. Test skipped route
    const resFallback = await app.request('http://localhost/api/fallback');
    expect(resFallback.status).toBe(200);
    const bodyFallback = await resFallback.text();
    expect(bodyFallback).toBe('fallback');
  });
});
