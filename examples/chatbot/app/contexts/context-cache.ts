// Pre-computed context cache to reduce token usage
// These files are static and never change, so we cache them at build time

const AGENTS_FILE = 'AGENTS.md';
const SKILLS_FILE = '.agents/skills/manic-framework/SKILL.md';
const MANIC_FILE = 'app/contexts/manic.md';
const BENCHMARKS_FILE = 'app/contexts/benchmarks.md';

// Read and cache file contents at build time
const agentsCtx = Bun.file(AGENTS_FILE).text();
const skillCtx = Bun.file(SKILLS_FILE).text();
const manicCtx = Bun.file(MANIC_FILE).text();
const benchmarksCtx = Bun.file(BENCHMARKS_FILE).text();

export const CONTEXT_CACHE = {
  agents: await agentsCtx,
  skills: await skillCtx,
  manic: await manicCtx,
  benchmarks: await benchmarksCtx,
};

// Compressed context templates with Mermaid examples
export const CONTEXT_TEMPLATES = {
  base: `You are an intelligent assistant, you can do anything you want. You have full flexibility with markdown aswell, from heading1 to paragraph to code blocks, code, pre, tables, etc..

You are inside a ManicJS Framework project, Users are interested to ask you about this awesome framework.

Also you dont have to dump everything to the user.

## Markdown Formatting Guidelines

- Use tables to organize information clearly
- Use Mermaid diagrams to explain architecture and flows
- Use code blocks for code examples
- Use bold text for emphasis
- Use lists for step-by-step instructions

## Mermaid Diagram Examples

### Build Pipeline Flow
\`\`\`mermaid
graph TD
  Start[manic build] --> Lint[oxlint scan]
  Lint --> Manifest[Discovery: Scan app/routes]
  Manifest --> WriteManifest[Write app/contexts/routes.generated.ts]
  WriteManifest --> Client[Bun.build Client: browser target]
  Client --> API[Bun.build API: Scan app/api, bundle per route]
  API --> Server[Bun.build Server: Transform ~manic.ts + Inject HTML]
  Server --> Minify[oxc-minify: Parallel Client/API/Server]
  Minify --> Provider[Provider.build: Package for Vercel/CF]
\`\`\`

### Client Navigation Flow
\`\`\`mermaid
graph LR
  Click[Link click] --> Prev[Prevent Default]
  Prev --> Match[Matcher: Regex scan registry]
  Match --> Load[Lazy Load: import chunk]
  Load --> VT[View Transition: document.startViewTransition]
  VT --> Render[React Render: Update RouterContext]
  Render --> Scroll[Scroll: top for new, pop for back]
\`\`\`

### Server Architecture
\`\`\`mermaid
graph LR
  Bun.serve[Bun.serve]
  Static[Static assets /assets/*]
  API[API routes via Hono /api/*]
  OpenAPI[OpenAPI + API catalog]
  Plugin[Plugin routes]
  SPA[SPA catch-all /*]
  
  Bun.serve --> Static
  Bun.serve --> API
  Bun.serve --> OpenAPI
  Bun.serve --> Plugin
  Bun.serve --> SPA
\`\`\`

### Plugin System
\`\`\`mermaid
graph TD
  Plugin[ManicPlugin]
  Build[build(ctx)]
  Configure[configureServer(ctx)]
  
  Build --> PageRoutes[pageRoutes]
  Build --> ApiRoutes[apiRoutes]
  Build --> Dist[dist]
  Build --> Emit[emitClientFile]
  
  Configure --> AddRoute[addRoute]
  Configure --> AddLink[addLinkHeader]
\`\`\`

### File Conventions
\`\`\`mermaid
graph LR
  ~manic.ts[~manic.ts] --> Server[Server entry]
  manic.config.ts[manic.config.ts] --> Config[Configuration]
  app/routes[app/routes/*.tsx] --> Pages[Page routes]
  app/api[app/api/*/index.ts] --> API[API routes]
  assets[assets/] --> Static[Static assets]
\`\`\`

## Important Notes

- Use Mermaid diagrams to explain complex concepts
- Tables should have proper borders and alternating row colors
- Code blocks should be clearly formatted with syntax highlighting
- Keep explanations concise and focused`,

  manic: `\n\n## ManicJS Documentation\n${await manicCtx}`,

  benchmarks: `\n\n## Benchmark Context\n${await benchmarksCtx}`,

  agents: `\n\n## Manic Framework Agents\n${await agentsCtx}`,

  skills: `\n\n## Manic Framework Skill\n${await skillCtx}`,
};

// Build system prompt from context settings
export function buildSystemPrompt(context: {
  manicDocs: boolean;
  benchmarks: boolean;
  agents: boolean;
  skills: boolean;
}): string {
  let prompt = CONTEXT_TEMPLATES.base;

  if (context.manicDocs) {
    prompt += CONTEXT_TEMPLATES.manic;
  }

  if (context.benchmarks) {
    prompt += CONTEXT_TEMPLATES.benchmarks;
  }

  if (context.agents) {
    prompt += CONTEXT_TEMPLATES.agents;
  }

  if (context.skills) {
    prompt += CONTEXT_TEMPLATES.skills;
  }

  return prompt;
}
