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

describe('tool registrations reuse shared contracts', () => {
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
    expectMatchesContract(mock.tools, 'emotional_archaeology', emotionalArchaeologyContractV1);
    expectMatchesContract(mock.tools, 'evolution_tracker', evolutionTrackerContractV1);
    expectMatchesContract(mock.tools, 'conversation_miner', conversationMinerContractV1);
    expectMatchesContract(mock.tools, 'emotional_journey_mapper', emotionalJourneyMapperContractV1);
  });

  it('meta tools', async () => {
    const mock = new MockMcpServer();
    await registerMetaTools(mock);
    expectMatchesContract(mock.tools, 'extract_song_dna', extractSongDnaContractV1);
    expectMatchesContract(mock.tools, 'constraint_generator', constraintGeneratorContractV1);
    expectMatchesContract(mock.tools, 'semantic_bridging', semanticBridgingContractV1);
    expectMatchesContract(mock.tools, 'song_ecosystem_builder', songEcosystemBuilderContractV1);
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
    expectMatchesContract(mock.tools, 'ai_chat_session_analyzer', aiChatSessionAnalyzerContractV1);
    expectMatchesContract(mock.tools, 'chat_export_helper', chatExportHelperContractV1);
  });
});
