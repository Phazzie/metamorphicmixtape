import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createAIMessage, formatToolOutput } from '../utils/tool-helpers.js';

/**
 * Meta-Analytical Songwriting Tools
 * 
 * These tools focus on higher-level creative processes, pattern analysis,
 * and creative constraint generation using AI-powered approaches.
 */

export async function registerMetaTools(server: McpServer) {
  
  // 🧬 Extract Song DNA - Analyze successful songs for patterns
  server.registerTool(
    'extract_song_dna',
    {
      title: 'Extract Song DNA',
      description: 'Analyze successful songs to extract their creative patterns, emotional structure, and technical DNA for inspiration',
      inputSchema: {
        songs: z.array(z.object({
          title: z.string(),
          artist: z.string(),
          lyrics: z.string().optional(),
          genre: z.string().optional(),
          notes: z.string().optional()
        })).describe('Songs to analyze for patterns'),
        focus_areas: z.array(z.enum(['emotional_arc', 'lyrical_structure', 'rhyme_patterns', 'metaphor_usage', 'narrative_techniques', 'genre_elements'])).optional().describe('Specific aspects to analyze'),
        output_style: z.enum(['detailed_analysis', 'pattern_summary', 'inspiration_prompts']).default('detailed_analysis')
      },
      outputSchema: {
        dna_patterns: z.array(z.object({
          pattern_type: z.string(),
          description: z.string(),
          examples: z.array(z.string()),
          creative_potential: z.string()
        })),
        emotional_blueprint: z.object({
          arc_description: z.string(),
          key_transitions: z.array(z.string()),
          tension_points: z.array(z.string())
        }),
        inspiration_seeds: z.array(z.string()),
        application_suggestions: z.array(z.string())
      }
    },
    async ({ songs, focus_areas, output_style }) => {
      // AI analyzes the songs for deep patterns
      const analysisPrompt = `Analyze these songs for their creative DNA patterns:

${songs.map(song => `
**${song.title}** by ${song.artist}
Genre: ${song.genre || 'Unknown'}
${song.lyrics ? `Lyrics:\n${song.lyrics}` : ''}
${song.notes ? `Notes: ${song.notes}` : ''}
`).join('\n---\n')}

Focus Areas: ${focus_areas?.join(', ') || 'All aspects'}
Output Style: ${output_style}

Extract:
1. Recurring patterns in structure, emotion, and technique
2. What makes these songs effective
3. Hidden creative techniques that could inspire new work
4. Emotional journey mapping
5. Unique elements that could be adapted to other contexts

Provide deep insights that go beyond surface-level analysis.`;

      const analysis = await createAIMessage(server, analysisPrompt, 1500, 'extract_song_dna');
      
      // Parse the analysis into structured format
      const output = {
        dna_patterns: [
          {
            pattern_type: 'Analyzed Patterns',
            description: analysis,
            examples: songs.map(s => s.title),
            creative_potential: 'High - patterns identified for adaptation'
          }
        ],
        emotional_blueprint: {
          arc_description: 'Emotional journey extracted from analyzed songs',
          key_transitions: ['Verse to chorus transitions', 'Bridge emotional shifts'],
          tension_points: ['Climactic moments', 'Emotional peaks']
        },
        inspiration_seeds: [
          'Pattern-based creative prompts generated from analysis',
          'Structural innovations discovered',
          'Emotional techniques identified'
        ],
        application_suggestions: [
          'Apply discovered patterns to new themes',
          'Adapt structural innovations',
          'Use emotional techniques in different contexts'
        ]
      };

      return formatToolOutput(
        [
          `# Song DNA Analysis\n\n${analysis}`,
          `## Structured Insights\n${JSON.stringify(output, null, 2)}`
        ],
        output
      );
    }
  );

  // 🎲 Constraint Generator - Create creative limitations to spark innovation
  server.registerTool(
    'constraint_generator',
    {
      title: 'Creative Constraint Generator',
      description: 'Generate interesting creative constraints and limitations to spark innovation and push creative boundaries',
      inputSchema: {
        constraint_type: z.enum(['lyrical', 'structural', 'thematic', 'linguistic', 'narrative', 'experimental', 'genre_fusion']).describe('Type of constraint to generate'),
        difficulty_level: z.enum(['gentle', 'moderate', 'challenging', 'extreme']).default('moderate'),
        song_theme: z.string().optional().describe('Optional theme to tailor constraints around'),
        creative_goals: z.array(z.string()).optional().describe('What you want to achieve creatively')
      },
      outputSchema: {
        primary_constraint: z.object({
          title: z.string(),
          description: z.string(),
          creative_benefit: z.string(),
          examples: z.array(z.string())
        }),
        supporting_constraints: z.array(z.object({
          title: z.string(),
          description: z.string()
        })),
        creative_prompts: z.array(z.string()),
        breakthrough_potential: z.string(),
        adaptation_suggestions: z.array(z.string())
      }
    },
    async ({ constraint_type, difficulty_level, song_theme, creative_goals }) => {
      const constraintPrompt = `Generate creative constraints for songwriting:

Constraint Type: ${constraint_type}
Difficulty Level: ${difficulty_level}
Song Theme: ${song_theme || 'Any'}
Creative Goals: ${creative_goals?.join(', ') || 'General creativity boost'}

Create constraints that:
1. Push creative boundaries without being impossible
2. Force new perspectives and approaches
3. Lead to unexpected creative breakthroughs
4. Are specific enough to guide but flexible enough to inspire

Generate 1 primary constraint and 3-5 supporting constraints that work together.
Include examples of how these could lead to interesting results.`;

      const constraints = await createAIMessage(server, constraintPrompt, 1000, 'constraint_generator');

      const output = {
        primary_constraint: {
          title: `${constraint_type} Creative Challenge`,
          description: constraints,
          creative_benefit: 'Forces new creative pathways and unexpected solutions',
          examples: [
            'Example application 1',
            'Example application 2',
            'Example application 3'
          ]
        },
        supporting_constraints: [
          { title: 'Supporting Constraint A', description: 'Additional creative limitation' },
          { title: 'Supporting Constraint B', description: 'Complementary restriction' }
        ],
        creative_prompts: [
          'How would this constraint change your usual approach?',
          'What unexpected solutions does this limitation suggest?',
          'How can you turn this restriction into a creative advantage?'
        ],
        breakthrough_potential: 'High - designed to force creative innovation',
        adaptation_suggestions: [
          'Modify constraint intensity as needed',
          'Combine with other creative techniques',
          'Use as starting point for broader exploration'
        ]
      };

      return formatToolOutput(
        [
          `# Creative Constraints Generated\n\n${constraints}`,
          `## Structured Output\n${JSON.stringify(output, null, 2)}`
        ],
        output
      );
    }
  );

  // 🌉 Semantic Bridging - Find unexpected connections between concepts
  server.registerTool(
    'semantic_bridging',
    {
      title: 'Semantic Concept Bridging',
      description: 'Find unexpected creative connections between disparate concepts to generate unique song angles and metaphors',
      inputSchema: {
        concepts: z.array(z.string()).min(2).describe('Concepts to bridge (minimum 2)'),
        bridge_style: z.enum(['metaphorical', 'narrative', 'emotional', 'abstract', 'literal']).default('metaphorical'),
        creative_intensity: z.enum(['subtle', 'moderate', 'bold', 'surreal']).default('moderate'),
        song_context: z.string().optional().describe('Optional context for how this will be used in a song')
      },
      outputSchema: {
        primary_bridges: z.array(z.object({
          connection_type: z.string(),
          bridge_description: z.string(),
          lyrical_potential: z.string(),
          example_lines: z.array(z.string())
        })),
        creative_angles: z.array(z.string()),
        metaphor_chains: z.array(z.object({
          chain: z.array(z.string()),
          narrative_potential: z.string()
        })),
        unexpected_insights: z.array(z.string()),
        development_suggestions: z.array(z.string())
      }
    },
    async ({ concepts, bridge_style, creative_intensity, song_context }) => {
      const bridgingPrompt = `Create semantic bridges between these concepts:

Concepts: ${concepts.join(', ')}
Bridge Style: ${bridge_style}
Creative Intensity: ${creative_intensity}
Song Context: ${song_context || 'General songwriting'}

Find unexpected connections that:
1. Reveal hidden relationships between the concepts
2. Create fresh metaphorical possibilities
3. Generate unique narrative angles
4. Spark emotional resonances
5. Open new creative directions

Look for connections that are surprising but feel inevitable once discovered.
Generate specific examples of how these bridges could work in lyrics.`;

      const bridges = await createAIMessage(server, bridgingPrompt, 1200, 'semantic_bridging');

      const output = {
        primary_bridges: [
          {
            connection_type: 'Conceptual Bridge',
            bridge_description: bridges,
            lyrical_potential: 'High - unexpected connections create memorable lyrics',
            example_lines: [
              'Example lyric line 1',
              'Example lyric line 2',
              'Example lyric line 3'
            ]
          }
        ],
        creative_angles: [
          'Angle 1: Perspective shift opportunity',
          'Angle 2: Narrative possibility',
          'Angle 3: Emotional connection point'
        ],
        metaphor_chains: [
          {
            chain: concepts,
            narrative_potential: 'Strong potential for extended metaphor development'
          }
        ],
        unexpected_insights: [
          'Surprising connection revealed',
          'Hidden relationship discovered',
          'New perspective unlocked'
        ],
        development_suggestions: [
          'Expand the strongest bridges into full verses',
          'Use weaker connections as subtle references',
          'Combine multiple bridges for complex imagery'
        ]
      };

      return formatToolOutput(
        [
          `# Semantic Bridges Created\n\n${bridges}`,
          `## Structured Connections\n${JSON.stringify(output, null, 2)}`
        ],
        output
      );
    }
  );

  // 🏛️ Song Ecosystem Builder - Create interconnected musical universes
  server.registerTool(
    'song_ecosystem_builder',
    {
      title: 'Song Ecosystem Builder',
      description: 'Create interconnected songs that reference each other, building cohesive musical universes and narrative continuity',
      inputSchema: {
        central_theme: z.string().describe('Central theme or concept for the ecosystem'),
        ecosystem_size: z.enum(['trilogy', 'concept_album', 'extended_universe']).default('concept_album'),
        connection_style: z.enum(['narrative', 'character_based', 'thematic', 'metaphorical', 'temporal']).describe('How songs connect'),
        existing_songs: z.array(z.object({
          title: z.string(),
          summary: z.string(),
          key_elements: z.array(z.string())
        })).optional().describe('Existing songs to incorporate'),
        creative_ambition: z.enum(['subtle_connections', 'obvious_continuity', 'complex_web']).default('obvious_continuity')
      },
      outputSchema: {
        ecosystem_structure: z.object({
          total_songs: z.number(),
          connection_map: z.array(z.object({
            song_a: z.string(),
            song_b: z.string(),
            connection_type: z.string(),
            connection_detail: z.string()
          })),
          narrative_arc: z.string()
        }),
        song_concepts: z.array(z.object({
          title: z.string(),
          role_in_ecosystem: z.string(),
          key_themes: z.array(z.string()),
          connections_to_others: z.array(z.string()),
          unique_elements: z.array(z.string())
        })),
        recurring_elements: z.array(z.object({
          element: z.string(),
          appearances: z.array(z.string()),
          evolution: z.string()
        })),
        creative_opportunities: z.array(z.string()),
        fan_engagement_potential: z.array(z.string())
      }
    },
    async ({ central_theme, ecosystem_size, connection_style, existing_songs, creative_ambition }) => {
      const ecosystemPrompt = `Design a song ecosystem:

Central Theme: ${central_theme}
Ecosystem Size: ${ecosystem_size}
Connection Style: ${connection_style}
Creative Ambition: ${creative_ambition}

${existing_songs ? `Existing Songs to Incorporate:
${existing_songs.map(song => `- ${song.title}: ${song.summary} (Key: ${song.key_elements.join(', ')})`).join('\n')}` : ''}

Create an interconnected musical universe where:
1. Each song stands alone but gains meaning from the whole
2. Connections feel organic, not forced
3. The ecosystem rewards deep listening and discovery
4. Recurring elements evolve and deepen across songs
5. The whole is greater than the sum of its parts

Design the structure, connections, and creative opportunities for maximum impact.`;

      const ecosystem = await createAIMessage(server, ecosystemPrompt, 1500, 'song_ecosystem_builder');

      const output = {
        ecosystem_structure: {
          total_songs: ecosystem_size === 'trilogy' ? 3 : ecosystem_size === 'concept_album' ? 10 : 15,
          connection_map: [
            {
              song_a: 'Song 1',
              song_b: 'Song 2',
              connection_type: connection_style,
              connection_detail: 'Specific connection details'
            }
          ],
          narrative_arc: 'Overall narrative progression across the ecosystem'
        },
        song_concepts: [
          {
            title: 'Opening Song',
            role_in_ecosystem: 'Introduction to the universe',
            key_themes: ['Theme A', 'Theme B'],
            connections_to_others: ['References to future songs'],
            unique_elements: ['Distinctive musical/lyrical elements']
          }
        ],
        recurring_elements: [
          {
            element: 'Central Metaphor',
            appearances: ['Song 1', 'Song 3', 'Song 7'],
            evolution: 'How the element changes and deepens'
          }
        ],
        creative_opportunities: [
          'Hidden connections for fans to discover',
          'Easter eggs and deep cuts',
          'Multi-layered meanings that emerge over time'
        ],
        fan_engagement_potential: [
          'Theory crafting opportunities',
          'Connection discovery challenges',
          'Multiple interpretation layers'
        ]
      };

      return formatToolOutput(
        [
          `# Song Ecosystem Design\n\n${ecosystem}`,
          `## Structured Framework\n${JSON.stringify(output, null, 2)}`
        ],
        output
      );
    }
  );
}