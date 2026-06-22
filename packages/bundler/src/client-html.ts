import { mkdir } from 'fs/promises';

export async function renderClientHtml(
  dist: string,
  jsFile: string,
  cssFile: string | undefined,
  appName: string | undefined
): Promise<string> {
  const htmlPath = 'app/index.html';
  let html = '';
  if (await Bun.file(htmlPath).exists()) {
    html = await Bun.file(htmlPath).text();
    if (cssFile) {
      html = html.includes('href="tailwindcss"')
        ? html.replace('href="tailwindcss"', `href="/${cssFile}"`)
        : html.replace(
            '</head>',
            `  <link rel="stylesheet" href="/${cssFile}">\n</head>`
          );
    }
    html = html.includes('src="./main.tsx"')
      ? html.replace('src="./main.tsx"', `src="/${jsFile}"`)
      : html.includes('src="/main.tsx"')
        ? html.replace('src="/main.tsx"', `src="/${jsFile}"`)
        : html.replace(
            '</body>',
            `  <script type="module" src="/${jsFile}"></script>\n</body>`
          );
  } else {
    html = [
      '<!DOCTYPE html>',
      '<html lang="en">',
      '<head>',
      '  <meta charset="UTF-8">',
      '  <meta name="viewport" content="width=device-width, initial-scale=1.0">',
      `  <title>${appName ?? 'App'}</title>`,
      cssFile ? `  <link rel="stylesheet" href="/${cssFile}">` : '',
      '</head>',
      '<body>',
      '  <div id="root"></div>',
      `  <script type="module" src="/${jsFile}"></script>`,
      '</body>',
      '</html>',
    ].join('\n');
  }
  await Bun.write(`${dist}/client/index.html`, html);
  return html;
}

export async function copyAssetsIfExists(dist: string): Promise<void> {
  if (await Bun.file('assets').exists()) {
    await mkdir(`${dist}/client/assets`, { recursive: true });
    // Use Bun's copy functionality
    const assetGlob = new Bun.Glob('**/*');
    for await (const file of assetGlob.scan({ cwd: 'assets' })) {
      const srcPath = `assets/${file}`;
      const destPath = `${dist}/client/assets/${file}`;
      const srcFile = Bun.file(srcPath);
      if (await srcFile.exists()) {
        await Bun.write(destPath, await srcFile.arrayBuffer());
      }
    }
  }
}
