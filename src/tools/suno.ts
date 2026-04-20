import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import {
  analyzeSunoOutputContractV1,
  formatForSunoContractV1,
  generateSunoTagsContractV1,
  optimizeSunoPromptContractV1
} from '@metamorphicmixtape/contracts/suno';
import type {
  AnalyzeSunoOutputInputV1,
  FormatForSunoInputV1,
  GenerateSunoTagsInputV1,
  OptimizeSunoPromptInputV1
} from '@metamorphicmixtape/contracts/suno';

/**
 * Suno-Specific Tools
 * 
 * These tools handle Suno AI formatting, optimization, and workflow integration.
 * All tools follow Seam-Driven Development principles with contract-first design.
 */

export async function registerSunoTools(server: McpServer) {

  // 🎧 Format for Suno - Convert lyrics to Suno-optimized format
  server.registerTool(
    'format_for_suno',
    {
      title: 'Format for Suno',
      description: 'Convert lyrics to Suno-ready format with proper structure markers and optimization for best generation results',
      inputSchema: formatForSunoContractV1.inputShape,
      outputSchema: formatForSunoContractV1.outputShape
    },
    async ({ lyrics, style_tags, structure_explicit, optimize_for }: FormatForSunoInputV1) => {
      const prompt = `You are a Suno AI formatting expert. Format these lyrics for optimal Suno generation.

LYRICS TO FORMAT:
${lyrics}

${style_tags && style_tags.length > 0 ? `STYLE TAGS: ${style_tags.join(', ')}` : ''}

FORMATTING REQUIREMENTS:
- Structure Markers: ${structure_explicit ? 'Include explicit markers like [Verse 1], [Chorus], [Bridge]' : 'Minimal markers, let Suno infer structure'}
- Optimization: ${optimize_for} - ${optimize_for === 'clarity' ? 'Clear, predictable structure' : optimize_for === 'creativity' ? 'Leave room for Suno creativity' : 'Balance structure with creative freedom'}

Suno Best Practices:
1. **Structure Markers**: Use [Verse 1], [Chorus], [Verse 2], [Bridge], [Outro], etc.
2. **Line Breaks**: Clear line breaks for phrasing guidance
3. **Repetition**: Mark repeated sections clearly (e.g., [Chorus] appears multiple times)
4. **Length**: Keep total length reasonable (Suno works best with 2-4 minute songs)
5. **Clarity**: Avoid overly complex structures that confuse the AI
6. **Creative Freedom**: Leave some room for Suno's interpretation

FORMAT YOUR RESPONSE AS JSON:
{
  "formatted_lyrics": "Complete lyrics with Suno-ready formatting and markers",
  "structure_markers": ["[Verse 1]", "[Chorus]", etc.],
  "formatting_notes": "Explanation of formatting decisions",
  "suno_best_practices": ["Practice 1 applied", "Practice 2 applied"]
}

Make this ready to copy-paste directly into Suno.`;

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
          formatted_lyrics: responseText,
          structure_markers: ['[Verse]', '[Chorus]'],
          formatting_notes: 'AI response could not be fully parsed. See formatted lyrics above.',
          suno_best_practices: ['Review formatting before using in Suno']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Suno-Formatted Lyrics\n\n${result.formatted_lyrics}\n\n` +
                `**Structure Markers**: ${result.structure_markers.join(', ')}\n\n` +
                `**Formatting Notes**: ${result.formatting_notes}\n\n` +
                `**Suno Best Practices Applied**:\n${result.suno_best_practices.map((p: string) => `- ${p}`).join('\n')}`
        }],
        structuredContent: result
      };
    }
  );

  // 🏷️ Generate Suno Tags - AI-powered tag generation
  server.registerTool(
    'generate_suno_tags',
    {
      title: 'Generate Suno Tags',
      description: 'Analyze lyrics and creative intent to generate optimal Suno style/genre tags for desired musical results',
      inputSchema: generateSunoTagsContractV1.inputShape,
      outputSchema: generateSunoTagsContractV1.outputShape
    },
    async ({
      lyrics,
      intended_genre,
      intended_mood,
      reference_artists,
      specific_requests
    }: GenerateSunoTagsInputV1) => {
      const prompt = `You are a Suno AI tag expert. Analyze these lyrics and suggest optimal Suno tags.

LYRICS:
${lyrics}

${intended_genre ? `INTENDED GENRE: ${intended_genre}` : ''}
${intended_mood ? `INTENDED MOOD: ${intended_mood}` : ''}
${reference_artists && reference_artists.length > 0 ? `REFERENCE ARTISTS: ${reference_artists.join(', ')}` : ''}
${specific_requests ? `SPECIFIC REQUESTS: ${specific_requests}` : ''}

Generate Suno tags that:

1. **Match the Lyrical Content**: Tags should align with the themes and emotions in the lyrics
2. **Achieve the Intended Sound**: If genre/mood specified, tags should guide Suno there
3. **Balance Specificity**: Specific enough to guide, open enough for creativity
4. **Use Suno's Vocabulary**: Tags that Suno actually understands and responds to well
5. **Provide Options**: Main tags plus alternatives for experimentation

Suno Tag Categories:
- **Genre**: indie, folk, rock, pop, electronic, jazz, etc.
- **Mood**: melancholic, uplifting, dark, dreamy, energetic, etc.
- **Instruments**: piano, guitar, synth, strings, drums, etc.
- **Vocal Style**: male vocals, female vocals, harmony, spoken word, etc.
- **Production**: lo-fi, polished, raw, atmospheric, etc.

FORMAT YOUR RESPONSE AS JSON:
{
  "primary_tags": ["main tag 1", "main tag 2", "main tag 3"],
  "secondary_tags": ["supporting tag 1", "supporting tag 2"],
  "tag_explanation": "Why these specific tags were chosen based on lyrics and intent",
  "alternative_tag_sets": [
    {
      "tags": ["alt tag 1", "alt tag 2"],
      "description": "For a different interpretation (e.g., more electronic, more acoustic)"
    }
  ],
  "tag_usage_tips": ["Tip 1 for using these tags", "Tip 2"]
}

Prioritize tags that will actually influence Suno's generation in meaningful ways.`;

      const response = await server.server.createMessage({
        messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
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
          primary_tags: ['indie', 'folk', 'acoustic'],
          secondary_tags: ['melancholic', 'intimate'],
          tag_explanation: 'AI response could not be fully parsed. Default tags provided.',
          alternative_tag_sets: [],
          tag_usage_tips: ['Review and adjust tags based on your specific vision']
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Suno Tags\n\n` +
                `## Primary Tags\n${result.primary_tags.join(', ')}\n\n` +
                `## Secondary Tags\n${result.secondary_tags.join(', ')}\n\n` +
                `**Why These Tags**: ${result.tag_explanation}\n\n` +
                `## Alternative Tag Sets\n\n${result.alternative_tag_sets.map((a: any) => 
                  `**${a.description}**: ${a.tags.join(', ')}`
                ).join('\n\n')}\n\n` +
                `## Usage Tips\n${result.tag_usage_tips.map((t: string) => `- ${t}`).join('\n')}`
        }],
        structuredContent: result
      };
    }
  );

  // ⚡ Optimize Suno Prompt - Complete prompt optimization
  server.registerTool(
    'optimize_suno_prompt',
    {
      title: 'Optimize Suno Prompt',
      description: 'Create an optimized complete Suno prompt from lyrics and tags for best generation results',
      inputSchema: optimizeSunoPromptContractV1.inputShape,
      outputSchema: optimizeSunoPromptContractV1.outputShape
    },
    async ({
      lyrics,
      tags,
      title,
      additional_instructions,
      optimization_goal
    }: OptimizeSunoPromptInputV1) => {
      const goalDescriptions: Record<string, string> = {
        commercial: 'Maximize accessibility and memorability for broad appeal',
        artistic: 'Balance uniqueness with listenability for artistic integrity',
        experimental: 'Push creative boundaries while maintaining coherence'
      };

      const prompt = `You are a Suno AI prompt optimization expert. Create the optimal prompt for Suno generation.

COMPONENTS:
${title ? `TITLE: ${title}` : ''}
TAGS: ${tags.join(', ')}

LYRICS:
${lyrics}

${additional_instructions ? `ADDITIONAL INSTRUCTIONS: ${additional_instructions}` : ''}

OPTIMIZATION GOAL: ${optimization_goal} - ${goalDescriptions[optimization_goal]}

Optimize this prompt by:

1. **Arranging Components**: Title, tags, and lyrics in optimal order
2. **Refining Tags**: Ensure tags work well together and guide Suno effectively
3. **Formatting Consistency**: Clean, Suno-friendly formatting
4. **Maximizing Clarity**: Clear signals about desired outcome
5. **Creative Balance**: Specific enough to guide, open enough for AI creativity

Suno Prompt Best Practices:
- Tags at the beginning set the sonic palette
- Clear structure markers guide arrangement
- Length matters (2-4 minutes ideal)
- Too many tags can confuse; pick impactful ones
- Title can influence generation (optional but helpful)

FORMAT YOUR RESPONSE AS JSON:
{
  "optimized_prompt": "The complete, ready-to-use Suno prompt",
  "prompt_components": {
    "title": "song title if included",
    "tags": ["tag1", "tag2"],
    "lyrics": "formatted lyrics",
    "special_instructions": "any special instructions"
  },
  "optimization_notes": "Explain the optimizations made and why",
  "generation_tips": ["Tip 1 for generation", "Tip 2"],
  "expected_result": "What you can expect Suno to generate with this prompt"
}

Create a prompt optimized for ${optimization_goal} results.`;

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
        const basicPrompt = `${tags.join(', ')}\n\n${lyrics}`;
        result = {
          optimized_prompt: basicPrompt,
          prompt_components: {
            title,
            tags,
            lyrics,
            special_instructions: additional_instructions
          },
          optimization_notes: 'AI response could not be fully parsed. Basic prompt provided.',
          generation_tips: ['Review prompt before submitting to Suno'],
          expected_result: 'Suno should generate a song matching the tags and lyrics provided'
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Optimized Suno Prompt\n\n\`\`\`\n${result.optimized_prompt}\n\`\`\`\n\n` +
                `## Components\n` +
                `${result.prompt_components.title ? `**Title**: ${result.prompt_components.title}\n` : ''}` +
                `**Tags**: ${result.prompt_components.tags.join(', ')}\n\n` +
                `**Optimization Notes**: ${result.optimization_notes}\n\n` +
                `## Generation Tips\n${result.generation_tips.map((t: string) => `- ${t}`).join('\n')}\n\n` +
                `**Expected Result**: ${result.expected_result}`
        }],
        structuredContent: result
      };
    }
  );

  // 📊 Analyze Suno Output - Post-generation analysis
  server.registerTool(
    'analyze_suno_output',
    {
      title: 'Analyze Suno Output',
      description: 'Analyze Suno-generated results and get strategic suggestions for improving the next iteration',
      inputSchema: analyzeSunoOutputContractV1.inputShape,
      outputSchema: analyzeSunoOutputContractV1.outputShape
    },
    async ({
      original_prompt,
      output_description,
      what_worked,
      what_didnt_work,
      desired_changes
    }: AnalyzeSunoOutputInputV1) => {
      const prompt = `You are a Suno AI output analyst. Analyze this generation result and suggest improvements.

ORIGINAL PROMPT:
${original_prompt}

WHAT SUNO GENERATED:
${output_description}

${what_worked && what_worked.length > 0 ? `WHAT WORKED:\n${what_worked.map(w => `- ${w}`).join('\n')}` : ''}
${what_didnt_work && what_didnt_work.length > 0 ? `WHAT DID NOT WORK:\n${what_didnt_work.map(w => `- ${w}`).join('\n')}` : ''}
${desired_changes ? `DESIRED CHANGES: ${desired_changes}` : ''}

Analyze and provide:

1. **What Happened**: Identify successful and problematic elements
2. **Why It Happened**: Likely causes based on Suno's behavior patterns
3. **Iteration Strategy**: What to keep, modify, remove, and add
4. **Specific Changes**: Concrete prompt modifications with clear rationale
5. **Experimentation Ideas**: Alternative approaches to try
6. **Learning**: What this teaches about working with Suno

Common Suno Behaviors:
- Certain tags have strong influence on genre/sound
- Structure markers guide arrangement but are not always followed exactly
- Tag combinations can interact in unexpected ways
- Length and complexity affect generation quality
- Sometimes less is more (fewer tags = more focused result)

FORMAT YOUR RESPONSE AS JSON:
{
  "analysis": {
    "successful_elements": ["What worked well"],
    "problematic_elements": ["What did not work"],
    "likely_causes": ["Why these things happened"]
  },
  "iteration_strategy": {
    "keep": ["Elements to preserve"],
    "modify": ["Elements to adjust"],
    "remove": ["Elements to remove"],
    "add": ["Elements to add"]
  },
  "revised_prompt_suggestions": [
    {
      "change": "Specific prompt change",
      "rationale": "Why this change",
      "expected_impact": "What this should achieve"
    }
  ],
  "experimentation_ideas": ["Alternative approach 1", "Alternative approach 2"],
  "generation_insights": "What we learned about Suno from this generation"
}

Help improve the next iteration based on this result.`;

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
          analysis: {
            successful_elements: what_worked || [],
            problematic_elements: what_didnt_work || [],
            likely_causes: ['AI response could not be fully parsed']
          },
          iteration_strategy: {
            keep: ['Elements that worked well'],
            modify: ['Elements that need adjustment'],
            remove: ['Elements that did not work'],
            add: ['New elements to try']
          },
          revised_prompt_suggestions: [{
            change: 'See full response for suggestions',
            rationale: 'Response parsing failed',
            expected_impact: 'Review manually'
          }],
          experimentation_ideas: [],
          generation_insights: responseText
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# Suno Output Analysis\n\n` +
                `## What Happened\n\n` +
                `**Successful**: ${result.analysis.successful_elements.join(', ')}\n\n` +
                `**Problematic**: ${result.analysis.problematic_elements.join(', ')}\n\n` +
                `**Likely Causes**: ${result.analysis.likely_causes.join('; ')}\n\n` +
                `## Iteration Strategy\n\n` +
                `**Keep**: ${result.iteration_strategy.keep.join(', ')}\n\n` +
                `**Modify**: ${result.iteration_strategy.modify.join(', ')}\n\n` +
                `**Remove**: ${result.iteration_strategy.remove.join(', ')}\n\n` +
                `**Add**: ${result.iteration_strategy.add.join(', ')}\n\n` +
                `## Suggested Changes\n\n${result.revised_prompt_suggestions.map((s: any) => 
                  `**Change**: ${s.change}\n**Why**: ${s.rationale}\n**Expected Impact**: ${s.expected_impact}\n`
                ).join('\n')}\n\n` +
                `## Experimentation Ideas\n${result.experimentation_ideas.map((e: string) => `- ${e}`).join('\n')}\n\n` +
                `## What We Learned\n${result.generation_insights}`
        }],
        structuredContent: result
      };
    }
  );
}
