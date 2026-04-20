import { z } from 'zod';

export interface ToolContract<Name extends string, InputShape extends z.ZodRawShape, OutputShape extends z.ZodRawShape> {
  readonly name: Name;
  readonly version: `v${number}`;
  readonly inputSchema: z.ZodObject<InputShape>;
  readonly outputSchema: z.ZodObject<OutputShape>;
  readonly inputShape: InputShape;
  readonly outputShape: OutputShape;
}

export function createToolContract<Name extends string, InputShape extends z.ZodRawShape, OutputShape extends z.ZodRawShape>(
  name: Name,
  version: `v${number}`,
  inputSchema: z.ZodObject<InputShape>,
  outputSchema: z.ZodObject<OutputShape>
): ToolContract<Name, InputShape, OutputShape> {
  return {
    name,
    version,
    inputSchema,
    outputSchema,
    inputShape: inputSchema.shape,
    outputShape: outputSchema.shape
  };
}

export type InferInput<TContract extends ToolContract<string, any, any>> = z.infer<TContract['inputSchema']>;
export type InferOutput<TContract extends ToolContract<string, any, any>> = z.infer<TContract['outputSchema']>;
