import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { registerSongwritingTools } from '../dist/tools/songwriting.js';
import { registerAnalysisTools } from '../dist/tools/analysis.js';
import { registerMetaTools } from '../dist/tools/meta.js';
import { registerSunoTools } from '../dist/tools/suno.js';
import { registerCollaborationTools } from '../dist/tools/collaboration.js';
import {
  devilsAdvocateContractV1,
  generateLyricsContractV1,
  refineLyricsContractV1,
  songwritingCouncilContractV1
} from '../contracts/tool-contracts/dist/songwriting.js';
import {
  conversationMinerContractV1,
  emotionalArchaeologyContractV1,
  emotionalJourneyMapperContractV1,
  evolutionTrackerContractV1
} from '../contracts/tool-contracts/dist/analysis.js';
import {
  constraintGeneratorContractV1,
  extractSongDnaContractV1,
  semanticBridgingContractV1,
  songEcosystemBuilderContractV1
} from '../contracts/tool-contracts/dist/meta.js';
import {
  analyzeSunoOutputContractV1,
  formatForSunoContractV1,
  generateSunoTagsContractV1,
  optimizeSunoPromptContractV1
} from '../contracts/tool-contracts/dist/suno.js';
import {
  aiChatSessionAnalyzerContractV1,
  chatExportHelperContractV1
} from '../contracts/tool-contracts/dist/collaboration.js';

class MockMcpServer {
  constructor() {
    this.tools = new Map();
  }

  registerTool(name, metadata, handler) {
    this.tools.set(name, { metadata, handler });
  }
}

function expectMatchesContract(tools, toolName, contract) {
  const registration = tools.get(toolName);
  assert.ok(registration, `Expected ${toolName} to be registered`);
  assert.equal(registration.metadata.inputSchema, contract.inputShape, `${toolName} input schema mismatch`);
  assert.equal(registration.metadata.outputSchema, contract.outputShape, `${toolName} output schema mismatch`);
}

function expectHasSchemas(tools, toolName) {
  const registration = tools.get(toolName);
  assert.ok(registration, `Expected ${toolName} to be registered`);
  assert.ok(registration.metadata.inputSchema, `${toolName} missing input schema`);
  assert.ok(registration.metadata.outputSchema, `${toolName} missing output schema`);
}

describe('tool registrations expose expected schemas', () => {
  it('songwriting tools', async () => {
    const mock = new MockMcpServer();
    await registerSongwritingTools(mock);
    expectMatchesContract(mock.tools, 'generate_lyrics', generateLyricsContractV1);
    expectMatchesContract(mock.tools, 'refine_lyrics', refineLyricsContractV1);
    expectMatchesContract(mock.tools, 'songwriting_council', songwritingCouncilContractV1);
    expectMatchesContract(mock.tools, 'devils_advocate', devilsAdvocateContractV1);
  });

  it('analysis tools', async () => {
    const mock = new MockMcpServer();
    await registerAnalysisTools(mock);
    expectHasSchemas(mock.tools, 'emotional_archaeology');
    expectHasSchemas(mock.tools, 'evolution_tracker');
    expectHasSchemas(mock.tools, 'conversation_miner');
    expectHasSchemas(mock.tools, 'emotional_journey_mapper');
  });

  it('meta tools', async () => {
    const mock = new MockMcpServer();
    await registerMetaTools(mock);
    expectHasSchemas(mock.tools, 'extract_song_dna');
    expectHasSchemas(mock.tools, 'constraint_generator');
    expectHasSchemas(mock.tools, 'semantic_bridging');
    expectHasSchemas(mock.tools, 'song_ecosystem_builder');
  });

  it('suno tools', async () => {
    const mock = new MockMcpServer();
    await registerSunoTools(mock);
    expectMatchesContract(mock.tools, 'format_for_suno', formatForSunoContractV1);
    expectMatchesContract(mock.tools, 'generate_suno_tags', generateSunoTagsContractV1);
    expectMatchesContract(mock.tools, 'optimize_suno_prompt', optimizeSunoPromptContractV1);
    expectMatchesContract(mock.tools, 'analyze_suno_output', analyzeSunoOutputContractV1);
  });

  it('collaboration tools', async () => {
    const mock = new MockMcpServer();
    await registerCollaborationTools(mock);
    expectHasSchemas(mock.tools, 'ai_chat_session_analyzer');
    expectHasSchemas(mock.tools, 'chat_export_helper');
  });
});
