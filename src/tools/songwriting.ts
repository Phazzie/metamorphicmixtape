import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Core Songwriting Tools
 * 
 * These tools handle lyric generation, refinement, and creative collaboration.
 * All tools follow Seam-Driven Development principles with contract-first design.
 */

export async function registerSongwritingTools(server: McpServer) {

  // 📝 Generate Lyrics - AI-powered lyric creation from concepts
  server.registerTool(
    'generate_lyrics',
    {
      title: 'Generate Song Lyrics',
      description: 'Create original song lyrics from a concept, theme, or story using AI-powered creative writing',
      inputSchema: {
        concept: z.string().describe(
          'The core idea, theme, or story to write about. Can be abstract (e.g., "loneliness in cities") or specific (e.g., "watching my grandmother forget who I am")'
        ),
        style: z.enum(['verse-chorus', 'narrative', 'abstract', 'free-form']).default('verse-chorus').describe(
          'Song structure style: verse-chorus (traditional), narrative (storytelling), abstract (experimental), free-form (no fixed structure)'
        ),
        tone: z.enum(['melancholic', 'uplifting', 'angry', 'reflective', 'playful', 'dark', 'hopeful', 'bittersweet']).describe(
          'Emotional tone to establish throughout the song'
        ),
        length: z.enum(['short', 'medium', 'long']).default('medium').describe(
          'Target length: short (2-3 verses), medium (3-4 verses + bridge), long (4+ verses, multiple bridges)'
        ),
        constraints: z.string().optional().describe(
          'Optional creative constraints (e.g., "use water imagery", "no rhyming", "all questions")'
        ),
        reference_style: z.string().optional().describe(
          'Optional: reference artist/song style to emulate (e.g., "Leonard Cohen storytelling", "Bon Iver abstraction")'
        )
      },
      outputSchema: {
        lyrics: z.string().describe('Complete generated lyrics with structure markers'),
        structure: z.string().describe('Song structure breakdown (e.g., "V1-C-V2-C-B-C")'),
        creative_notes: z.string().describe('Explanation of creative choices made'),
        emotional_arc: z.string().describe('Description of the emotional journey in the song'),
        suggested_refinements: z.array(z.string()).describe('Ideas for further refinement')
      }
    },
    async ({ concept, style, tone, length, constraints, reference_style }) => {
      const prompt = `You are an expert songwriter creating original, emotionally resonant lyrics.

CONCEPT: ${concept}

PARAMETERS:
- Structure Style: ${style}
- Emotional Tone: ${tone}
- Target Length: ${length}
${constraints ? `- Creative Constraints: ${constraints}` : ''}
${reference_style ? `- Reference Style: ${reference_style}` : ''}

Create complete song lyrics that:

1. **Capture the Emotional Core**: The lyrics should feel authentic and emotionally true to the concept
2. **Use Vivid, Specific Imagery**: Avoid clichés; use concrete, sensory details
3. **Establish Strong Rhythm**: Pay attention to syllable count and flow
4. **Build an Emotional Arc**: Take the listener on a journey from beginning to end
5. **Balance Craft with Rawness**: Polished but not sterile, emotional but not melodramatic

FORMAT YOUR RESPONSE AS JSON:
{
  "lyrics": "Complete lyrics with structure markers like [Verse 1], [Chorus], etc.",
  "structure": "Short structure notation like V1-C-V2-C-B-C",
  "creative_notes": "Explain the creative choices you made and why",
  "emotional_arc": "Describe the emotional journey: where it starts, where it goes, where it ends",
  "suggested_refinements": ["Idea 1 for refinement", "Idea 2", "Idea 3"]
}

Focus on creating something that feels true, not just technically correct. Take creative risks.`;

      const response = await server.server.createMessage({
        messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
        maxTokens: 2000
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';
      
      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          lyrics: responseText,
          structure: 'Unknown',
          creative_notes: 'AI response could not be fully parsed. See lyrics above.',
          emotional_arc: 'See lyrics for emotional journey.',
          suggested_refinements: ['Review and refine manually based on your vision']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Generated Lyrics\n\n${result.lyrics}\n\n` +
                `**Structure**: ${result.structure}\n\n` +
                `**Creative Notes**: ${result.creative_notes}\n\n` +
                `**Emotional Arc**: ${result.emotional_arc}\n\n` +
                `**Suggested Refinements**:\n${result.suggested_refinements.map((s: string) => `- ${s}`).join('\n')}`
        }],
        structuredContent: result
      };
    }
  );

  // ✨ Refine Lyrics - AI-powered lyric improvement
  server.registerTool(
    'refine_lyrics',
    {
      title: 'Refine Lyrics',
      description: 'Improve and polish existing lyrics with AI-powered analysis and refinement focused on specific areas',
      inputSchema: {
        lyrics: z.string().describe('The lyrics to refine and improve'),
        focus_areas: z.array(
          z.enum(['rhythm', 'imagery', 'emotional_impact', 'clarity', 'structure', 'word_choice', 'transitions', 'memorability'])
        ).describe('Specific areas to focus refinement on'),
        keep_structure: z.boolean().default(true).describe(
          'Whether to maintain the existing verse/chorus structure or allow restructuring'
        ),
        intensity: z.enum(['light', 'moderate', 'heavy']).default('moderate').describe(
          'How extensively to revise: light (polish), moderate (improve), heavy (reimagine)'
        ),
        preserve_lines: z.array(z.string()).optional().describe(
          'Specific lines that must remain unchanged (user favorites)'
        )
      },
      outputSchema: {
        refined_lyrics: z.string().describe('Improved version of the lyrics'),
        changes_made: z.array(z.object({
          original: z.string(),
          revised: z.string(),
          reason: z.string()
        })).describe('List of changes with explanations'),
        overall_assessment: z.string().describe('Overall evaluation of improvements made'),
        further_suggestions: z.array(z.string()).describe('Additional ideas for refinement')
      }
    },
    async ({ lyrics, focus_areas, keep_structure, intensity, preserve_lines }) => {
      const prompt = `You are an expert lyric editor helping to refine and improve song lyrics.

ORIGINAL LYRICS:
${lyrics}

REFINEMENT PARAMETERS:
- Focus Areas: ${focus_areas.join(', ')}
- Keep Structure: ${keep_structure ? 'Yes - maintain verse/chorus pattern' : 'No - can restructure'}
- Intensity: ${intensity} (${intensity === 'light' ? 'polish only' : intensity === 'moderate' ? 'meaningful improvements' : 'significant reimagining'})
${preserve_lines && preserve_lines.length > 0 ? `- Lines to Preserve: ${preserve_lines.join('; ')}` : ''}

Refine these lyrics by:

1. **Analyzing Current State**: Identify what's working and what could be stronger
2. **Making Strategic Improvements**: Focus on the specified areas without over-editing
3. **Preserving the Voice**: Keep the original artistic intent and emotional core
4. **Explaining Changes**: Make clear why each change improves the song

FORMAT YOUR RESPONSE AS JSON:
{
  "refined_lyrics": "Complete improved lyrics with structure markers",
  "changes_made": [
    {
      "original": "original line or phrase",
      "revised": "improved version",
      "reason": "why this change makes it stronger"
    }
  ],
  "overall_assessment": "Summary of what was improved and why",
  "further_suggestions": ["Additional idea 1", "Additional idea 2"]
}

Be respectful of the original work while making it genuinely better. Balance craft with authenticity.`;

      const response = await server.server.createMessage({
        messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
        maxTokens: 2000
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';
      
      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          refined_lyrics: responseText,
          changes_made: [],
          overall_assessment: 'AI response could not be fully parsed. See refined lyrics above.',
          further_suggestions: ['Review manually and apply additional refinements as needed']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Refined Lyrics\n\n${result.refined_lyrics}\n\n` +
                `## Changes Made\n\n${result.changes_made.map((c: any) => 
                  `**Original**: "${c.original}"\n**Revised**: "${c.revised}"\n**Reason**: ${c.reason}\n`
                ).join('\n')}\n\n` +
                `## Overall Assessment\n${result.overall_assessment}\n\n` +
                `## Further Suggestions\n${result.further_suggestions.map((s: string) => `- ${s}`).join('\n')}`
        }],
        structuredContent: result
      };
    }
  );

  // 🎭 Songwriting Council - Multi-persona creative feedback
  server.registerTool(
    'songwriting_council',
    {
      title: 'Songwriting Council',
      description: 'Get feedback from multiple creative personas (perfectionist, experimentalist, storyteller, etc.) to see different perspectives on your work',
      inputSchema: {
        lyrics: z.string().describe('The lyrics to get feedback on'),
        concept: z.string().optional().describe('Optional: the concept/story behind the song for context'),
        personas: z.array(
          z.enum(['perfectionist', 'experimentalist', 'storyteller', 'minimalist', 'maximalist', 'audience_advocate'])
        ).default(['perfectionist', 'experimentalist', 'storyteller']).describe(
          'Which creative personas to include in the council (choose 2-4 for best results)'
        ),
        question: z.string().optional().describe(
          'Optional: specific question to ask the council (e.g., "Is the bridge too long?")'
        )
      },
      outputSchema: {
        perspectives: z.array(z.object({
          persona: z.string(),
          feedback: z.string(),
          suggestions: z.array(z.string())
        })).describe('Feedback from each persona'),
        consensus_points: z.array(z.string()).describe('What multiple personas agreed on'),
        conflicts: z.array(z.string()).describe('Where personas disagreed (opportunities for choice)'),
        synthesis: z.string().describe('Overall synthesis of the council\'s wisdom')
      }
    },
    async ({ lyrics, concept, personas, question }) => {
      const personaDescriptions: Record<string, string> = {
        perfectionist: 'Focus on technical craft, precision, and polish. Notice every detail.',
        experimentalist: 'Push for creative risks, unconventional choices, and boundary-breaking.',
        storyteller: 'Emphasize narrative clarity, emotional authenticity, and human connection.',
        minimalist: 'Advocate for simplicity, cutting excess, finding the essential core.',
        maximalist: 'Suggest adding depth, layers, complexity, and richness.',
        audience_advocate: 'Consider listener experience, accessibility, and emotional impact.'
      };

      const prompt = `You are facilitating a songwriting council with multiple creative personas providing feedback.

LYRICS TO REVIEW:
${lyrics}

${concept ? `CONCEPT/CONTEXT: ${concept}` : ''}
${question ? `SPECIFIC QUESTION: ${question}` : ''}

COUNCIL MEMBERS:
${personas.map(p => `- ${p.toUpperCase()}: ${personaDescriptions[p]}`).join('\n')}

Have each persona provide:
1. Their unique perspective on the lyrics
2. What they think works well
3. What they think could be improved
4. Specific suggestions aligned with their perspective

Then identify:
- Points where personas AGREE (consensus)
- Points where personas DISAGREE (creative tensions to resolve)
- Overall synthesis of the wisdom from all perspectives

FORMAT YOUR RESPONSE AS JSON:
{
  "perspectives": [
    {
      "persona": "name of persona",
      "feedback": "their detailed perspective",
      "suggestions": ["specific suggestion 1", "suggestion 2"]
    }
  ],
  "consensus_points": ["what everyone agreed on"],
  "conflicts": ["where perspectives clash - these are choices for the artist"],
  "synthesis": "overall takeaway from the council session"
}

Make each persona's voice distinct and authentic. They should sometimes disagree - that's valuable.`;

      const response = await server.server.createMessage({
        messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
        maxTokens: 2000
      });

      const responseText = response.content.type === 'text' ? response.content.text : '';
      
      let result;
      try {
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error('No JSON found');
        result = JSON.parse(jsonMatch[0]);
      } catch (error) {
        result = {
          perspectives: personas.map(p => ({
            persona: p,
            feedback: 'Council feedback is in the full response above.',
            suggestions: []
          })),
          consensus_points: [],
          conflicts: [],
          synthesis: responseText
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Songwriting Council Feedback\n\n` +
                `## Council Members\n\n${result.perspectives.map((p: any) => 
                  `### ${p.persona.toUpperCase()}\n\n${p.feedback}\n\n**Suggestions**:\n${p.suggestions.map((s: string) => `- ${s}`).join('\n')}\n`
                ).join('\n')}\n\n` +
                `## Consensus Points\n${result.consensus_points.map((c: string) => `- ${c}`).join('\n')}\n\n` +
                `## Creative Tensions (Disagreements)\n${result.conflicts.map((c: string) => `- ${c}`).join('\n')}\n\n` +
                `## Synthesis\n${result.synthesis}`
        }],
        structuredContent: result
      };
    }
  );

  // 😈 Devil's Advocate - Critical analysis for deeper work
  server.registerTool(
    'devils_advocate',
    {
      title: "Devil's Advocate",
      description: 'Get tough, challenging questions and critique to push your work deeper. Identifies weak points and hidden opportunities.',
      inputSchema: {
        lyrics: z.string().describe('The lyrics to challenge and question'),
        concept: z.string().optional().describe('Optional: the intended concept or message'),
        challenge_level: z.enum(['gentle', 'moderate', 'intense']).default('moderate').describe(
          'How aggressively to challenge: gentle (supportive questioning), moderate (constructive critique), intense (deep probing)'
        ),
        focus: z.enum(['concept', 'execution', 'both']).default('both').describe(
          'What to challenge: the core concept, the execution of the concept, or both'
        )
      },
      outputSchema: {
        challenging_questions: z.array(z.object({
          question: z.string(),
          why_it_matters: z.string()
        })).describe('Tough questions that push deeper'),
        potential_weak_points: z.array(z.object({
          issue: z.string(),
          why_problematic: z.string(),
          how_to_address: z.string()
        })).describe('Areas that might not be working'),
        hidden_opportunities: z.array(z.string()).describe('What could be explored more deeply'),
        alternative_approaches: z.array(z.string()).describe('Different angles to consider'),
        final_challenge: z.string().describe('The biggest, most important question to answer')
      }
    },
    async ({ lyrics, concept, challenge_level, focus }) => {
      const intensityGuidance: Record<string, string> = {
        gentle: 'Be supportive while asking thoughtful questions. Frame challenges as opportunities.',
        moderate: 'Be direct and honest. Ask tough questions while remaining constructive.',
        intense: 'Be unflinching. Push hard on weak points. Demand depth and authenticity.'
      };

      const prompt = `You are a trusted critical voice helping a songwriter go deeper and create stronger work.

LYRICS:
${lyrics}

${concept ? `STATED CONCEPT: ${concept}` : ''}

APPROACH:
- Challenge Level: ${challenge_level} - ${intensityGuidance[challenge_level]}
- Focus: ${focus === 'concept' ? 'Challenge the core idea itself' : focus === 'execution' ? 'Challenge how the idea is executed' : 'Challenge both the idea and execution'}

Your role is to:

1. **Ask Uncomfortable Questions**: The questions that make the artist think "oh... I need to address that"
2. **Identify Weak Points**: Where the work isn't as strong as it could be
3. **Spot Missed Opportunities**: What's lurking beneath the surface that could be explored
4. **Suggest Alternatives**: Different approaches that might work better
5. **Pose the Defining Challenge**: The one big question this song needs to answer

Be honest and direct, but your goal is to make the work BETTER, not to tear it down.

FORMAT YOUR RESPONSE AS JSON:
{
  "challenging_questions": [
    {
      "question": "The tough question",
      "why_it_matters": "Why answering this will strengthen the song"
    }
  ],
  "potential_weak_points": [
    {
      "issue": "What might not be working",
      "why_problematic": "Why it's a problem",
      "how_to_address": "How to fix it"
    }
  ],
  "hidden_opportunities": ["Unexplored angle 1", "Unexplored angle 2"],
  "alternative_approaches": ["Different way to approach it 1", "Different way 2"],
  "final_challenge": "The biggest, most important question this song must answer to succeed"
}

Be the critical friend every artist needs but few have.`;

      const response = await server.server.createMessage({
        messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
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
          challenging_questions: [{ 
            question: 'See full response for challenging questions',
            why_it_matters: 'AI response format could not be parsed'
          }],
          potential_weak_points: [],
          hidden_opportunities: [],
          alternative_approaches: [],
          final_challenge: responseText
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Devil's Advocate Analysis\n\n` +
                `## Challenging Questions\n\n${result.challenging_questions.map((q: any) => 
                  `**Q**: ${q.question}\n**Why It Matters**: ${q.why_it_matters}\n`
                ).join('\n')}\n\n` +
                `## Potential Weak Points\n\n${result.potential_weak_points.map((w: any) => 
                  `**Issue**: ${w.issue}\n**Why Problematic**: ${w.why_problematic}\n**How to Address**: ${w.how_to_address}\n`
                ).join('\n')}\n\n` +
                `## Hidden Opportunities\n${result.hidden_opportunities.map((h: string) => `- ${h}`).join('\n')}\n\n` +
                `## Alternative Approaches\n${result.alternative_approaches.map((a: string) => `- ${a}`).join('\n')}\n\n` +
                `## The Big Challenge\n\n${result.final_challenge}`
        }],
        structuredContent: result
      };
    }
  );
}
