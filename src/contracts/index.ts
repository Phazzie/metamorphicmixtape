import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registerSongwritingTools } from '../tools/songwriting.js';
import { registerAnalysisTools } from '../tools/analysis.js';
import { registerMetaTools } from '../tools/meta.js';
import { registerSunoTools } from '../tools/suno.js';
import { registerCollaborationTools } from '../tools/collaboration.js';
import { ToolContract } from './types.js';

type RawToolSchema = z.ZodObject<Record<string, z.ZodTypeAny>> | Record<string, z.ZodTypeAny> | undefined;

type ToolRegistrationConfig = {
  title?: string;
  description?: string;
  inputSchema?: RawToolSchema;
  outputSchema?: RawToolSchema;
};

type ToolCallback = (args: unknown, extra?: unknown) => unknown | Promise<unknown>;
type RegisterTool = (name: string, config: ToolRegistrationConfig, callback: ToolCallback) => unknown;

export interface RegisteredTool {
  contract: ToolContract;
  callback: (args: unknown) => Promise<unknown>;
}

export interface ContractRegistry {
  server: McpServer;
  tools: Map<string, RegisteredTool>;
}

function normalizeSchema(schema: RawToolSchema): z.ZodObject<Record<string, z.ZodTypeAny>> | undefined {
  if (!schema) {
    return undefined;
  }

  if (schema instanceof z.ZodObject) {
    return schema as z.ZodObject<Record<string, z.ZodTypeAny>>;
  }

  return z.object(schema as Record<string, z.ZodTypeAny>);
}

export async function initializeContractRegistry(): Promise<ContractRegistry> {
  const server = new McpServer({ name: 'metamorphic-mixtape', version: '1.0.0' });
  const tools = new Map<string, RegisteredTool>();
  const serverWithRegister = server as unknown as { registerTool: RegisterTool };
  const registerTool = serverWithRegister.registerTool.bind(server) as RegisterTool;

  serverWithRegister.registerTool = (name, config, callback) => {
    const registration = registerTool(name, config, callback);
    const inputSchema = normalizeSchema(config.inputSchema);

    if (inputSchema && typeof callback === 'function') {
      tools.set(name, {
        contract: {
          name,
          title: config.title ?? name,
          description: config.description ?? '',
          inputSchema,
          outputSchema: normalizeSchema(config.outputSchema)
        },
        callback: async (args: unknown) => callback(args)
      });
    }

    return registration;
  };

  await registerSongwritingTools(server);
  await registerAnalysisTools(server);
  await registerMetaTools(server);
  await registerSunoTools(server);
  await registerCollaborationTools(server);

  return {
    server,
    tools
  };
}
