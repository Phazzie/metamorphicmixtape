import { z } from 'zod';

export const EmotionalArchaeologyRequestSchema = z.object({
  data_sources: z
    .array(
      z.enum(['messages', 'emails', 'search_history', 'music_played', 'social_media', 'notes', 'calendar'])
    )
    .describe('Types of digital data to analyze'),
  time_period: z.enum(['last_week', 'last_month', 'last_3_months', 'last_year', 'all_time']).default('last_month'),
  emotional_depth: z.enum(['surface', 'moderate', 'deep', 'subconscious']).default('moderate'),
  privacy_level: z.enum(['anonymous', 'pseudonymous', 'personal']).default('anonymous'),
  theme_focus: z.string().optional()
});

export type EmotionalArchaeologyRequest = z.infer<typeof EmotionalArchaeologyRequestSchema>;

export const EmotionalPatternSchema = z.object({
  theme: z.string(),
  intensity: z.number().min(0).max(10),
  frequency: z.string(),
  context: z.string(),
  song_potential: z.string()
});

export const HiddenThemeSchema = z.object({
  theme: z.string(),
  evidence: z.array(z.string()),
  creative_angle: z.string()
});

export const EmotionalArchaeologyResponseSchema = z.object({
  emotional_patterns: z.array(EmotionalPatternSchema),
  hidden_themes: z.array(HiddenThemeSchema),
  temporal_patterns: z.object({
    recurring_cycles: z.array(z.string()),
    seasonal_themes: z.array(z.string()),
    growth_areas: z.array(z.string())
  }),
  songwriting_prompts: z.array(z.string()),
  creative_insights: z.array(z.string())
});

export type EmotionalArchaeologyResponse = z.infer<typeof EmotionalArchaeologyResponseSchema>;
