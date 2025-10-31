import { z } from 'zod';
import { createToolContract, InferInput, InferOutput } from './contract.js';

const emotionalArchaeologyInputSchemaV1 = z.object({
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

const emotionalArchaeologyOutputSchemaV1 = z.object({
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

export const emotionalArchaeologyContractV1 = createToolContract(
  'emotional_archaeology',
  'v1',
  emotionalArchaeologyInputSchemaV1,
  emotionalArchaeologyOutputSchemaV1
);

export type EmotionalArchaeologyInputV1 = InferInput<typeof emotionalArchaeologyContractV1>;
export type EmotionalArchaeologyOutputV1 = InferOutput<typeof emotionalArchaeologyContractV1>;

const evolutionTrackerInputSchemaV1 = z.object({
  song_versions: z
    .array(
      z.object({
        version: z.string(),
        lyrics: z.string(),
        timestamp: z.string(),
        notes: z.string().optional()
      })
    )
    .describe('Different versions of songs to track evolution'),
  analysis_focus: z
    .enum([
      'lyrical_development',
      'structural_changes',
      'thematic_evolution',
      'technical_growth',
      'emotional_maturity'
    ])
    .describe('What aspect of evolution to focus on'),
  time_span: z.enum(['single_song', 'recent_work', 'career_overview']).default('single_song'),
  pattern_depth: z
    .enum(['surface_changes', 'deep_patterns', 'subconscious_evolution'])
    .default('deep_patterns')
});

const evolutionTrackerOutputSchemaV1 = z.object({
  evolution_timeline: z.array(
    z.object({
      stage: z.string(),
      characteristics: z.array(z.string()),
      key_changes: z.array(z.string()),
      quality_metrics: z.object({
        creativity: z.number(),
        technical_skill: z.number(),
        emotional_depth: z.number()
      })
    })
  ),
  growth_patterns: z.array(
    z.object({
      pattern: z.string(),
      evidence: z.array(z.string()),
      trajectory: z.string(),
      potential: z.string()
    })
  ),
  creative_insights: z.array(z.string()),
  recommendations: z.array(
    z.object({
      area: z.string(),
      suggestion: z.string(),
      rationale: z.string()
    })
  ),
  future_potential: z.array(z.string())
});

export const evolutionTrackerContractV1 = createToolContract(
  'evolution_tracker',
  'v1',
  evolutionTrackerInputSchemaV1,
  evolutionTrackerOutputSchemaV1
);

export type EvolutionTrackerInputV1 = InferInput<typeof evolutionTrackerContractV1>;
export type EvolutionTrackerOutputV1 = InferOutput<typeof evolutionTrackerContractV1>;

const conversationMinerInputSchemaV1 = z.object({
  conversation_text: z.string().describe('Text of conversation(s) to analyze'),
  mining_focus: z
    .enum([
      'emotional_moments',
      'story_fragments',
      'unique_phrases',
      'relationship_dynamics',
      'universal_themes'
    ])
    .describe('What to focus on when mining'),
  extraction_depth: z
    .enum(['surface_level', 'interpretive', 'deep_subtext'])
    .default('interpretive'),
  privacy_filter: z
    .enum(['anonymize', 'generalize', 'preserve_essence'])
    .default('generalize')
    .describe('How to handle personal information'),
  creative_angle: z
    .enum(['literal_adaptation', 'metaphorical_translation', 'thematic_inspiration', 'emotional_core'])
    .default('thematic_inspiration')
});

const conversationMinerOutputSchemaV1 = z.object({
  song_seeds: z.array(
    z.object({
      concept: z.string(),
      emotional_core: z.string(),
      original_context: z.string(),
      creative_potential: z.string(),
      suggested_approach: z.string()
    })
  ),
  memorable_phrases: z.array(
    z.object({
      phrase: z.string(),
      context: z.string(),
      lyrical_potential: z.string(),
      adaptation_ideas: z.array(z.string())
    })
  ),
  emotional_moments: z.array(
    z.object({
      moment_description: z.string(),
      emotional_intensity: z.number().min(1).max(10),
      universality: z.string(),
      song_angle: z.string()
    })
  ),
  relationship_dynamics: z.array(
    z.object({
      dynamic: z.string(),
      song_potential: z.string(),
      narrative_approach: z.string()
    })
  ),
  creative_prompts: z.array(z.string())
});

export const conversationMinerContractV1 = createToolContract(
  'conversation_miner',
  'v1',
  conversationMinerInputSchemaV1,
  conversationMinerOutputSchemaV1
);

export type ConversationMinerInputV1 = InferInput<typeof conversationMinerContractV1>;
export type ConversationMinerOutputV1 = InferOutput<typeof conversationMinerContractV1>;

const emotionalJourneyMapperInputSchemaV1 = z.object({
  song_structure: z
    .object({
      verses: z.array(z.string()),
      chorus: z.string(),
      bridge: z.string().optional(),
      other_sections: z
        .array(
          z.object({
            type: z.string(),
            content: z.string()
          })
        )
        .optional()
    })
    .describe('Current song structure and lyrics'),
  desired_journey: z
    .enum(['gradual_build', 'emotional_rollercoaster', 'subtle_progression', 'dramatic_arc', 'cyclical_pattern'])
    .describe('Desired emotional trajectory'),
  target_emotions: z.array(z.string()).describe('Key emotions to hit during the journey'),
  intensity_preference: z
    .enum(['gentle', 'moderate', 'intense', 'extreme'])
    .default('moderate'),
  resolution_style: z
    .enum(['complete_resolution', 'open_ending', 'circular_return', 'ambiguous'])
    .default('complete_resolution')
});

const emotionalJourneyMapperOutputSchemaV1 = z.object({
  current_journey: z.object({
    emotional_arc: z.array(
      z.object({
        section: z.string(),
        emotion: z.string(),
        intensity: z.number().min(1).max(10),
        transition_quality: z.string()
      })
    ),
    journey_analysis: z.string(),
    strengths: z.array(z.string()),
    weaknesses: z.array(z.string())
  }),
  optimized_journey: z.object({
    suggested_arc: z.array(
      z.object({
        section: z.string(),
        target_emotion: z.string(),
        target_intensity: z.number(),
        transition_method: z.string()
      })
    ),
    optimization_rationale: z.string(),
    key_changes: z.array(z.string())
  }),
  enhancement_suggestions: z.array(
    z.object({
      area: z.string(),
      current_state: z.string(),
      suggested_improvement: z.string(),
      implementation: z.string()
    })
  ),
  alternative_journeys: z.array(
    z.object({
      journey_type: z.string(),
      description: z.string(),
      emotional_impact: z.string()
    })
  )
});

export const emotionalJourneyMapperContractV1 = createToolContract(
  'emotional_journey_mapper',
  'v1',
  emotionalJourneyMapperInputSchemaV1,
  emotionalJourneyMapperOutputSchemaV1
);

export type EmotionalJourneyMapperInputV1 = InferInput<typeof emotionalJourneyMapperContractV1>;
export type EmotionalJourneyMapperOutputV1 = InferOutput<typeof emotionalJourneyMapperContractV1>;

export const analysisContracts = {
  emotionalArchaeology: emotionalArchaeologyContractV1,
  evolutionTracker: evolutionTrackerContractV1,
  conversationMiner: conversationMinerContractV1,
  emotionalJourneyMapper: emotionalJourneyMapperContractV1
} as const;
