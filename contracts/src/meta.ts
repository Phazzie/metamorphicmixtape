import { z } from 'zod';
import { createToolContract, InferInput, InferOutput } from './shared.js';

const extractSongDnaInputV1 = {
  songs: z
    .array(
      z.object({
        title: z.string(),
        artist: z.string(),
        lyrics: z.string().optional(),
        genre: z.string().optional(),
        notes: z.string().optional()
      })
    )
    .describe('Songs to analyze for patterns'),
  focus_areas: z
    .array(
      z.enum(['emotional_arc', 'lyrical_structure', 'rhyme_patterns', 'metaphor_usage', 'narrative_techniques', 'genre_elements'])
    )
    .optional()
    .describe('Specific aspects to analyze'),
  output_style: z.enum(['detailed_analysis', 'pattern_summary', 'inspiration_prompts']).default('detailed_analysis')
} satisfies z.ZodRawShape;

const extractSongDnaOutputV1 = {
  dna_patterns: z
    .array(
      z.object({
        pattern_type: z.string(),
        description: z.string(),
        examples: z.array(z.string()),
        creative_potential: z.string()
      })
    ),
  emotional_blueprint: z.object({
    arc_description: z.string(),
    key_transitions: z.array(z.string()),
    tension_points: z.array(z.string())
  }),
  inspiration_seeds: z.array(z.string()),
  application_suggestions: z.array(z.string())
} satisfies z.ZodRawShape;

export const extractSongDnaContractV1 = createToolContract(
  'extract_song_dna',
  'v1',
  extractSongDnaInputV1,
  extractSongDnaOutputV1
);

export type ExtractSongDnaInputV1 = InferInput<typeof extractSongDnaContractV1>;
export type ExtractSongDnaOutputV1 = InferOutput<typeof extractSongDnaContractV1>;

const constraintGeneratorInputV1 = {
  constraint_type: z
    .enum(['lyrical', 'structural', 'thematic', 'linguistic', 'narrative', 'experimental', 'genre_fusion'])
    .describe('Type of constraint to generate'),
  difficulty_level: z.enum(['gentle', 'moderate', 'challenging', 'extreme']).default('moderate'),
  song_theme: z.string().optional().describe('Optional theme to tailor constraints around'),
  creative_goals: z.array(z.string()).optional().describe('What you want to achieve creatively')
} satisfies z.ZodRawShape;

const constraintGeneratorOutputV1 = {
  primary_constraint: z.object({
    title: z.string(),
    description: z.string(),
    creative_benefit: z.string(),
    examples: z.array(z.string())
  }),
  supporting_constraints: z.array(
    z.object({
      title: z.string(),
      description: z.string()
    })
  ),
  creative_prompts: z.array(z.string()),
  breakthrough_potential: z.string(),
  adaptation_suggestions: z.array(z.string())
} satisfies z.ZodRawShape;

export const constraintGeneratorContractV1 = createToolContract(
  'constraint_generator',
  'v1',
  constraintGeneratorInputV1,
  constraintGeneratorOutputV1
);

export type ConstraintGeneratorInputV1 = InferInput<typeof constraintGeneratorContractV1>;
export type ConstraintGeneratorOutputV1 = InferOutput<typeof constraintGeneratorContractV1>;

const semanticBridgingInputV1 = {
  concepts: z.array(z.string()).min(2).describe('Concepts to bridge (minimum 2)'),
  bridge_style: z.enum(['metaphorical', 'narrative', 'emotional', 'abstract', 'literal']).default('metaphorical'),
  creative_intensity: z.enum(['subtle', 'moderate', 'bold', 'surreal']).default('moderate'),
  song_context: z.string().optional().describe('Optional context for how this will be used in a song')
} satisfies z.ZodRawShape;

const semanticBridgingOutputV1 = {
  primary_bridges: z
    .array(
      z.object({
        connection_type: z.string(),
        bridge_description: z.string(),
        lyrical_potential: z.string(),
        example_lines: z.array(z.string())
      })
    ),
  creative_angles: z.array(z.string()),
  metaphor_chains: z
    .array(
      z.object({
        chain: z.array(z.string()),
        narrative_potential: z.string()
      })
    ),
  unexpected_insights: z.array(z.string()),
  development_suggestions: z.array(z.string())
} satisfies z.ZodRawShape;

export const semanticBridgingContractV1 = createToolContract(
  'semantic_bridging',
  'v1',
  semanticBridgingInputV1,
  semanticBridgingOutputV1
);

export type SemanticBridgingInputV1 = InferInput<typeof semanticBridgingContractV1>;
export type SemanticBridgingOutputV1 = InferOutput<typeof semanticBridgingContractV1>;

const songEcosystemBuilderInputV1 = {
  central_theme: z.string().describe('Central theme or concept for the ecosystem'),
  ecosystem_size: z.enum(['trilogy', 'concept_album', 'extended_universe']).default('concept_album'),
  connection_style: z
    .enum(['narrative', 'character_based', 'thematic', 'metaphorical', 'temporal'])
    .describe('How songs connect'),
  existing_songs: z
    .array(
      z.object({
        title: z.string(),
        summary: z.string(),
        key_elements: z.array(z.string())
      })
    )
    .optional()
    .describe('Existing songs to incorporate'),
  creative_ambition: z
    .enum(['subtle_connections', 'obvious_continuity', 'complex_web'])
    .default('obvious_continuity')
} satisfies z.ZodRawShape;

const songEcosystemBuilderOutputV1 = {
  ecosystem_structure: z.object({
    total_songs: z.number(),
    connection_map: z.array(
      z.object({
        song_a: z.string(),
        song_b: z.string(),
        connection_type: z.string(),
        connection_detail: z.string()
      })
    ),
    narrative_arc: z.string()
  }),
  song_concepts: z
    .array(
      z.object({
        title: z.string(),
        role_in_ecosystem: z.string(),
        key_themes: z.array(z.string()),
        connections_to_others: z.array(z.string()),
        unique_elements: z.array(z.string())
      })
    ),
  recurring_elements: z
    .array(
      z.object({
        element: z.string(),
        appearances: z.array(z.string()),
        evolution: z.string()
      })
    ),
  creative_opportunities: z.array(z.string()),
  fan_engagement_potential: z.array(z.string())
} satisfies z.ZodRawShape;

export const songEcosystemBuilderContractV1 = createToolContract(
  'song_ecosystem_builder',
  'v1',
  songEcosystemBuilderInputV1,
  songEcosystemBuilderOutputV1
);

export type SongEcosystemBuilderInputV1 = InferInput<typeof songEcosystemBuilderContractV1>;
export type SongEcosystemBuilderOutputV1 = InferOutput<typeof songEcosystemBuilderContractV1>;

export const metaContracts = [
  extractSongDnaContractV1,
  constraintGeneratorContractV1,
  semanticBridgingContractV1,
  songEcosystemBuilderContractV1
] as const;

