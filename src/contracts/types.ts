import { z } from 'zod';

export interface ToolContract {
  name: string;
  title: string;
  description: string;
  inputSchema: z.ZodObject<Record<string, z.ZodTypeAny>>;
  outputSchema?: z.ZodObject<Record<string, z.ZodTypeAny>>;
}

export interface ToolRuntimeContext {
  createMessage: (request: any) => Promise<any>;
}

export interface ToolImplementation<TInput, TOutput> {
  contract: ToolContract;
  handler: (context: ToolRuntimeContext, input: TInput) => Promise<{ content: any; structuredContent?: TOutput }>;
}

