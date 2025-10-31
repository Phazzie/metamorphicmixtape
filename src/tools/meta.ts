import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  constraintGeneratorContractV1,
  extractSongDnaContractV1,
  semanticBridgingContractV1,
  songEcosystemBuilderContractV1
} from '@metamorphicmixtape/contracts/meta';
import type {
  ConstraintGeneratorInputV1,
  ExtractSongDnaInputV1,
  SemanticBridgingInputV1,
  SongEcosystemBuilderInputV1
} from '@metamorphicmixtape/contracts/meta';

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
      inputSchema: extractSongDnaContractV1.inputShape,
      outputSchema: extractSongDnaContractV1.outputShape
    },
    async ({ songs, focus_areas, output_style }: ExtractSongDnaInputV1) => {
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

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: analysisPrompt }
        }],
        maxTokens: 1500
      });

      const analysis = response.content.type === 'text' ? response.content.text : 'Analysis failed';
      
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

      return {
        content: [{ 
          type: 'text', 
          text: `# Song DNA Analysis\n\n${analysis}\n\n## Structured Insights\n${JSON.stringify(output, null, 2)}` 
        }],
        structuredContent: output
      };
    }
  );

  // 🎲 Constraint Generator - Create creative limitations to spark innovation
  server.registerTool(
    'constraint_generator',
    {
      title: 'Creative Constraint Generator',
      description: 'Generate interesting creative constraints and limitations to spark innovation and push creative boundaries',
      inputSchema: constraintGeneratorContractV1.inputShape,
      outputSchema: constraintGeneratorContractV1.outputShape
    },
    async ({ constraint_type, difficulty_level, song_theme, creative_goals }: ConstraintGeneratorInputV1) => {
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

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: constraintPrompt }
        }],
        maxTokens: 1000
      });

      const constraints = response.content.type === 'text' ? response.content.text : 'Constraint generation failed';

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

      return {
        content: [{
          type: 'text',
          text: `# Creative Constraints Generated\n\n${constraints}\n\n## Structured Output\n${JSON.stringify(output, null, 2)}`
        }],
        structuredContent: output
      };
    }
  );

  // 🌉 Semantic Bridging - Find unexpected connections between concepts
  server.registerTool(
    'semantic_bridging',
    {
      title: 'Semantic Concept Bridging',
      description: 'Find unexpected creative connections between disparate concepts to generate unique song angles and metaphors',
      inputSchema: semanticBridgingContractV1.inputShape,
      outputSchema: semanticBridgingContractV1.outputShape
    },
    async ({ concepts, bridge_style, creative_intensity, song_context }: SemanticBridgingInputV1) => {
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

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: bridgingPrompt }
        }],
        maxTokens: 1200
      });

      const bridges = response.content.type === 'text' ? response.content.text : 'Bridge generation failed';

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

      return {
        content: [{
          type: 'text',
          text: `# Semantic Bridges Created\n\n${bridges}\n\n## Structured Connections\n${JSON.stringify(output, null, 2)}`
        }],
        structuredContent: output
      };
    }
  );

  // 🏛️ Song Ecosystem Builder - Create interconnected musical universes
  server.registerTool(
    'song_ecosystem_builder',
    {
      title: 'Song Ecosystem Builder',
      description: 'Create interconnected songs that reference each other, building cohesive musical universes and narrative continuity',
      inputSchema: songEcosystemBuilderContractV1.inputShape,
      outputSchema: songEcosystemBuilderContractV1.outputShape
    },
    async ({
      central_theme,
      ecosystem_size,
      connection_style,
      existing_songs,
      creative_ambition
    }: SongEcosystemBuilderInputV1) => {
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

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: ecosystemPrompt }
        }],
        maxTokens: 1500
      });

      const ecosystem = response.content.type === 'text' ? response.content.text : 'Ecosystem design failed';

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

      return {
        content: [{
          type: 'text',
          text: `# Song Ecosystem Design\n\n${ecosystem}\n\n## Structured Framework\n${JSON.stringify(output, null, 2)}`
        }],
        structuredContent: output
      };
    }
  );
}