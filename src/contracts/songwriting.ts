import { z } from 'zod';

/**
 * Shared contract definitions for songwriting tools.
 */
export const generateLyricsInputSchema = z.object({
  concept: z
    .string()
    .describe(
      'The core idea, theme, or story to write about. Can be abstract (e.g., "loneliness in cities") or specific (e.g., "watching my grandmother forget who I am")'
    ),
  style: z
    .enum(['verse-chorus', 'narrative', 'abstract', 'free-form'])
    .default('verse-chorus')
    .describe('Song structure style: verse-chorus (traditional), narrative (storytelling), abstract (experimental), free-form (no fixed structure)'),
  tone: z
    .enum(['melancholic', 'uplifting', 'angry', 'reflective', 'playful', 'dark', 'hopeful', 'bittersweet'])
    .describe('Emotional tone to establish throughout the song'),
  length: z
    .enum(['short', 'medium', 'long'])
    .default('medium')
    .describe('Target length: short (2-3 verses), medium (3-4 verses + bridge), long (4+ verses, multiple bridges)'),
  constraints: z
    .string()
    .optional()
    .describe('Optional creative constraints (e.g., "use water imagery", "no rhyming", "all questions")'),
  reference_style: z
    .string()
    .optional()
    .describe('Optional: reference artist/song style to emulate (e.g., "Leonard Cohen storytelling", "Bon Iver abstraction")')
});

export const generateLyricsOutputSchema = z.object({
  lyrics: z.string().describe('Complete generated lyrics with structure markers'),
  structure: z.string().describe('Song structure breakdown (e.g., "V1-C-V2-C-B-C")'),
  creative_notes: z.string().describe('Explanation of creative choices made'),
  emotional_arc: z.string().describe('Description of the emotional journey in the song'),
  suggested_refinements: z.array(z.string()).describe('Ideas for further refinement')
});

export type GenerateLyricsInputDto = z.infer<typeof generateLyricsInputSchema>;
export type GenerateLyricsOutputDto = z.infer<typeof generateLyricsOutputSchema>;

export const songwritingContracts = {
  generateLyrics: {
    name: 'generate_lyrics',
    title: 'Generate Song Lyrics',
    description: 'Create original song lyrics from a concept, theme, or story using AI-powered creative writing',
    inputSchema: generateLyricsInputSchema,
    outputSchema: generateLyricsOutputSchema
  }
} as const;

export type SongwritingContractName = keyof typeof songwritingContracts;
