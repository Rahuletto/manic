import type { ZodObject, ZodRawShape, infer as ZodInfer } from 'zod';

export interface McpTool {
  name: string;
  description: string;
  inputSchema: {
    type: 'object';
    properties?: Record<string, unknown>;
    required?: string[];
  };
  execute(args: Record<string, unknown>): Promise<unknown> | unknown;
}

type ToolDef<S extends ZodObject<ZodRawShape>> = {
  description: string;
  input: S;
  execute(args: ZodInfer<S>): Promise<unknown> | unknown;
};

/**
 * Define a typed MCP tool. The Zod schema is converted to JSON Schema automatically
 * and args are validated + typed at call time.
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
