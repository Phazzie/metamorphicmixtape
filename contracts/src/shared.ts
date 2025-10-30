import { z } from 'zod';

export interface ToolContract<
  TInput extends z.ZodRawShape,
  TOutput extends z.ZodRawShape
> {
  readonly name: string;
  readonly version: string;
  readonly raw: {
    readonly input: TInput;
    readonly output: TOutput;
  };
  readonly schemas: {
    readonly input: z.ZodObject<TInput>;
    readonly output: z.ZodObject<TOutput>;
  };
}

export function createToolContract<
  TInput extends z.ZodRawShape,
  TOutput extends z.ZodRawShape
>(
  name: string,
  version: string,
  input: TInput,
  output: TOutput
): ToolContract<TInput, TOutput> {
  return {
    name,
    version,
    raw: {
      input,
      output
    },
    schemas: {
      input: z.object(input),
      output: z.object(output)
    }
  };
}

export type InferInput<T extends ToolContract<z.ZodRawShape, z.ZodRawShape>> = z.infer<T['schemas']['input']>;
export type InferOutput<T extends ToolContract<z.ZodRawShape, z.ZodRawShape>> = z.infer<T['schemas']['output']>;

