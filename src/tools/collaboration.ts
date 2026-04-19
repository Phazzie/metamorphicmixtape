import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';

/**
 * Collaboration Tools for Songwriting
 * 
 * Tools for analyzing AI chat sessions and extracting songwriting insights
 * from conversations with ChatGPT, Claude, Gemini, etc.
 */

export async function registerCollaborationTools(server: McpServer) {

  // 🤖 AI Chat Session Analyzer - Parse ChatGPT/Claude exports
  server.registerTool(
    'ai_chat_session_analyzer',
    {
      title: 'AI Chat Session Analyzer',
      description: 'Parse ChatGPT, Claude, or Gemini conversation exports to extract lyric versions, creative decisions, and collaboration patterns',
      inputSchema: {
        chat_export: z.string().describe('Full chat transcript (copy-paste from ChatGPT/Claude/Gemini export or conversation)'),
        chat_format: z.enum(['chatgpt', 'claude', 'gemini', 'generic', 'auto-detect']).default('auto-detect').describe('Format of the chat export'),
        analysis_focus: z.enum(['lyric_versions', 'creative_decisions', 'iteration_patterns', 'consensus_items', 'all']).default('all').describe('What aspects to focus analysis on'),
        extract_versions: z.boolean().default(true).describe('Automatically extract different lyric versions from conversation'),
        identify_consensus: z.boolean().default(true).describe('Find what you and AI agreed was best'),
        track_evolution: z.boolean().default(true).describe('Track how ideas evolved through the conversation')
      },
      outputSchema: {
        conversation_summary: z.object({
          total_turns: z.number(),
          user_messages: z.number(),
          assistant_messages: z.number(),
          song_topic: z.string(),
          evolution_arc: z.string(),
          conversation_length: z.string()
        }),
        extracted_versions: z.array(z.object({
          version_number: z.number(),
          position_in_chat: z.string(),
          lyrics: z.string(),
          context: z.string(),
          user_reaction: z.string(),
          changes_from_previous: z.array(z.string())
        })),
        creative_decisions: z.array(z.object({
          decision: z.string(),
          reasoning: z.string(),
          your_input: z.string(),
          ai_suggestion: z.string(),
          consensus: z.enum(['user_led', 'ai_led', 'collaborative'])
        })),
        iteration_patterns: z.object({
          what_you_refined_most: z.array(z.string()),
          ai_strengths_shown: z.array(z.string()),
          your_creative_direction: z.string(),
          collaboration_style: z.string()
        }),
        final_state: z.object({
          best_version: z.string(),
          remaining_uncertainties: z.array(z.string()),
          next_steps_mentioned: z.array(z.string())
        }),
        reusable_insights: z.array(z.object({
          insight: z.string(),
          apply_to: z.string()
        })),
        export_for_evolution_tracker: z.array(z.object({
          version: z.string(),
          timestamp: z.string(),
          lyrics: z.string(),
          notes: z.string()
        }))
      }
    },
    async ({ chat_export, chat_format, analysis_focus, extract_versions, identify_consensus, track_evolution }) => {
      const analysisPrompt = `Analyze this AI chat session about songwriting:

CHAT EXPORT:
${chat_export}

ANALYSIS PARAMETERS:
- Chat Format: ${chat_format} (detect format from User:/Assistant:/Human:/etc. patterns)
- Focus: ${analysis_focus}
- Extract Versions: ${extract_versions}
- Identify Consensus: ${identify_consensus}
- Track Evolution: ${track_evolution}

TASKS:
1. Parse the conversation structure (identify user vs AI messages)
2. Extract any lyric versions that appear in the conversation
3. Track creative decisions made (what changed, why, whose idea)
4. Identify consensus points (what the user liked/approved)
5. Analyze iteration patterns (what was refined repeatedly)
6. Determine final state (best version, remaining questions)
7. Extract reusable insights about the user's creative preferences

FORMAT YOUR RESPONSE AS JSON:
{
  "conversation_summary": {
    "total_turns": 10,
    "user_messages": 5,
    "assistant_messages": 5,
    "song_topic": "topic of the song being discussed",
    "evolution_arc": "how the song evolved",
    "conversation_length": "short/medium/long description"
  },
  "extracted_versions": [
    {
      "version_number": 1,
      "position_in_chat": "where in conversation",
      "lyrics": "actual lyrics extracted",
      "context": "what was being discussed",
      "user_reaction": "how user responded",
      "changes_from_previous": ["change 1", "change 2"]
    }
  ],
  "creative_decisions": [
    {
      "decision": "what was decided",
      "reasoning": "why",
      "your_input": "user's contribution",
      "ai_suggestion": "AI's contribution",
      "consensus": "user_led|ai_led|collaborative"
    }
  ],
  "iteration_patterns": {
    "what_you_refined_most": ["area 1", "area 2"],
    "ai_strengths_shown": ["strength 1", "strength 2"],
    "your_creative_direction": "overall direction",
    "collaboration_style": "how they worked together"
  },
  "final_state": {
    "best_version": "final/best lyrics",
    "remaining_uncertainties": ["uncertainty 1"],
    "next_steps_mentioned": ["next step 1"]
  },
  "reusable_insights": [
    {"insight": "insight about user's preferences", "apply_to": "how to apply in future"}
  ],
  "export_for_evolution_tracker": [
    {"version": "v1", "timestamp": "position", "lyrics": "lyrics", "notes": "notes"}
  ]
}

Extract ACTUAL lyrics and content from the chat. Be thorough.`;

      const response = await server.server.createMessage({
        messages: [{
          role: 'user',
          content: { type: 'text', text: analysisPrompt }
        }],
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
          conversation_summary: {
            total_turns: 0,
            user_messages: 0,
            assistant_messages: 0,
            song_topic: 'Analysis failed - see raw output',
            evolution_arc: responseText || 'Chat analysis failed',
            conversation_length: 'Unknown'
          },
          extracted_versions: [],
          creative_decisions: [],
          iteration_patterns: {
            what_you_refined_most: [],
            ai_strengths_shown: [],
            your_creative_direction: 'See analysis above',
            collaboration_style: 'Unknown'
          },
          final_state: {
            best_version: 'Could not extract',
            remaining_uncertainties: [],
            next_steps_mentioned: []
          },
          reusable_insights: [],
          export_for_evolution_tracker: []
        };
      }

      return {
        content: [{
          type: 'text',
          text: `# AI Chat Session Analysis\n\n` +
            `## Conversation Summary\n` +
            `- **Topic**: ${result.conversation_summary.song_topic}\n` +
            `- **Total Turns**: ${result.conversation_summary.total_turns} (${result.conversation_summary.user_messages} user, ${result.conversation_summary.assistant_messages} AI)\n` +
            `- **Evolution Arc**: ${result.conversation_summary.evolution_arc}\n\n` +
            `## Extracted Versions (${result.extracted_versions.length})\n${result.extracted_versions.map((v: any) =>
              `### Version ${v.version_number} (${v.position_in_chat})\n\`\`\`\n${v.lyrics}\n\`\`\`\n**Context**: ${v.context}\n**User Reaction**: ${v.user_reaction}\n**Changes**: ${v.changes_from_previous.join(', ')}`
            ).join('\n\n')}\n\n` +
            `## Creative Decisions\n${result.creative_decisions.map((d: any) =>
              `### ${d.decision}\n**Reasoning**: ${d.reasoning}\n**Your Input**: ${d.your_input}\n**AI Suggestion**: ${d.ai_suggestion}\n**Led by**: ${d.consensus}`
            ).join('\n\n')}\n\n` +
            `## Iteration Patterns\n` +
            `- **Most Refined**: ${result.iteration_patterns.what_you_refined_most.join(', ')}\n` +
            `- **AI Strengths**: ${result.iteration_patterns.ai_strengths_shown.join(', ')}\n` +
            `- **Your Direction**: ${result.iteration_patterns.your_creative_direction}\n` +
            `- **Collaboration Style**: ${result.iteration_patterns.collaboration_style}\n\n` +
            `## Final State\n**Best Version**:\n\`\`\`\n${result.final_state.best_version}\n\`\`\`\n` +
            `**Remaining Uncertainties**: ${result.final_state.remaining_uncertainties.join(', ')}\n` +
            `**Next Steps**: ${result.final_state.next_steps_mentioned.join(', ')}\n\n` +
            `## Reusable Insights\n${result.reusable_insights.map((i: any) => `- **${i.insight}** → ${i.apply_to}`).join('\n')}\n\n` +
            `## Ready for evolution_tracker\n${result.export_for_evolution_tracker.length} versions formatted and ready.`
        }],
        structuredContent: result
      };
    }
  );

  // 🗂️ Chat Export Helper - Format guide for exports
  server.registerTool(
    'chat_export_helper',
    {
      title: 'Chat Export Helper',
      description: 'Get instructions on how to export conversations from ChatGPT, Claude, or Gemini',
      inputSchema: {
        platform: z.enum(['chatgpt', 'claude', 'gemini', 'all']).default('all').describe('Which platform you need export instructions for')
      },
      outputSchema: {
        instructions: z.array(z.object({
          platform: z.string(),
          method: z.string(),
          steps: z.array(z.string()),
          format_notes: z.string()
        }))
      }
    },
    async ({ platform }) => {
      const instructions = {
        chatgpt: {
          platform: 'ChatGPT',
          method: 'Export via Settings or Manual Copy',
          steps: [
            'Open the conversation you want to export',
            'Option A: Click your profile → Settings → Data Controls → Export Data',
            'Option B: Click conversation title → Share → Copy to clipboard',
            'Option C: Manually select all (Ctrl+A) and copy (Ctrl+C)',
            'Paste into ai_chat_session_analyzer tool'
          ],
          format_notes: 'ChatGPT exports include "You\\n\\n[message]\\n\\nChatGPT\\n\\n[response]" format or JSON'
        },
        claude: {
          platform: 'Claude (claude.ai)',
          method: 'Manual Copy (No bulk export yet)',
          steps: [
            'Open the conversation in Claude',
            'Click the "..." menu on conversation',
            'No official export - manually select all text (Ctrl+A)',
            'Copy (Ctrl+C) the full conversation',
            'Paste into ai_chat_session_analyzer tool'
          ],
          format_notes: 'Claude shows message blocks with your messages and Claude responses clearly separated'
        },
        gemini: {
          platform: 'Google Gemini',
          method: 'Export or Manual Copy',
          steps: [
            'Open the conversation in Gemini',
            'Click "Share & export" or three-dot menu',
            'Select "Export" if available',
            'Alternative: Manually select all (Ctrl+A) and copy',
            'Paste into ai_chat_session_analyzer tool'
          ],
          format_notes: 'Gemini exports with "You:\\n[message]\\n\\nGemini:\\n[response]" format'
        }
      };

      const platformsToShow = platform === 'all' 
        ? ['chatgpt', 'claude', 'gemini'] 
        : [platform];

      const selectedInstructions = platformsToShow.map(p => instructions[p as keyof typeof instructions]);

      const formattedText = selectedInstructions.map(inst => `
## ${inst.platform}

**Method**: ${inst.method}

**Steps**:
${inst.steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}

**Format Notes**: ${inst.format_notes}
`).join('\n---\n');

      return {
        content: [{
          type: 'text',
          text: `# Chat Export Instructions\n${formattedText}\n\n## After Export\n\nOnce you have the conversation text:\n1. Paste it into the \`ai_chat_session_analyzer\` tool\n2. Set \`chat_format\` to the platform (or use 'auto-detect')\n3. The tool will extract all lyric versions and creative decisions automatically`
        }]
      };
    }
  );
}
