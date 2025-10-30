import { z } from 'zod';

/**
 * Shared contract definitions for analysis tools.
 */
export const emotionalArchaeologyInputSchema = z.object({
  data_sources: z
    .array(
      z.enum(['messages', 'emails', 'search_history', 'music_played', 'social_media', 'notes', 'calendar'])
    )
    .describe('Types of digital data to analyze'),
  time_period: z
    .enum(['last_week', 'last_month', 'last_3_months', 'last_year', 'all_time'])
    .default('last_month'),
  emotional_depth: z
    .enum(['surface', 'moderate', 'deep', 'subconscious'])
    .default('moderate'),
  privacy_level: z
    .enum(['anonymous', 'pseudonymous', 'personal'])
    .default('anonymous')
    .describe('How personally identifiable the analysis should be'),
  theme_focus: z.string().optional().describe('Optional specific emotional theme to focus on')
});

export const emotionalArchaeologyOutputSchema = z.object({
  emotional_patterns: z.array(
    z.object({
      theme: z.string(),
      intensity: z.number().min(0).max(10),
      frequency: z.string(),
      context: z.string(),
      song_potential: z.string()
    })
  ),
  hidden_themes: z.array(
    z.object({
      theme: z.string(),
      evidence: z.array(z.string()),
      creative_angle: z.string()
    })
  ),
  temporal_patterns: z.object({
    recurring_cycles: z.array(z.string()),
    seasonal_themes: z.array(z.string()),
    growth_areas: z.array(z.string())
  }),
  songwriting_prompts: z.array(z.string()),
  creative_insights: z.array(z.string())
});

export type EmotionalArchaeologyInputDto = z.infer<typeof emotionalArchaeologyInputSchema>;
export type EmotionalArchaeologyOutputDto = z.infer<typeof emotionalArchaeologyOutputSchema>;

export const analysisContracts = {
  emotionalArchaeology: {
    name: 'emotional_archaeology',
    title: 'Emotional Archaeology',
    description: 'Mine your digital communications, search history, and activity patterns to discover hidden emotional themes for songs',
    inputSchema: emotionalArchaeologyInputSchema,
    outputSchema: emotionalArchaeologyOutputSchema
  }
} as const;

export type AnalysisContractName = keyof typeof analysisContracts;
