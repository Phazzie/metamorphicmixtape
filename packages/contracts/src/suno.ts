import { z } from 'zod';

export const FormatForSunoRequestSchema = z.object({
  lyrics: z.string().describe('The lyrics to format for Suno'),
  style_tags: z.array(z.string()).optional(),
  structure_explicit: z.boolean().default(true),
  optimize_for: z.enum(['clarity', 'creativity', 'balanced']).default('balanced')
});

export type FormatForSunoRequest = z.infer<typeof FormatForSunoRequestSchema>;

export const FormatForSunoResponseSchema = z.object({
  formatted_lyrics: z.string().describe('Suno-ready lyrics with proper markers and formatting'),
  structure_markers: z.array(z.string()),
  formatting_notes: z.string(),
  suno_best_practices: z.array(z.string())
});

export type FormatForSunoResponse = z.infer<typeof FormatForSunoResponseSchema>;
