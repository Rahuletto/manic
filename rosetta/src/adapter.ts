/**
 * Maps standard file extensions to Bun's supported loaders.
 */
export function getLoaderForExtension(
  ext: string
): 'js' | 'jsx' | 'ts' | 'tsx' | 'css' | 'json' | 'text' | 'file' {
  switch (ext) {
    case 'js':
    case 'mjs':
    case 'cjs':
      return 'js';
    case 'jsx':
      return 'jsx';
    case 'ts':
    case 'mts':
    case 'cts':
      return 'ts';
    case 'tsx':
      return 'tsx';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    default:
      // Since Vite plugins load/transform custom assets into ESM JavaScript modules,
      // the loader must be 'js' so Bun can parse the compiled output.
      return 'js';
  }
}

function extractHead(content: string): string {
  const match = content.match(/<head[\s\S]*?>([\s\S]*?)<\/head>/iu);
  return (match && match[1]) || '';
}

/**
 * Compares a transformed HTML page with the original, extracting newly
 * added script, style, link, or meta tags from the head.
 */
export function parseHtmlInjections(
  html: string,
  originalHtml: string
): string {
  const origHead = extractHead(originalHtml);
  const newHead = extractHead(html);

  const tagRegex = /<(script|link|meta|style)[\s\S]*?>(?:[\s\S]*?<\/\1>)?/giu;
  const origTags = new Set(origHead.match(tagRegex) || []);
  const newTags = newHead.match(tagRegex) || [];

  const addedTags = newTags.filter(tag => !origTags.has(tag));
  return addedTags.join('\n');
}

/**
 * Adapts a standard Connect/Express middleware into Hono middleware format.
 */
export function adaptConnectMiddleware(mw: any) {
  return (reqOrContext: any, next?: any) => {
    const isHonoMiddleware =
      next !== undefined &&
      reqOrContext &&
      typeof reqOrContext === 'object' &&
      'req' in reqOrContext;

    if (isHonoMiddleware) {
      const c = reqOrContext;
      return new Promise<void>((resolve, reject) => {
        let resolved = false;
        const resHeaders: Record<string, string> = {};
        const bodyChunks: any[] = [];
        let statusCode = 200;

        const req: any = {
          url: new URL(c.req.url).pathname + new URL(c.req.url).search,
          method: c.req.method,
          headers: c.req.header(),
          on: () => {},
          once: () => {},
          emit: () => {},
        };

        const res: any = {
          get statusCode() {
            return statusCode;
          },
          set statusCode(code) {
            statusCode = code;
          },
          setHeader(name: string, value: string) {
            resHeaders[name.toLowerCase()] = value;
            return this;
          },
          getHeader(name: string) {
            return resHeaders[name.toLowerCase()];
          },
          writeHead(code: number, headers?: any) {
            statusCode = code;
            if (headers) {
              for (const [k, v] of Object.entries(headers)) {
                this.setHeader(k, v as string);
              }
            }
            return this;
          },
          write(chunk: any) {
            if (chunk) {
              bodyChunks.push(
                typeof chunk === 'string' ? Buffer.from(chunk) : chunk
              );
            }
            return true;
          },
          end(chunk: any) {
            if (resolved) return;
            resolved = true;
            if (chunk) {
              bodyChunks.push(
                typeof chunk === 'string' ? Buffer.from(chunk) : chunk
              );
            }
            const finalBody = Buffer.concat(bodyChunks);
            c.res = new Response(finalBody, {
              status: statusCode,
              headers: resHeaders,
            });
            resolve();
          },
        };

        try {
          mw(req, res, (err?: any) => {
            if (resolved) return;
            resolved = true;
            if (err) {
              reject(err);
            } else {
              next().then(resolve, reject);
            }
          });
        } catch (err) {
          if (!resolved) {
            resolved = true;
            reject(err);
          }
        }
      });
    }

    const rawReq = reqOrContext;
    return new Promise<Response>((resolve, reject) => {
      let resolved = false;
      const resHeaders: Record<string, string> = {};
      const bodyChunks: any[] = [];
      let statusCode = 200;

      const headersObj: Record<string, string> = {};
      rawReq.headers.forEach((v: string, k: string) => {
        headersObj[k.toLowerCase()] = v;
      });

      const req: any = {
        url: new URL(rawReq.url).pathname + new URL(rawReq.url).search,
        method: rawReq.method,
        headers: headersObj,
        on: () => {},
        once: () => {},
        emit: () => {},
      };

      const res: any = {
        get statusCode() {
          return statusCode;
        },
        set statusCode(code) {
          statusCode = code;
        },
        setHeader(name: string, value: string) {
          resHeaders[name.toLowerCase()] = value;
          return this;
        },
        getHeader(name: string) {
          return resHeaders[name.toLowerCase()];
        },
        writeHead(code: number, headers?: any) {
          statusCode = code;
          if (headers) {
            for (const [k, v] of Object.entries(headers)) {
              this.setHeader(k, v as string);
            }
          }
          return this;
        },
        write(chunk: any) {
          if (chunk) {
            bodyChunks.push(
              typeof chunk === 'string' ? Buffer.from(chunk) : chunk
            );
          }
          return true;
        },
        end(chunk: any) {
          if (resolved) return;
          resolved = true;
          if (chunk) {
            bodyChunks.push(
              typeof chunk === 'string' ? Buffer.from(chunk) : chunk
            );
          }
          const finalBody = Buffer.concat(bodyChunks);
          resolve(
            new Response(finalBody, {
              status: statusCode,
              headers: resHeaders,
            })
          );
        },
      };

      try {
        mw(req, res, (err?: any) => {
          if (resolved) return;
          resolved = true;
          if (err) {
            reject(err);
          } else {
            resolve(new Response('Not Found', { status: 404 }));
          }
        });
      } catch (err) {
        if (!resolved) {
          resolved = true;
          reject(err);
        }
      }
    });
  };
}
