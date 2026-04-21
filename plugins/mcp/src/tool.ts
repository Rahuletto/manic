import type { ZodObject, ZodRawShape, infer as ZodInfer } from 'zod';

/**
 * MCP tool definition
 * @interface McpTool
 */
export interface McpTool {
  /** Tool name (unique identifier) */
  name: string;
  /** Human-readable tool description */
  description: string;
  /** JSON Schema for tool input */
  inputSchema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
  /** Execute function with parsed arguments */
  execute(args: Record<string, unknown>): Promise<unknown> | unknown;
}

type ToolDef<S extends ZodObject<ZodRawShape>> = {
  description: string;
  input: S;
  execute(args: ZodInfer<S>): Promise<unknown> | unknown;
};

/**
 * Defines a typed MCP tool with Zod schema validation.
 *
 * The Zod schema is automatically converted to JSON Schema for MCP.
 * Args are validated and typed at call time.
 *
 * @template S - Zod schema type
 * @param name - Unique tool name
 * @param def - Tool definition with description, input schema, and handler
 * @returns McpTool for use with mcp()
 *
 * @example
 * import { defineTool } from '@manicjs/mcp';
 * import { z } from 'zod';
 *
 * defineTool('getUser', {
 *   description: 'Get a user by ID',
 *   input: z.object({ id: z.string() }),
 *   handler: async ({ id }) => ({ id, name: 'John' }),
 * })
 */
export function defineTool<S extends ZodObject<ZodRawShape>>(
  name: string,
  def: ToolDef<S>
): McpTool {
  const shape = def.input.shape;
  const properties: Record<string, unknown> = {};
  const required: string[] = [];

  for (const [key, field] of Object.entries(shape)) {
    const f = field as any;
    const isOptional =
      f._def?.typeName === 'ZodOptional' || f.isOptional?.() === true;
    const inner = isOptional ? (f._def?.innerType ?? f) : f;
    const typeName: string = inner._def?.typeName ?? '';

    const prop: Record<string, unknown> = {
      type:
        typeName === 'ZodNumber'
          ? 'number'
          : typeName === 'ZodBoolean'
            ? 'boolean'
            : typeName === 'ZodArray'
              ? 'array'
              : 'string',
    };
    const desc = f._def?.description ?? inner._def?.description;
    if (desc) prop.description = desc;

    properties[key] = prop;
    if (!isOptional) required.push(key);
  }

  return {
    name,
    description: def.description,
    inputSchema: {
      type: 'object',
      properties,
      ...(required.length ? { required } : {}),
    },
    execute(args) {
      return def.execute(def.input.parse(args));
    },
  };
}
