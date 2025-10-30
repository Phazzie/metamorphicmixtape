import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { z } from 'zod';

export interface RuntimeToolContract {
  name: string;
  title?: string;
  description?: string;
  inputSchema: z.ZodObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  outputSchema?: z.ZodObject<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
  annotations?: Record<string, unknown>;
  _meta?: Record<string, unknown>;
  callback: ToolCallback;
}
