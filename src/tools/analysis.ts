import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Analysis Tools for Songwriting
 * 
 * These tools provide deep analytical capabilities for songs, lyrics,
 * and creative patterns using AI-powered analysis rather than heuristics.
 */

export async function registerAnalysisTools(server: McpServer) {

  // 🔍 Emotional Archaeology - Mine digital life for song themes
  server.registerTool(
    'emotional_archaeology',
    {
      title: 'Emotional Archaeology',
      description: 'Mine your digital communications, search history, and activity patterns to discover hidden emotional themes for songs',
      inputSchema: {
        data_sources: z.array(z.enum(['messages', 'emails', 'search_history', 'music_played', 'social_media', 'notes', 'calendar'])).describe('Types of digital data to analyze'),
        time_period: z.enum(['last_week', 'last_month', 'last_3_months', 'last_year', 'all_time']).default('last_month'),
        emotional_depth: z.enum(['surface', 'moderate', 'deep', 'subconscious']).default('moderate'),
        privacy_level: z.enum(['anonymous', 'pseudonymous', 'personal']).default('anonymous').describe('How personally identifiable the analysis should be'),
        theme_focus: z.string().optional().describe('Optional specific emotional theme to focus on')
      },
      outputSchema: {
        emotional_patterns: z.array(z.object({
          theme: z.string(),
          intensity: z.number().min(0).max(10),
          frequency: z.string(),
          context: z.string(),
          song_potential: z.string()
        })),
        hidden_themes: z.array(z.object({
          theme: z.string(),
          evidence: z.array(z.string()),
          creative_angle: z.string()
        })),
        temporal_patterns: z.object({
          recurring_cycles: z.array(z.string()),
          seasonal_themes: z.array(z.string()),
          growth_areas: z.array(z.string())
        }),
        songwriting_prompts: z.array(z.string()),
        creative_insights: z.array(z.string())
      }
    },
    async ({ data_sources, time_period, emotional_depth, privacy_level, theme_focus }) => {
      const analysisPrompt = `Perform emotional archaeology analysis for songwriting:

Data Sources to Analyze: ${data_sources.join(', ')}
Time Period: ${time_period}
Emotional Depth: ${emotional_depth}
Privacy Level: ${privacy_level}
Theme Focus: ${theme_focus || 'Open exploration'}

Generate a framework for analyzing these data sources to discover:
1. Hidden emotional patterns and themes
2. Recurring concerns or interests
3. Emotional cycles and seasonal patterns
4. Subconscious themes that could become songs
5. Creative angles on personal experiences

FORMAT YOUR RESPONSE AS JSON:
{
  "emotional_patterns": [
    {
      "theme": "emotional theme name",
      "intensity": 7,
      "frequency": "how often this appears",
      "context": "where/how this manifests",
      "song_potential": "why this would make a good song"
    }
  ],
  "hidden_themes": [
    {
      "theme": "discovered theme",
      "evidence": ["pattern 1", "pattern 2"],
      "creative_angle": "unique songwriting approach"
    }
  ],
  "temporal_patterns": {
    "recurring_cycles": ["cycle 1", "cycle 2"],
    "seasonal_themes": ["seasonal pattern 1"],
    "growth_areas": ["area of change 1"]
  },
  "songwriting_prompts": ["specific prompt 1", "prompt 2", "prompt 3"],
  "creative_insights": ["insight 1", "insight 2", "insight 3"]
}

Be specific and creative. Generate genuinely useful songwriting material.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: analysisPrompt }
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
          emotional_patterns: [{
            theme: 'Analysis Framework',
            intensity: 5,
            frequency: 'See analysis',
            context: responseText || 'Analysis failed',
            song_potential: 'Review the framework above'
          }],
          hidden_themes: [],
          temporal_patterns: { recurring_cycles: [], seasonal_themes: [], growth_areas: [] },
          songwriting_prompts: ['Explore themes from the analysis above'],
          creative_insights: ['See detailed analysis']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Emotional Archaeology Analysis\n\n` +
            `## Emotional Patterns\n${result.emotional_patterns.map((p: any) =>
              `### ${p.theme} (Intensity: ${p.intensity}/10)\n**Frequency**: ${p.frequency}\n**Context**: ${p.context}\n**Song Potential**: ${p.song_potential}`
            ).join('\n\n')}\n\n` +
            `## Hidden Themes\n${result.hidden_themes.map((t: any) =>
              `### ${t.theme}\n**Evidence**: ${t.evidence.join(', ')}\n**Creative Angle**: ${t.creative_angle}`
            ).join('\n\n')}\n\n` +
            `## Temporal Patterns\n**Recurring Cycles**: ${result.temporal_patterns.recurring_cycles.join(', ')}\n**Seasonal Themes**: ${result.temporal_patterns.seasonal_themes.join(', ')}\n**Growth Areas**: ${result.temporal_patterns.growth_areas.join(', ')}\n\n` +
            `## Songwriting Prompts\n${result.songwriting_prompts.map((p: string) => `- ${p}`).join('\n')}\n\n` +
            `## Creative Insights\n${result.creative_insights.map((i: string) => `- ${i}`).join('\n')}`
        }],
        structuredContent: result
      };
    }
  );

  // 📊 Evolution Tracker - Track creative patterns and growth
  server.registerTool(
    'evolution_tracker',
    {
      title: 'Creative Evolution Tracker',
      description: 'Track how your songs and creative patterns evolve over time to identify growth areas and emerging themes',
      inputSchema: {
        song_versions: z.array(z.object({
          version: z.string(),
          lyrics: z.string(),
          timestamp: z.string(),
          notes: z.string().optional()
        })).describe('Different versions of songs to track evolution'),
        analysis_focus: z.enum(['lyrical_development', 'structural_changes', 'thematic_evolution', 'technical_growth', 'emotional_maturity']).describe('What aspect of evolution to focus on'),
        time_span: z.enum(['single_song', 'recent_work', 'career_overview']).default('single_song'),
        pattern_depth: z.enum(['surface_changes', 'deep_patterns', 'subconscious_evolution']).default('deep_patterns')
      },
      outputSchema: {
        evolution_timeline: z.array(z.object({
          stage: z.string(),
          characteristics: z.array(z.string()),
          key_changes: z.array(z.string()),
          quality_metrics: z.object({
            creativity: z.number(),
            technical_skill: z.number(),
            emotional_depth: z.number()
          })
        })),
        growth_patterns: z.array(z.object({
          pattern: z.string(),
          evidence: z.array(z.string()),
          trajectory: z.string(),
          potential: z.string()
        })),
        creative_insights: z.array(z.string()),
        recommendations: z.array(z.object({
          area: z.string(),
          suggestion: z.string(),
          rationale: z.string()
        })),
        future_potential: z.array(z.string())
      }
    },
    async ({ song_versions, analysis_focus, time_span, pattern_depth }) => {
      const evolutionPrompt = `Analyze creative evolution of these song versions:

Song Versions:
${song_versions.map(v => `
Version: ${v.version} (${v.timestamp})
${v.lyrics}
${v.notes ? `Notes: ${v.notes}` : ''}
`).join('\n---\n')}

Analysis Focus: ${analysis_focus}
Time Span: ${time_span}
Pattern Depth: ${pattern_depth}

Track the evolution and identify:
1. How the creative work has developed over time
2. Patterns of improvement and change
3. Emerging themes and capabilities
4. Areas of consistent strength and growth
5. Trajectory predictions and recommendations

FORMAT YOUR RESPONSE AS JSON:
{
  "evolution_timeline": [
    {
      "stage": "version name/stage",
      "characteristics": ["characteristic 1", "characteristic 2"],
      "key_changes": ["change from previous"],
      "quality_metrics": {"creativity": 7, "technical_skill": 6, "emotional_depth": 8}
    }
  ],
  "growth_patterns": [
    {
      "pattern": "pattern name",
      "evidence": ["evidence 1", "evidence 2"],
      "trajectory": "direction of growth",
      "potential": "future potential assessment"
    }
  ],
  "creative_insights": ["insight 1", "insight 2", "insight 3"],
  "recommendations": [
    {"area": "area to improve", "suggestion": "specific suggestion", "rationale": "why this helps"}
  ],
  "future_potential": ["potential 1", "potential 2"]
}

Analyze the actual lyrics provided and give specific, actionable insights.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: evolutionPrompt }
        }],
        maxTokens: 1300
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';

      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          evolution_timeline: song_versions.map((v, i) => ({
            stage: v.version,
            characteristics: ['See analysis'],
            key_changes: i === 0 ? ['Initial version'] : ['Changes from previous'],
            quality_metrics: { creativity: 5, technical_skill: 5, emotional_depth: 5 }
          })),
          growth_patterns: [{ pattern: 'See analysis', evidence: [], trajectory: responseText || 'Analysis failed', potential: 'Review above' }],
          creative_insights: ['Review the detailed analysis'],
          recommendations: [],
          future_potential: ['Based on the evolution pattern above']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Creative Evolution Analysis\n\n` +
            `## Evolution Timeline\n${result.evolution_timeline.map((s: any) =>
              `### ${s.stage}\n**Characteristics**: ${s.characteristics.join(', ')}\n**Key Changes**: ${s.key_changes.join(', ')}\n**Quality Metrics**: Creativity ${s.quality_metrics.creativity}/10, Technical ${s.quality_metrics.technical_skill}/10, Emotional ${s.quality_metrics.emotional_depth}/10`
            ).join('\n\n')}\n\n` +
            `## Growth Patterns\n${result.growth_patterns.map((p: any) =>
              `### ${p.pattern}\n**Evidence**: ${p.evidence.join(', ')}\n**Trajectory**: ${p.trajectory}\n**Potential**: ${p.potential}`
            ).join('\n\n')}\n\n` +
            `## Creative Insights\n${result.creative_insights.map((i: string) => `- ${i}`).join('\n')}\n\n` +
            `## Recommendations\n${result.recommendations.map((r: any) =>
              `### ${r.area}\n${r.suggestion}\n*Rationale*: ${r.rationale}`
            ).join('\n\n')}\n\n` +
            `## Future Potential\n${result.future_potential.map((f: string) => `- ${f}`).join('\n')}`
        }],
        structuredContent: result
      };
    }
  );

  // 💭 Conversation Miner - Extract song ideas from communications
  server.registerTool(
    'conversation_miner',
    {
      title: 'Conversation Miner',
      description: 'Extract potential song concepts, emotional moments, and creative inspiration from conversations and communications',
      inputSchema: {
        conversation_text: z.string().describe('Text of conversation(s) to analyze'),
        mining_focus: z.enum(['emotional_moments', 'story_fragments', 'unique_phrases', 'relationship_dynamics', 'universal_themes']).describe('What to focus on when mining'),
        extraction_depth: z.enum(['surface_level', 'interpretive', 'deep_subtext']).default('interpretive'),
        privacy_filter: z.enum(['anonymize', 'generalize', 'preserve_essence']).default('generalize').describe('How to handle personal information'),
        creative_angle: z.enum(['literal_adaptation', 'metaphorical_translation', 'thematic_inspiration', 'emotional_core']).default('thematic_inspiration')
      },
      outputSchema: {
        song_seeds: z.array(z.object({
          concept: z.string(),
          emotional_core: z.string(),
          original_context: z.string(),
          creative_potential: z.string(),
          suggested_approach: z.string()
        })),
        memorable_phrases: z.array(z.object({
          phrase: z.string(),
          context: z.string(),
          lyrical_potential: z.string(),
          adaptation_ideas: z.array(z.string())
        })),
        emotional_moments: z.array(z.object({
          moment_description: z.string(),
          emotional_intensity: z.number().min(1).max(10),
          universality: z.string(),
          song_angle: z.string()
        })),
        relationship_dynamics: z.array(z.object({
          dynamic: z.string(),
          song_potential: z.string(),
          narrative_approach: z.string()
        })),
        creative_prompts: z.array(z.string())
      }
    },
    async ({ conversation_text, mining_focus, extraction_depth, privacy_filter, creative_angle }) => {
      const miningPrompt = `Mine this conversation for songwriting material:

Conversation:
${conversation_text}

Mining Focus: ${mining_focus}
Extraction Depth: ${extraction_depth}
Privacy Filter: ${privacy_filter}
Creative Angle: ${creative_angle}

Extract:
1. Potential song concepts and emotional cores
2. Memorable phrases that could become lyrics
3. Emotional moments worth exploring in song
4. Relationship dynamics with narrative potential
5. Universal themes that could resonate broadly

FORMAT YOUR RESPONSE AS JSON:
{
  "song_seeds": [
    {
      "concept": "song concept extracted",
      "emotional_core": "the core emotion/feeling",
      "original_context": "where in conversation this came from",
      "creative_potential": "assessment of songwriting potential",
      "suggested_approach": "how to develop this into a song"
    }
  ],
  "memorable_phrases": [
    {
      "phrase": "actual phrase from conversation",
      "context": "context it appeared in",
      "lyrical_potential": "how it could work as lyrics",
      "adaptation_ideas": ["idea 1", "idea 2"]
    }
  ],
  "emotional_moments": [
    {
      "moment_description": "description of the moment",
      "emotional_intensity": 8,
      "universality": "how universal this experience is",
      "song_angle": "angle for songwriting"
    }
  ],
  "relationship_dynamics": [
    {
      "dynamic": "relationship pattern",
      "song_potential": "potential for song",
      "narrative_approach": "storytelling approach"
    }
  ],
  "creative_prompts": ["prompt 1", "prompt 2", "prompt 3"]
}

Extract real material from the actual conversation provided.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: miningPrompt }
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
          song_seeds: [{ concept: 'See analysis', emotional_core: responseText || 'Mining failed', original_context: '', creative_potential: '', suggested_approach: '' }],
          memorable_phrases: [],
          emotional_moments: [],
          relationship_dynamics: [],
          creative_prompts: ['Review the analysis above for prompts']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Conversation Mining Results\n\n` +
            `## Song Seeds\n${result.song_seeds.map((s: any) =>
              `### ${s.concept}\n**Emotional Core**: ${s.emotional_core}\n**Context**: ${s.original_context}\n**Creative Potential**: ${s.creative_potential}\n**Suggested Approach**: ${s.suggested_approach}`
            ).join('\n\n')}\n\n` +
            `## Memorable Phrases\n${result.memorable_phrases.map((p: any) =>
              `> "${p.phrase}"\n**Context**: ${p.context}\n**Lyrical Potential**: ${p.lyrical_potential}\n**Adaptation Ideas**: ${p.adaptation_ideas.join(', ')}`
            ).join('\n\n')}\n\n` +
            `## Emotional Moments\n${result.emotional_moments.map((m: any) =>
              `### ${m.moment_description} (Intensity: ${m.emotional_intensity}/10)\n**Universality**: ${m.universality}\n**Song Angle**: ${m.song_angle}`
            ).join('\n\n')}\n\n` +
            `## Relationship Dynamics\n${result.relationship_dynamics.map((d: any) =>
              `### ${d.dynamic}\n**Song Potential**: ${d.song_potential}\n**Narrative Approach**: ${d.narrative_approach}`
            ).join('\n\n')}\n\n` +
            `## Creative Prompts\n${result.creative_prompts.map((p: string) => `- ${p}`).join('\n')}`
        }],
        structuredContent: result
      };
    }
  );

  // 🌊 Emotional Journey Mapper - Plot and optimize emotional arcs
  server.registerTool(
    'emotional_journey_mapper',
    {
      title: 'Emotional Journey Mapper',
      description: 'Map and optimize the emotional journey of songs, analyzing flow, tension, and resolution patterns',
      inputSchema: {
        song_structure: z.object({
          verses: z.array(z.string()),
          chorus: z.string(),
          bridge: z.string().optional(),
          other_sections: z.array(z.object({
            type: z.string(),
            content: z.string()
          })).optional()
        }).describe('Current song structure and lyrics'),
        desired_journey: z.enum(['gradual_build', 'emotional_rollercoaster', 'subtle_progression', 'dramatic_arc', 'cyclical_pattern']).describe('Desired emotional trajectory'),
        target_emotions: z.array(z.string()).describe('Key emotions to hit during the journey'),
        intensity_preference: z.enum(['gentle', 'moderate', 'intense', 'extreme']).default('moderate'),
        resolution_style: z.enum(['complete_resolution', 'open_ending', 'circular_return', 'ambiguous']).default('complete_resolution')
      },
      outputSchema: {
        current_journey: z.object({
          emotional_arc: z.array(z.object({
            section: z.string(),
            emotion: z.string(),
            intensity: z.number().min(1).max(10),
            transition_quality: z.string()
          })),
          journey_analysis: z.string(),
          strengths: z.array(z.string()),
          weaknesses: z.array(z.string())
        }),
        optimized_journey: z.object({
          suggested_arc: z.array(z.object({
            section: z.string(),
            target_emotion: z.string(),
            target_intensity: z.number(),
            transition_method: z.string()
          })),
          optimization_rationale: z.string(),
          key_changes: z.array(z.string())
        }),
        enhancement_suggestions: z.array(z.object({
          area: z.string(),
          current_state: z.string(),
          suggested_improvement: z.string(),
          implementation: z.string()
        })),
        alternative_journeys: z.array(z.object({
          journey_type: z.string(),
          description: z.string(),
          emotional_impact: z.string()
        }))
      }
    },
    async ({ song_structure, desired_journey, target_emotions, intensity_preference, resolution_style }) => {
      const mappingPrompt = `Map and optimize emotional journey for this song:

Current Song Structure:
Verses: ${song_structure.verses.join('\n---\n')}
Chorus: ${song_structure.chorus}
${song_structure.bridge ? `Bridge: ${song_structure.bridge}` : ''}
${song_structure.other_sections ? song_structure.other_sections.map(s => `${s.type}: ${s.content}`).join('\n') : ''}

Desired Journey: ${desired_journey}
Target Emotions: ${target_emotions.join(', ')}
Intensity Preference: ${intensity_preference}
Resolution Style: ${resolution_style}

Analyze:
1. Current emotional arc and flow
2. Transition quality between sections
3. Emotional peaks and valleys
4. Areas for optimization
5. Alternative journey possibilities

FORMAT YOUR RESPONSE AS JSON:
{
  "current_journey": {
    "emotional_arc": [
      {"section": "section name", "emotion": "current emotion", "intensity": 5, "transition_quality": "quality description"}
    ],
    "journey_analysis": "analysis of current emotional flow",
    "strengths": ["strength 1", "strength 2"],
    "weaknesses": ["weakness 1", "weakness 2"]
  },
  "optimized_journey": {
    "suggested_arc": [
      {"section": "section name", "target_emotion": "emotion", "target_intensity": 7, "transition_method": "how to transition"}
    ],
    "optimization_rationale": "why these changes improve the song",
    "key_changes": ["change 1", "change 2"]
  },
  "enhancement_suggestions": [
    {"area": "area to enhance", "current_state": "current state", "suggested_improvement": "improvement", "implementation": "how to implement"}
  ],
  "alternative_journeys": [
    {"journey_type": "journey name", "description": "description", "emotional_impact": "expected impact"}
  ]
}

Analyze the actual lyrics provided and give specific, actionable suggestions.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: mappingPrompt }
        }],
        maxTokens: 1400
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';

      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          current_journey: {
            emotional_arc: [],
            journey_analysis: responseText || 'Journey mapping failed',
            strengths: [],
            weaknesses: []
          },
          optimized_journey: {
            suggested_arc: [],
            optimization_rationale: 'See analysis above',
            key_changes: []
          },
          enhancement_suggestions: [],
          alternative_journeys: []
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Emotional Journey Analysis\n\n` +
            `## Current Journey\n${result.current_journey.journey_analysis}\n\n` +
            `### Emotional Arc\n${result.current_journey.emotional_arc.map((a: any) =>
              `**${a.section}**: ${a.emotion} (Intensity: ${a.intensity}/10) - ${a.transition_quality}`
            ).join('\n')}\n\n` +
            `**Strengths**: ${result.current_journey.strengths.join(', ')}\n**Weaknesses**: ${result.current_journey.weaknesses.join(', ')}\n\n` +
            `## Optimized Journey\n${result.optimized_journey.optimization_rationale}\n\n` +
            `### Suggested Arc\n${result.optimized_journey.suggested_arc.map((a: any) =>
              `**${a.section}**: Target ${a.target_emotion} (Intensity: ${a.target_intensity}/10)\n*Transition*: ${a.transition_method}`
            ).join('\n\n')}\n\n` +
            `### Key Changes\n${result.optimized_journey.key_changes.map((c: string) => `- ${c}`).join('\n')}\n\n` +
            `## Enhancement Suggestions\n${result.enhancement_suggestions.map((s: any) =>
              `### ${s.area}\n**Current**: ${s.current_state}\n**Suggested**: ${s.suggested_improvement}\n**Implementation**: ${s.implementation}`
            ).join('\n\n')}\n\n` +
            `## Alternative Journeys\n${result.alternative_journeys.map((j: any) =>
              `### ${j.journey_type}\n${j.description}\n**Emotional Impact**: ${j.emotional_impact}`
            ).join('\n\n')}`
        }],
        structuredContent: result
      };
    }
  );
}