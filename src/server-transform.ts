export interface ServerTransformOptions {
  htmlPath: string;
  configPath?: string;
  routes?: any[];
}

export function transformServerEntry(
  code: string,
  options: ServerTransformOptions
): string {
  const { htmlPath, configPath, routes } = options;

  let transformed = code;

  // Replace import of index.html or raw Bun.file read of it
  if (/import\s+(\w+)\s+from\s+["']\.\/app\/index\.html["'];?/u.test(code)) {
    transformed = code.replace(
      /import\s+(\w+)\s+from\s+["']\.\/app\/index\.html["'];?/u,
      `const $1 = await Bun.file("${htmlPath}").text();`
    );
  } else if (
    /Bun\.file\(\s*['"]\.\/app\/index\.html['"]\s*\)\.text\s*\(\s*\)/u.test(
      code
    )
  ) {
    const htmlFileCallPattern =
      /Bun\.file\(\s*['"]\.\/app\/index\.html['"]\s*\)\.text\s*\(\s*\)/g;
    transformed =
      `const html = await Bun.file("${htmlPath}").text();\n` +
      code
        .replace(
          /html\s*:\s*\(\s*\)\s*=>\s*Bun\.file\(\s*['"]\.\/app\/index\.html['"]\s*\)\.text\s*\(\s*\)/g,
          'html'
        )
        .replace(htmlFileCallPattern, 'html');
  }

  const importConfig = configPath
    ? `import config from "${configPath}";\n`
    : '';
  const routesDecl = routes
    ? `const routes = ${JSON.stringify(routes)};\n`
    : '';

  // Inject config and routes into createManicServer / createManicSSRServer call
  if (configPath || routes) {
    const injections =
      [configPath ? 'config' : null, routes ? 'routes' : null]
        .filter(Boolean)
        .join(', ') + ', ';

    transformed = transformed
      .replace(
        /createManicServer\s*\(\s*\{/gu,
        `createManicServer({ ${injections}`
      )
      .replace(
        /createManicSSRServer\s*\(\s*\{/gu,
        `createManicSSRServer({ ${injections}`
      );
  }

  return importConfig + routesDecl + transformed;
}
