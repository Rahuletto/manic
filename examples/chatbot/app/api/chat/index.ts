import { google } from '@ai-sdk/google';
import { streamText, convertToModelMessages } from 'ai';
import { Hono } from 'hono';
import { buildSystemPrompt } from '../../contexts/context-cache';

const THINKING_MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-pro',
  'gemini-3-flash-preview',
  'gemini-3-pro-preview',
];

const route = new Hono();

route.post('/', async c => {
  const { messages, model, context } = await c.req.json();
  const supportsThinking = THINKING_MODELS.some(m => model.includes(m));
  const isGemini3 = model.includes('gemini-3');
  const systemPrompt = buildSystemPrompt(context);

  try {
    const apiKey =
      process.env.MANIC_GOOGLE_API_KEY ||
      process.env.GOOGLE_GENERATIVE_AI_API_KEY ||
      process.env.GOOGLE_API_KEY;

    if (!apiKey) {
      return c.json(
        { error: 'Google API key not configured' },
        { status: 401 }
      );
    }

    const result = streamText({
      model: google(model),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      providerOptions: supportsThinking
        ? {
            google: {
              thinkingConfig: isGemini3
                ? {
                    thinkingLevel: 'high',
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
    console.error('Chat Error:', e);
    throw e;
  }
});

export default route;
