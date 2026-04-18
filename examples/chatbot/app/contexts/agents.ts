import type { ManicPlugin } from 'manicjs/config';

export function agents(): ManicPlugin {
  return {
    name: 'chatbot-agents',

    configureServer(ctx) {
      // Serve AGENTS.md
      ctx.addRoute('/.well-known/agent-skills/chatbot/AGENTS.md', async () => {
        const content = await Bun.file('AGENTS.md').text();
        return new Response(content, {
          headers: { 'content-type': 'text/markdown; charset=utf-8' },
        });
      });

      // Serve skill files
      ctx.addRoute(
        '/.well-known/agent-skills/manic-framework/SKILL.md',
        async () => {
          const content = await Bun.file(
            '.agents/skills/manic-framework/SKILL.md'
          ).text();
          return new Response(content, {
            headers: { 'content-type': 'text/markdown; charset=utf-8' },
          });
        }
      );

      // Serve references
      ctx.addRoute(
        '/.well-known/agent-skills/manic-framework/references/:file',
        async c => {
          const file = c.req.param('file');
          const filePath = `.agents/skills/manic-framework/references/${file}`;
          if (await Bun.file(filePath).exists()) {
            const content = await Bun.file(filePath).text();
            return new Response(content, {
              headers: { 'content-type': 'text/markdown; charset=utf-8' },
            });
          }
          return new Response('Not found', { status: 404 });
        }
      );

      // Agent skills index
      ctx.addRoute('/.well-known/agent-skills/index.json', () => {
        const index = {
          $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
          skills: [
            {
              name: 'chatbot',
              type: 'skill-md',
              description: 'Chatbot for Manic framework',
              url: '/.well-known/agent-skills/chatbot/AGENTS.md',
            },
            {
              name: 'manic-framework',
              type: 'skill-md',
              description: 'Manic framework knowledge base',
              url: '/.well-known/agent-skills/manic-framework/SKILL.md',
            },
          ],
        };
        return new Response(JSON.stringify(index), {
          headers: { 'content-type': 'application/json' },
        });
      });

      ctx.addLinkHeader(
        '</.well-known/agent-skills/index.json>; rel="agent-skills"; type="application/json"'
      );
    },

    async build(ctx) {
      // Emit AGENTS.md
      const agentsContent = await Bun.file('AGENTS.md').text();
      await ctx.emitClientFile(
        '.well-known/agent-skills/chatbot/AGENTS.md',
        agentsContent
      );

      // Emit skill files
      const skillContent = await Bun.file(
        '.agents/skills/manic-framework/SKILL.md'
      ).text();
      await ctx.emitClientFile(
        '.well-known/agent-skills/manic-framework/SKILL.md',
        skillContent
      );

      // Emit references
      const referencesDir = '.agents/skills/manic-framework/references';
      const glob = new Bun.Glob('*.md');
      const referenceFiles = await Array.fromAsync(
        glob.scan({ cwd: referencesDir })
      );
      await Promise.all(
        referenceFiles.map(async file => {
          const content = await Bun.file(`${referencesDir}/${file}`).text();
          await ctx.emitClientFile(
            `.well-known/agent-skills/manic-framework/references/${file}`,
            content
          );
        })
      );

      // Emit agent skills index
      const index = {
        $schema: 'https://schemas.agentskills.io/discovery/0.2.0/schema.json',
        skills: [
          {
            name: 'chatbot',
            type: 'skill-md',
            description: 'Chatbot for Manic framework',
            url: '/.well-known/agent-skills/chatbot/AGENTS.md',
          },
          {
            name: 'manic-framework',
            type: 'skill-md',
            description: 'Manic framework knowledge base',
            url: '/.well-known/agent-skills/manic-framework/SKILL.md',
          },
        ],
      };
      await ctx.emitClientFile(
        '.well-known/agent-skills/index.json',
        JSON.stringify(index)
      );
    },
  };
}
