import test from 'node:test';
import assert from 'node:assert/strict';
import { registerSongwritingTools } from '../dist/tools/songwriting.js';
import { registerAnalysisTools } from '../dist/tools/analysis.js';
import { registerMetaTools } from '../dist/tools/meta.js';
import { registerSunoTools } from '../dist/tools/suno.js';
import { registerCollaborationTools } from '../dist/tools/collaboration.js';
import {
  songwritingContracts,
  analysisContracts,
  metaContracts,
  sunoContracts,
  collaborationContracts
} from '@metamorphic/mixtape-contracts';

interface RegisteredToolConfig {
  config: {
    inputSchema?: unknown;
    outputSchema?: unknown;
  };
}

type ToolRegistry = Map<string, RegisteredToolConfig>;

function createMockServer() {
  const registry: ToolRegistry = new Map();

  const mock = {
    registerTool(name: string, config: any, handler: any) {
      registry.set(name, { config, handler });
      return {};
    },
    server: {
      createMessage: async () => ({
        content: {
          type: 'text' as const,
          text: ''
        }
      })
    }
  } as unknown as import('@modelcontextprotocol/sdk/server/mcp.js').McpServer;

  return { registry, mock };
}

test('registerSongwritingTools uses shared schemas', async () => {
  const { registry, mock } = createMockServer();
  await registerSongwritingTools(mock);

  for (const contract of songwritingContracts) {
    const registered = registry.get(contract.name);
    assert.ok(registered, `songwriting tool ${contract.name} should be registered`);
    assert.strictEqual(registered.config.inputSchema, contract.raw.input);
    assert.strictEqual(registered.config.outputSchema, contract.raw.output);
  }
});

test('registerAnalysisTools uses shared schemas', async () => {
  const { registry, mock } = createMockServer();
  await registerAnalysisTools(mock);

  for (const contract of analysisContracts) {
    const registered = registry.get(contract.name);
    assert.ok(registered, `analysis tool ${contract.name} should be registered`);
    assert.strictEqual(registered.config.inputSchema, contract.raw.input);
    assert.strictEqual(registered.config.outputSchema, contract.raw.output);
  }
});

test('registerMetaTools uses shared schemas', async () => {
  const { registry, mock } = createMockServer();
  await registerMetaTools(mock);

  for (const contract of metaContracts) {
    const registered = registry.get(contract.name);
    assert.ok(registered, `meta tool ${contract.name} should be registered`);
    assert.strictEqual(registered.config.inputSchema, contract.raw.input);
    assert.strictEqual(registered.config.outputSchema, contract.raw.output);
  }
});

test('registerSunoTools uses shared schemas', async () => {
  const { registry, mock } = createMockServer();
  await registerSunoTools(mock);

  for (const contract of sunoContracts) {
    const registered = registry.get(contract.name);
    assert.ok(registered, `suno tool ${contract.name} should be registered`);
    assert.strictEqual(registered.config.inputSchema, contract.raw.input);
    assert.strictEqual(registered.config.outputSchema, contract.raw.output);
  }
});

test('registerCollaborationTools uses shared schemas', async () => {
  const { registry, mock } = createMockServer();
  await registerCollaborationTools(mock);

  for (const contract of collaborationContracts) {
    const registered = registry.get(contract.name);
    assert.ok(registered, `collaboration tool ${contract.name} should be registered`);
    assert.strictEqual(registered.config.inputSchema, contract.raw.input);
    assert.strictEqual(registered.config.outputSchema, contract.raw.output);
  }
});

