import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

import { registerSongwritingTools } from '../tools/songwriting.js';
import { registerAnalysisTools } from '../tools/analysis.js';
import { registerMetaTools } from '../tools/meta.js';
import { registerSunoTools } from '../tools/suno.js';
import { registerCollaborationTools } from '../tools/collaboration.js';
import { ToolContract } from './types.js';

export interface RegisteredTool {
  contract: ToolContract;
  callback: (args: any) => Promise<any>;
}

export interface ContractRegistry {
  server: McpServer;
  tools: Map<string, RegisteredTool>;
}

export async function initializeContractRegistry(): Promise<ContractRegistry> {
  const server = new McpServer({ name: 'metamorphic-mixtape', version: '1.0.0' });

  await registerSongwritingTools(server);
  await registerAnalysisTools(server);
  await registerMetaTools(server);
  await registerSunoTools(server);
  await registerCollaborationTools(server);

  const rawTools = (server as unknown as { _registeredTools: Record<string, any> })._registeredTools;
  const tools = new Map<string, RegisteredTool>();

  for (const [name, tool] of Object.entries(rawTools)) {
    if (!tool || typeof tool !== 'object') {
      continue;
    }

    const inputSchema = tool.inputSchema as z.ZodObject<Record<string, z.ZodTypeAny>> | undefined;

    if (!inputSchema) {
      continue;
    }

    const contract: ToolContract = {
      name,
      title: tool.title ?? name,
      description: tool.description ?? '',
      inputSchema,
      outputSchema: tool.outputSchema as z.ZodObject<Record<string, z.ZodTypeAny>> | undefined
    };

    tools.set(name, {
      contract,
      callback: tool.callback as (args: any) => Promise<any>
    });
  }

  return {
    server,
    tools
  };
}

