import { z } from 'zod';

export const GenerateLyricsRequestSchema = z.object({
  concept: z.string().describe(
    'The core idea, theme, or story to write about. Can be abstract or specific.'
  ),
  style: z.enum(['verse-chorus', 'narrative', 'abstract', 'free-form']).default('verse-chorus'),
  tone: z.enum(['melancholic', 'uplifting', 'angry', 'reflective', 'playful', 'dark', 'hopeful', 'bittersweet']),
  length: z.enum(['short', 'medium', 'long']).default('medium'),
  constraints: z.string().optional(),
  reference_style: z.string().optional()
});

export type GenerateLyricsRequest = z.infer<typeof GenerateLyricsRequestSchema>;

export const GenerateLyricsResponseSchema = z.object({
  lyrics: z.string().describe('Complete generated lyrics with structure markers'),
  structure: z.string().describe('Song structure breakdown (e.g., "V1-C-V2-C-B-C")'),
  creative_notes: z.string().describe('Explanation of creative choices made'),
  emotional_arc: z.string().describe('Description of the emotional journey in the song'),
  suggested_refinements: z
    .array(z.string())
    .describe('Ideas for further refinement that keep the collaboration going')
});

export type GenerateLyricsResponse = z.infer<typeof GenerateLyricsResponseSchema>;
