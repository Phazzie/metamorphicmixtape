import { z } from 'zod';

/**
 * Shared contract definitions for Suno-focused tools.
 */
export const formatForSunoInputSchema = z.object({
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

export const formatForSunoOutputSchema = z.object({
  formatted_lyrics: z.string().describe('Suno-ready lyrics with proper markers and formatting'),
  structure_markers: z.array(z.string()).describe('List of structure markers used'),
  formatting_notes: z.string().describe('Explanation of formatting choices made'),
  suno_best_practices: z.array(z.string()).describe('Suno-specific tips applied')
});

export type FormatForSunoInputDto = z.infer<typeof formatForSunoInputSchema>;
export type FormatForSunoOutputDto = z.infer<typeof formatForSunoOutputSchema>;

export const sunoContracts = {
  formatForSuno: {
    name: 'format_for_suno',
    title: 'Format for Suno',
    description: 'Convert lyrics to Suno-ready format with proper structure markers and optimization for best generation results',
    inputSchema: formatForSunoInputSchema,
    outputSchema: formatForSunoOutputSchema
  }
} as const;

export type SunoContractName = keyof typeof sunoContracts;
