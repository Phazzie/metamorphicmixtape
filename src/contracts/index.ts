import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { ToolCallback } from '@modelcontextprotocol/sdk/server/mcp.js';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

import { registerAnalysisTools } from '../tools/analysis.js';
import { registerCollaborationTools } from '../tools/collaboration.js';
import { registerMetaTools } from '../tools/meta.js';
import { registerSongwritingTools } from '../tools/songwriting.js';
import { registerSunoTools } from '../tools/suno.js';

import type { RuntimeToolContract } from './types.js';

type ContractRegistry = {
  server: McpServer;
  contracts: Map<string, RuntimeToolContract>;
};

let contractRegistryPromise: Promise<ContractRegistry> | null = null;

function attachContractIntrospection(server: McpServer): ContractRegistry {
  const contracts = new Map<string, RuntimeToolContract>();
  const originalRegisterTool = server.registerTool.bind(server);

  (server.registerTool as unknown) = ((name: string, config: any, cb: ToolCallback) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const inputSchema = config.inputSchema ? z.object(config.inputSchema).strict() : z.object({}).strict();
    const outputSchema = config.outputSchema ? z.object(config.outputSchema).strict() : undefined;

    contracts.set(name, {
      name,
      title: config.title,
      description: config.description,
      inputSchema,
      outputSchema,
      annotations: config.annotations ?? undefined,
      _meta: config._meta ?? undefined,
      callback: cb as ToolCallback
    });

    return originalRegisterTool(name, config, cb as any);
  }) as typeof server.registerTool;

  return { server, contracts };
}

async function initializeContractRegistry(): Promise<ContractRegistry> {
  const server = new McpServer({ name: 'metamorphic-mixtape', version: '1.0.0' });
  const registry = attachContractIntrospection(server);

  await registerSongwritingTools(server);
  await registerAnalysisTools(server);
  await registerMetaTools(server);
  await registerSunoTools(server);
  await registerCollaborationTools(server);

  return registry;
}

async function getContractRegistry(): Promise<ContractRegistry> {
  if (!contractRegistryPromise) {
    contractRegistryPromise = initializeContractRegistry();
  }
  return contractRegistryPromise;
}

export async function getContractServer(): Promise<McpServer> {
  const { server } = await getContractRegistry();
  return server;
}

export async function listToolContracts(): Promise<RuntimeToolContract[]> {
  const { contracts } = await getContractRegistry();
  return Array.from(contracts.values());
}

export async function getToolContract(name: string): Promise<RuntimeToolContract | undefined> {
  const { contracts } = await getContractRegistry();
  return contracts.get(name);
}

export async function executeTool(name: string, input: unknown): Promise<CallToolResult> {
  const { contracts } = await getContractRegistry();
  const contract = contracts.get(name);
  if (!contract) {
    throw new Error(`Tool ${name} is not registered`);
  }

  const parsed = await contract.inputSchema.parseAsync(input ?? {});
  const result =
    contract.callback.length > 1
      ? await (contract.callback as (args: unknown, extra: any) => CallToolResult | Promise<CallToolResult>)( // eslint-disable-line @typescript-eslint/no-explicit-any
          parsed,
          {} as any
        )
      : await (contract.callback as (extra: any) => CallToolResult | Promise<CallToolResult>)({} as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  if (contract.outputSchema && result.structuredContent) {
    await contract.outputSchema.parseAsync(result.structuredContent);
  }

  return result;
}
