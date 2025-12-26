import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages } from "ai";
import { Elysia, t } from "elysia";

const manicCtx = await Bun.file("app/system/manic.md").text();
const benchmarksCtx = await Bun.file("app/system/benchmarks.md").text();

const BASE_PROMPT = `You are an intelligent assistant, you can do anything you want. You have full flexibility with markdown aswell, from heading1 to paragraph to code blocks, code, pre, tables, etc..

You are inside a ManicJS Framework project, Users are interested to ask you about this awesome framework.

Also you dont have to dump everything to the user.`;

const THINKING_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.5-pro",
  "gemini-3-flash-preview",
  "gemini-3-pro-preview",
];

type ContextSettings = {
  manicDocs: boolean;
  benchmarks: boolean;
};

function buildSystemPrompt(context: ContextSettings): string {
  let prompt = BASE_PROMPT;

  if (context.manicDocs) {
    prompt += `\n\n## ManicJS Documentation\n${manicCtx}`;
  }

  if (context.benchmarks) {
    prompt += `\n\n## Benchmark Context\n${benchmarksCtx}`;
  }

  return prompt;
}

export default new Elysia().post(
  "/",
  async ({ body }) => {
    const { messages, model, context } = body;

    const supportsThinking = THINKING_MODELS.some((m) => model.includes(m));
    const isGemini3 = model.includes("gemini-3");
    const systemPrompt = buildSystemPrompt(context);

    try {
      const result = streamText({
        model: google(model),
        system: systemPrompt,
        messages: await convertToModelMessages(messages),
        providerOptions: supportsThinking
          ? {
              google: {
                thinkingConfig: isGemini3
                  ? {
                      thinkingLevel: "high",
                      includeThoughts: true,
                    }
                  : {
                      thinkingBudget: 1024,
                      includeThoughts: true,
                    },
              },
            }
          : undefined,
      });

      return result.toUIMessageStreamResponse();
    } catch (e) {
      console.error("Chat Error:", e);
      throw e;
    }
  },
  {
    body: t.Object({
      messages: t.Array(t.Any()),
      model: t.String(),
      context: t.Object({
        manicDocs: t.Boolean(),
        benchmarks: t.Boolean(),
      }),
    }),
  }
);
