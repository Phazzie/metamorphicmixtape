import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

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

FORMAT YOUR RESPONSE AS JSON:
{
  "dna_patterns": [
    {
      "pattern_type": "type of pattern (structural, emotional, lyrical, etc.)",
      "description": "detailed description of the pattern",
      "examples": ["specific example from the songs"],
      "creative_potential": "how this could be used in new work"
    }
  ],
  "emotional_blueprint": {
    "arc_description": "overall emotional journey description",
    "key_transitions": ["transition point 1", "transition point 2"],
    "tension_points": ["tension/climax point 1", "tension point 2"]
  },
  "inspiration_seeds": ["creative prompt 1", "creative prompt 2", "creative prompt 3"],
  "application_suggestions": ["suggestion 1", "suggestion 2", "suggestion 3"]
}

Provide deep, specific insights based on the actual songs analyzed.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: analysisPrompt }
        }],
        maxTokens: 1500
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';

      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          dna_patterns: [{
            pattern_type: 'Analysis',
            description: responseText || 'Analysis failed',
            examples: songs.map(s => s.title),
            creative_potential: 'Review the analysis above for insights'
          }],
          emotional_blueprint: {
            arc_description: 'See analysis above',
            key_transitions: [],
            tension_points: []
          },
          inspiration_seeds: ['Review analysis for creative prompts'],
          application_suggestions: ['Apply patterns discovered in analysis']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Song DNA Analysis\n\n## DNA Patterns\n${result.dna_patterns.map((p: any) =>
            `### ${p.pattern_type}\n${p.description}\n**Examples**: ${p.examples.join(', ')}\n**Creative Potential**: ${p.creative_potential}`
          ).join('\n\n')}\n\n## Emotional Blueprint\n${result.emotional_blueprint.arc_description}\n\n**Key Transitions**: ${result.emotional_blueprint.key_transitions.join(', ')}\n**Tension Points**: ${result.emotional_blueprint.tension_points.join(', ')}\n\n## Inspiration Seeds\n${result.inspiration_seeds.map((s: string) => `- ${s}`).join('\n')}\n\n## Application Suggestions\n${result.application_suggestions.map((s: string) => `- ${s}`).join('\n')}`
        }],
        structuredContent: result
      };
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

FORMAT YOUR RESPONSE AS JSON:
{
  "primary_constraint": {
    "title": "Name of the primary constraint",
    "description": "Detailed description of the constraint and how to apply it",
    "creative_benefit": "What creative benefits this constraint provides",
    "examples": ["Example of applying this constraint 1", "Example 2", "Example 3"]
  },
  "supporting_constraints": [
    {"title": "Supporting constraint name", "description": "How this complements the primary constraint"}
  ],
  "creative_prompts": ["Prompt to inspire creative thinking 1", "Prompt 2", "Prompt 3"],
  "breakthrough_potential": "Assessment of breakthrough potential and why",
  "adaptation_suggestions": ["How to adapt constraint 1", "Adaptation 2", "Adaptation 3"]
}

Be specific and creative - generate constraints that will genuinely spark innovation.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: constraintPrompt }
        }],
        maxTokens: 1000
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';

      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          primary_constraint: {
            title: `${constraint_type} Creative Challenge`,
            description: responseText || 'Constraint generation failed',
            creative_benefit: 'Forces new creative pathways',
            examples: ['See description above']
          },
          supporting_constraints: [],
          creative_prompts: ['How would this constraint change your approach?'],
          breakthrough_potential: 'Review the constraint description above',
          adaptation_suggestions: ['Modify intensity as needed']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Creative Constraints\n\n## Primary Constraint: ${result.primary_constraint.title}\n\n${result.primary_constraint.description}\n\n**Creative Benefit**: ${result.primary_constraint.creative_benefit}\n\n**Examples**:\n${result.primary_constraint.examples.map((e: string) => `- ${e}`).join('\n')}\n\n## Supporting Constraints\n${result.supporting_constraints.map((c: any) => `### ${c.title}\n${c.description}`).join('\n\n')}\n\n## Creative Prompts\n${result.creative_prompts.map((p: string) => `- ${p}`).join('\n')}\n\n## Breakthrough Potential\n${result.breakthrough_potential}\n\n## Adaptation Suggestions\n${result.adaptation_suggestions.map((s: string) => `- ${s}`).join('\n')}`
        }],
        structuredContent: result
      };
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

FORMAT YOUR RESPONSE AS JSON:
{
  "primary_bridges": [
    {
      "connection_type": "type of connection (metaphorical, emotional, narrative, etc.)",
      "bridge_description": "detailed description of how these concepts connect",
      "lyrical_potential": "assessment of songwriting potential",
      "example_lines": ["example lyric using this bridge", "another example line", "third example"]
    }
  ],
  "creative_angles": ["unique angle 1", "unique angle 2", "unique angle 3"],
  "metaphor_chains": [
    {
      "chain": ["concept A", "links to", "concept B"],
      "narrative_potential": "how this chain could develop in a song"
    }
  ],
  "unexpected_insights": ["surprising insight 1", "insight 2", "insight 3"],
  "development_suggestions": ["how to develop these bridges 1", "suggestion 2", "suggestion 3"]
}

Be creative and find genuinely surprising connections. Include specific example lyric lines.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: bridgingPrompt }
        }],
        maxTokens: 1200
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';

      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          primary_bridges: [{
            connection_type: 'Conceptual Bridge',
            bridge_description: responseText || 'Bridge generation failed',
            lyrical_potential: 'See description above',
            example_lines: []
          }],
          creative_angles: [],
          metaphor_chains: [{ chain: concepts, narrative_potential: 'Review bridges above' }],
          unexpected_insights: [],
          development_suggestions: ['Explore the connections described above']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Semantic Bridges: ${concepts.join(' ↔ ')}\n\n` +
            `## Primary Bridges\n${result.primary_bridges.map((b: any) =>
              `### ${b.connection_type}\n${b.bridge_description}\n\n**Lyrical Potential**: ${b.lyrical_potential}\n\n**Example Lines**:\n${b.example_lines.map((l: string) => `> ${l}`).join('\n')}`
            ).join('\n\n')}\n\n` +
            `## Creative Angles\n${result.creative_angles.map((a: string) => `- ${a}`).join('\n')}\n\n` +
            `## Metaphor Chains\n${result.metaphor_chains.map((m: any) => `**${m.chain.join(' → ')}**: ${m.narrative_potential}`).join('\n')}\n\n` +
            `## Unexpected Insights\n${result.unexpected_insights.map((i: string) => `- ${i}`).join('\n')}\n\n` +
            `## Development Suggestions\n${result.development_suggestions.map((s: string) => `- ${s}`).join('\n')}`
        }],
        structuredContent: result
      };
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
Ecosystem Size: ${ecosystem_size} (${ecosystem_size === 'trilogy' ? '3 songs' : ecosystem_size === 'concept_album' ? '8-12 songs' : '12+ songs'})
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

FORMAT YOUR RESPONSE AS JSON:
{
  "ecosystem_structure": {
    "total_songs": 10,
    "connection_map": [
      {"song_a": "Song title", "song_b": "Other song", "connection_type": "type", "connection_detail": "how they connect"}
    ],
    "narrative_arc": "overall story/emotional arc description"
  },
  "song_concepts": [
    {
      "title": "Song title",
      "role_in_ecosystem": "role this song plays",
      "key_themes": ["theme 1", "theme 2"],
      "connections_to_others": ["connection to song X", "reference to song Y"],
      "unique_elements": ["unique element 1", "unique element 2"]
    }
  ],
  "recurring_elements": [
    {"element": "recurring element name", "appearances": ["Song 1", "Song 3"], "evolution": "how it changes across songs"}
  ],
  "creative_opportunities": ["opportunity 1", "opportunity 2"],
  "fan_engagement_potential": ["engagement idea 1", "engagement idea 2"]
}

Design a complete, cohesive ecosystem with specific song concepts.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: ecosystemPrompt }
        }],
        maxTokens: 1500
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';

      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          ecosystem_structure: {
            total_songs: ecosystem_size === 'trilogy' ? 3 : ecosystem_size === 'concept_album' ? 10 : 15,
            connection_map: [],
            narrative_arc: responseText || 'Ecosystem design failed'
          },
          song_concepts: [],
          recurring_elements: [],
          creative_opportunities: ['Review the ecosystem design above'],
          fan_engagement_potential: ['Design connections based on narrative arc']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Song Ecosystem: ${central_theme}\n\n` +
            `## Structure\n**Total Songs**: ${result.ecosystem_structure.total_songs}\n**Narrative Arc**: ${result.ecosystem_structure.narrative_arc}\n\n` +
            `## Connection Map\n${result.ecosystem_structure.connection_map.map((c: any) => `- **${c.song_a}** ↔ **${c.song_b}** (${c.connection_type}): ${c.connection_detail}`).join('\n')}\n\n` +
            `## Song Concepts\n${result.song_concepts.map((s: any) =>
              `### ${s.title}\n**Role**: ${s.role_in_ecosystem}\n**Themes**: ${s.key_themes.join(', ')}\n**Connections**: ${s.connections_to_others.join(', ')}\n**Unique Elements**: ${s.unique_elements.join(', ')}`
            ).join('\n\n')}\n\n` +
            `## Recurring Elements\n${result.recurring_elements.map((r: any) => `- **${r.element}**: Appears in ${r.appearances.join(', ')}. Evolution: ${r.evolution}`).join('\n')}\n\n` +
            `## Creative Opportunities\n${result.creative_opportunities.map((o: string) => `- ${o}`).join('\n')}\n\n` +
            `## Fan Engagement\n${result.fan_engagement_potential.map((f: string) => `- ${f}`).join('\n')}`
        }],
        structuredContent: result
      };
    }
  );
}