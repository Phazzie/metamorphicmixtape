import { z } from 'zod';
import { createToolContract, InferInput, InferOutput } from './shared.js';

const aiChatSessionAnalyzerInputV1 = {
  chat_export: z.string().describe('Full chat transcript (copy-paste from ChatGPT/Claude/Gemini export or conversation)'),
  chat_format: z
    .enum(['chatgpt', 'claude', 'gemini', 'generic', 'auto-detect'])
    .default('auto-detect')
    .describe('Format of the chat export'),
  analysis_focus: z
    .enum(['lyric_versions', 'creative_decisions', 'iteration_patterns', 'consensus_items', 'all'])
    .default('all')
    .describe('What aspects to focus analysis on'),
  extract_versions: z.boolean().default(true).describe('Automatically extract different lyric versions from conversation'),
  identify_consensus: z.boolean().default(true).describe('Find what you and AI agreed was best'),
  track_evolution: z.boolean().default(true).describe('Track how ideas evolved through the conversation')
} satisfies z.ZodRawShape;

const aiChatSessionAnalyzerOutputV1 = {
  conversation_summary: z.object({
    total_turns: z.number(),
    user_messages: z.number(),
    assistant_messages: z.number(),
    song_topic: z.string(),
    evolution_arc: z.string(),
    conversation_length: z.string()
  }),
  extracted_versions: z.array(
    z.object({
      version_number: z.number(),
      position_in_chat: z.string(),
      lyrics: z.string(),
      context: z.string(),
      user_reaction: z.string(),
      changes_from_previous: z.array(z.string())
    })
  ),
  creative_decisions: z.array(
    z.object({
      decision: z.string(),
      reasoning: z.string(),
      your_input: z.string(),
      ai_suggestion: z.string(),
      consensus: z.enum(['user_led', 'ai_led', 'collaborative'])
    })
  ),
  iteration_patterns: z.object({
    what_you_refined_most: z.array(z.string()),
    ai_strengths_shown: z.array(z.string()),
    your_creative_direction: z.string(),
    collaboration_style: z.string()
  }),
  final_state: z.object({
    best_version: z.string(),
    remaining_uncertainties: z.array(z.string()),
    next_steps_mentioned: z.array(z.string())
  }),
  reusable_insights: z.array(
    z.object({
      insight: z.string(),
      apply_to: z.string()
    })
  ),
  export_for_evolution_tracker: z.array(
    z.object({
      version: z.string(),
      timestamp: z.string(),
      lyrics: z.string(),
      notes: z.string()
    })
  )
} satisfies z.ZodRawShape;

export const aiChatSessionAnalyzerContractV1 = createToolContract(
  'ai_chat_session_analyzer',
  'v1',
  aiChatSessionAnalyzerInputV1,
  aiChatSessionAnalyzerOutputV1
);

export type AiChatSessionAnalyzerInputV1 = InferInput<typeof aiChatSessionAnalyzerContractV1>;
export type AiChatSessionAnalyzerOutputV1 = InferOutput<typeof aiChatSessionAnalyzerContractV1>;

const chatExportHelperInputV1 = {
  platform: z.enum(['chatgpt', 'claude', 'gemini', 'all']).default('all').describe('Which platform you need export instructions for')
} satisfies z.ZodRawShape;

const chatExportHelperOutputV1 = {
  instructions: z.array(
    z.object({
      platform: z.string(),
      method: z.string(),
      steps: z.array(z.string()),
      format_notes: z.string()
    })
  )
} satisfies z.ZodRawShape;

export const chatExportHelperContractV1 = createToolContract(
  'chat_export_helper',
  'v1',
  chatExportHelperInputV1,
  chatExportHelperOutputV1
);

export type ChatExportHelperInputV1 = InferInput<typeof chatExportHelperContractV1>;
export type ChatExportHelperOutputV1 = InferOutput<typeof chatExportHelperContractV1>;

export const collaborationContracts = [
  aiChatSessionAnalyzerContractV1,
  chatExportHelperContractV1
] as const;

