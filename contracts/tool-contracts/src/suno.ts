import { z } from 'zod';
import { createToolContract, InferInput, InferOutput } from './contract.js';

const formatForSunoInputSchemaV1 = z.object({
  lyrics: z.string().describe('The lyrics to format for Suno'),
  style_tags: z.array(z.string()).optional().describe('Optional: pre-selected style tags (genre, mood, etc.)'),
  structure_explicit: z
    .boolean()
    .default(true)
    .describe('Whether to include explicit structure markers like [Verse 1], [Chorus], etc.'),
  optimize_for: z
    .enum(['clarity', 'creativity', 'balanced'])
    .default('balanced')
    .describe('Optimization focus: clarity (predictable results), creativity (experimental), balanced (best of both)')
});

const formatForSunoOutputSchemaV1 = z.object({
  formatted_lyrics: z.string().describe('Suno-ready lyrics with proper markers and formatting'),
  structure_markers: z.array(z.string()).describe('List of structure markers used'),
  formatting_notes: z.string().describe('Explanation of formatting choices made'),
  suno_best_practices: z.array(z.string()).describe('Suno-specific tips applied')
});

export const formatForSunoContractV1 = createToolContract(
  'format_for_suno',
  'v1',
  formatForSunoInputSchemaV1,
  formatForSunoOutputSchemaV1
);

export type FormatForSunoInputV1 = InferInput<typeof formatForSunoContractV1>;
export type FormatForSunoOutputV1 = InferOutput<typeof formatForSunoContractV1>;

const generateSunoTagsInputSchemaV1 = z.object({
  lyrics: z.string().describe('The lyrics to analyze for tag generation'),
  intended_genre: z.string().optional().describe('Optional: intended genre (e.g., "indie folk", "synthwave", "jazz")'),
  intended_mood: z.string().optional().describe('Optional: intended mood/feeling (e.g., "melancholic", "uplifting", "dark")'),
  reference_artists: z.array(z.string()).optional().describe('Optional: artists whose style to emulate (e.g., ["Bon Iver", "Sufjan Stevens"])'),
  specific_requests: z.string().optional().describe('Optional: specific musical elements wanted (e.g., "prominent piano", "electronic drums")')
});

const generateSunoTagsOutputSchemaV1 = z.object({
  primary_tags: z.array(z.string()).describe('Core tags that define the style'),
  secondary_tags: z.array(z.string()).describe('Supporting tags for nuance'),
  tag_explanation: z.string().describe('Why these tags were chosen'),
  alternative_tag_sets: z.array(
    z.object({
      tags: z.array(z.string()),
      description: z.string()
    })
  ).describe('Alternative tag combinations for different results'),
  tag_usage_tips: z.array(z.string()).describe('Tips for using these tags effectively')
});

export const generateSunoTagsContractV1 = createToolContract(
  'generate_suno_tags',
  'v1',
  generateSunoTagsInputSchemaV1,
  generateSunoTagsOutputSchemaV1
);

export type GenerateSunoTagsInputV1 = InferInput<typeof generateSunoTagsContractV1>;
export type GenerateSunoTagsOutputV1 = InferOutput<typeof generateSunoTagsContractV1>;

const optimizeSunoPromptInputSchemaV1 = z.object({
  lyrics: z.string().describe('Formatted lyrics for Suno'),
  tags: z.array(z.string()).describe('Style/genre tags to use'),
  title: z.string().optional().describe('Optional: song title'),
  additional_instructions: z
    .string()
    .optional()
    .describe('Optional: additional instructions for Suno (e.g., "emphasize chorus", "slow tempo")'),
  optimization_goal: z
    .enum(['commercial', 'artistic', 'experimental'])
    .default('artistic')
    .describe('Optimization goal: commercial (accessible/catchy), artistic (unique/deep), experimental (boundary-pushing)')
});

const optimizeSunoPromptOutputSchemaV1 = z.object({
  optimized_prompt: z.string().describe('Complete optimized Suno prompt ready to use'),
  prompt_components: z
    .object({
      title: z.string().optional(),
      tags: z.array(z.string()),
      lyrics: z.string(),
      special_instructions: z.string().optional()
    })
    .describe('Breakdown of prompt components'),
  optimization_notes: z.string().describe('Explanation of optimizations made'),
  generation_tips: z.array(z.string()).describe('Tips for using this prompt with Suno'),
  expected_result: z.string().describe('What to expect from Suno with this prompt')
});

export const optimizeSunoPromptContractV1 = createToolContract(
  'optimize_suno_prompt',
  'v1',
  optimizeSunoPromptInputSchemaV1,
  optimizeSunoPromptOutputSchemaV1
);

export type OptimizeSunoPromptInputV1 = InferInput<typeof optimizeSunoPromptContractV1>;
export type OptimizeSunoPromptOutputV1 = InferOutput<typeof optimizeSunoPromptContractV1>;

const analyzeSunoOutputInputSchemaV1 = z.object({
  original_prompt: z.string().describe('The prompt used for Suno generation'),
  output_description: z
    .string()
    .describe('Description of what Suno generated (since we cannot analyze audio directly, user describes it)'),
  what_worked: z.array(z.string()).optional().describe('What aspects worked well'),
  what_didnt_work: z.array(z.string()).optional().describe('What aspects did not work well'),
  desired_changes: z.string().optional().describe('What you want to change in next iteration')
});

const analyzeSunoOutputSchemaV1 = z.object({
  analysis: z
    .object({
      successful_elements: z.array(z.string()),
      problematic_elements: z.array(z.string()),
      likely_causes: z.array(z.string())
    })
    .describe('Analysis of what happened and why'),
  iteration_strategy: z
    .object({
      keep: z.array(z.string()),
      modify: z.array(z.string()),
      remove: z.array(z.string()),
      add: z.array(z.string())
    })
    .describe('Strategic changes for next iteration'),
  revised_prompt_suggestions: z
    .array(
      z.object({
        change: z.string(),
        rationale: z.string(),
        expected_impact: z.string()
      })
    )
    .describe('Specific prompt modifications to try'),
  experimentation_ideas: z.array(z.string()).describe('Creative alternatives to explore'),
  generation_insights: z.string().describe('What this generation teaches about Suno behavior')
});

export const analyzeSunoOutputContractV1 = createToolContract(
  'analyze_suno_output',
  'v1',
  analyzeSunoOutputInputSchemaV1,
  analyzeSunoOutputSchemaV1
);

export type AnalyzeSunoOutputInputV1 = InferInput<typeof analyzeSunoOutputContractV1>;
export type AnalyzeSunoOutputOutputV1 = InferOutput<typeof analyzeSunoOutputContractV1>;

export const sunoContracts = {
  formatForSuno: formatForSunoContractV1,
  generateSunoTags: generateSunoTagsContractV1,
  optimizeSunoPrompt: optimizeSunoPromptContractV1,
  analyzeSunoOutput: analyzeSunoOutputContractV1
} as const;
