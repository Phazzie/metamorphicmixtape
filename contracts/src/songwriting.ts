import { z } from 'zod';
import { createToolContract, InferInput, InferOutput } from './shared.js';

const generateLyricsInputV1 = {
  concept: z.string().describe(
    'The core idea, theme, or story to write about. Can be abstract (e.g., "loneliness in cities") or specific (e.g., "watching my grandmother forget who I am")'
  ),
  style: z.enum(['verse-chorus', 'narrative', 'abstract', 'free-form']).default('verse-chorus').describe(
    'Song structure style: verse-chorus (traditional), narrative (storytelling), abstract (experimental), free-form (no fixed structure)'
  ),
  tone: z.enum(['melancholic', 'uplifting', 'angry', 'reflective', 'playful', 'dark', 'hopeful', 'bittersweet']).describe(
    'Emotional tone to establish throughout the song'
  ),
  length: z.enum(['short', 'medium', 'long']).default('medium').describe(
    'Target length: short (2-3 verses), medium (3-4 verses + bridge), long (4+ verses, multiple bridges)'
  ),
  constraints: z.string().optional().describe(
    'Optional creative constraints (e.g., "use water imagery", "no rhyming", "all questions")'
  ),
  reference_style: z.string().optional().describe(
    'Optional: reference artist/song style to emulate (e.g., "Leonard Cohen storytelling", "Bon Iver abstraction")'
  )
} satisfies z.ZodRawShape;

const generateLyricsOutputV1 = {
  lyrics: z.string().describe('Complete generated lyrics with structure markers'),
  structure: z.string().describe('Song structure breakdown (e.g., "V1-C-V2-C-B-C")'),
  creative_notes: z.string().describe('Explanation of creative choices made'),
  emotional_arc: z.string().describe('Description of the emotional journey in the song'),
  suggested_refinements: z.array(z.string()).describe('Ideas for further refinement')
} satisfies z.ZodRawShape;

export const generateLyricsContractV1 = createToolContract(
  'generate_lyrics',
  'v1',
  generateLyricsInputV1,
  generateLyricsOutputV1
);

export type GenerateLyricsInputV1 = InferInput<typeof generateLyricsContractV1>;
export type GenerateLyricsOutputV1 = InferOutput<typeof generateLyricsContractV1>;

const refineLyricsInputV1 = {
  lyrics: z.string().describe('The lyrics to refine and improve'),
  focus_areas: z
    .array(
      z.enum(['rhythm', 'imagery', 'emotional_impact', 'clarity', 'structure', 'word_choice', 'transitions', 'memorability'])
    )
    .describe('Specific areas to focus refinement on'),
  keep_structure: z.boolean().default(true).describe(
    'Whether to maintain the existing verse/chorus structure or allow restructuring'
  ),
  intensity: z.enum(['light', 'moderate', 'heavy']).default('moderate').describe(
    'How extensively to revise: light (polish), moderate (improve), heavy (reimagine)'
  ),
  preserve_lines: z.array(z.string()).optional().describe(
    'Specific lines that must remain unchanged (user favorites)'
  )
} satisfies z.ZodRawShape;

const refineLyricsOutputV1 = {
  refined_lyrics: z.string().describe('Improved version of the lyrics'),
  changes_made: z
    .array(
      z.object({
        original: z.string(),
        revised: z.string(),
        reason: z.string()
      })
    )
    .describe('List of changes with explanations'),
  overall_assessment: z.string().describe('Overall evaluation of improvements made'),
  further_suggestions: z.array(z.string()).describe('Additional ideas for refinement')
} satisfies z.ZodRawShape;

export const refineLyricsContractV1 = createToolContract(
  'refine_lyrics',
  'v1',
  refineLyricsInputV1,
  refineLyricsOutputV1
);

export type RefineLyricsInputV1 = InferInput<typeof refineLyricsContractV1>;
export type RefineLyricsOutputV1 = InferOutput<typeof refineLyricsContractV1>;

const songwritingCouncilInputV1 = {
  lyrics: z.string().describe('The lyrics to get feedback on'),
  concept: z.string().optional().describe('Optional: the concept/story behind the song for context'),
  personas: z
    .array(
      z.enum(['perfectionist', 'experimentalist', 'storyteller', 'minimalist', 'maximalist', 'audience_advocate'])
    )
    .default(['perfectionist', 'experimentalist', 'storyteller'])
    .describe('Which creative personas to include in the council (choose 2-4 for best results)'),
  question: z.string().optional().describe(
    'Optional: specific question to ask the council (e.g., "Is the bridge too long?")'
  )
} satisfies z.ZodRawShape;

const songwritingCouncilOutputV1 = {
  perspectives: z
    .array(
      z.object({
        persona: z.string(),
        feedback: z.string(),
        suggestions: z.array(z.string())
      })
    )
    .describe('Feedback from each persona'),
  consensus_points: z.array(z.string()).describe('What multiple personas agreed on'),
  conflicts: z.array(z.string()).describe('Where personas disagreed (opportunities for choice)'),
  synthesis: z.string().describe("Overall synthesis of the council's wisdom")
} satisfies z.ZodRawShape;

export const songwritingCouncilContractV1 = createToolContract(
  'songwriting_council',
  'v1',
  songwritingCouncilInputV1,
  songwritingCouncilOutputV1
);

export type SongwritingCouncilInputV1 = InferInput<typeof songwritingCouncilContractV1>;
export type SongwritingCouncilOutputV1 = InferOutput<typeof songwritingCouncilContractV1>;

const devilsAdvocateInputV1 = {
  lyrics: z.string().describe('The lyrics to challenge and question'),
  concept: z.string().optional().describe('Optional: the intended concept or message'),
  challenge_level: z.enum(['gentle', 'moderate', 'intense']).default('moderate').describe(
    'How aggressively to challenge: gentle (supportive questioning), moderate (constructive critique), intense (deep probing)'
  ),
  focus: z.enum(['concept', 'execution', 'both']).default('both').describe(
    'What to challenge: the core concept, the execution of the concept, or both'
  )
} satisfies z.ZodRawShape;

const devilsAdvocateOutputV1 = {
  challenging_questions: z
    .array(
      z.object({
        question: z.string(),
        why_it_matters: z.string()
      })
    )
    .describe('Tough questions that push deeper'),
  potential_weak_points: z
    .array(
      z.object({
        issue: z.string(),
        why_problematic: z.string(),
        how_to_address: z.string()
      })
    )
    .describe('Areas that might not be working'),
  hidden_opportunities: z.array(z.string()).describe('What could be explored more deeply'),
  alternative_approaches: z.array(z.string()).describe('Different angles to consider'),
  final_challenge: z.string().describe('The biggest, most important question to answer')
} satisfies z.ZodRawShape;

export const devilsAdvocateContractV1 = createToolContract(
  'devils_advocate',
  'v1',
  devilsAdvocateInputV1,
  devilsAdvocateOutputV1
);

export type DevilsAdvocateInputV1 = InferInput<typeof devilsAdvocateContractV1>;
export type DevilsAdvocateOutputV1 = InferOutput<typeof devilsAdvocateContractV1>;

export const songwritingContracts = [
  generateLyricsContractV1,
  refineLyricsContractV1,
  songwritingCouncilContractV1,
  devilsAdvocateContractV1
] as const;

