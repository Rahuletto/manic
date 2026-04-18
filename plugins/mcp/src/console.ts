import type { McpTool } from './tool';

const MAX_LOGS = 200;
export const consoleLogs: Array<{
  level: string;
  args: unknown[];
  ts: number;
}> = [];

export const CONSOLE_SCRIPT = `(function(){var e='/mcp/console',l=['log','warn','error','info','debug'];l.forEach(function(n){var o=console[n].bind(console);console[n]=function(){o.apply(console,arguments);try{var a=Array.from(arguments).map(function(x){try{return JSON.parse(JSON.stringify(x))}catch{return String(x)}});fetch(e,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({level:n,args:a,ts:Date.now()}),keepalive:true}).catch(function(){})}catch{}}})})();`;

/** Returns the console log capture tool (dev-only). */
export function consoleLogTool(): McpTool {
  return {
    name: 'get_console_logs',
    description:
      'Returns browser console logs captured from the running page (requires /mcp/console.js).',
    inputSchema: {
      type: 'object',
      properties: {
        level: {
          type: 'string',
          description: 'Filter by level: log | warn | error | info | debug',
        },
        limit: {
          type: 'number',
          description: 'Max entries to return (default 50)',
        },
      },
    },
    execute({ level, limit }) {
      const lvl = level ? String(level) : null;
      const lim = typeof limit === 'number' ? limit : 50;
      const filtered = lvl
        ? consoleLogs.filter(e => e.level === lvl)
        : consoleLogs;
      return filtered.slice(-lim);
    },
  };
}

/** Route handler that receives log entries POSTed by the browser script. */
export async function consoleIngestHandler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return new Response(null, { status: 405 });
  try {
    const entry = (await req.json()) as {
      level: string;
      args: unknown[];
      ts: number;
    };
    consoleLogs.push(entry);
    if (consoleLogs.length > MAX_LOGS) consoleLogs.shift();
  } catch {}
  return new Response(null, { status: 202 });
}
