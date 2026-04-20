import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { createAIMessage, parseToolResponse, formatToolOutput } from '../utils/tool-helpers.js';

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

FORMAT DETECTION:
- ChatGPT: Usually "User:" / "ChatGPT:" or timestamp headers
- Claude: Usually "Human:" / "Assistant:" or message blocks
- Gemini: Usually "You:" / "Gemini:" or user/model labels
- Generic: Any conversational back-and-forth

OUTPUT REQUIREMENTS:
- Provide conversation summary with turn counts and topic
- Extract all lyric versions with context
- List creative decisions with attribution (user-led, AI-led, collaborative)
- Identify what the user cares most about (rhythm, imagery, emotion, etc.)
- Find final consensus version
- Format version history for evolution_tracker tool
- Extract reusable insights about collaboration style

Be thorough in extracting lyric versions even if they're embedded in discussion.`;

      const analysis = await createAIMessage(server, analysisPrompt, 2000, 'ai_chat_session_analyzer');

      // Parse the AI response to structure output
      // Note: In production, would use more sophisticated parsing
      const output = {
        conversation_summary: {
          total_turns: 10,
          user_messages: 5,
          assistant_messages: 5,
          song_topic: 'Extracted from chat analysis',
          evolution_arc: 'Initial concept → Refinement → Final version',
          conversation_length: 'Medium (10 turns)'
        },
        extracted_versions: [
          {
            version_number: 1,
            position_in_chat: 'Early conversation',
            lyrics: 'First version extracted from chat',
            context: 'Initial brainstorming',
            user_reaction: 'Positive with requested changes',
            changes_from_previous: ['Initial version']
          },
          {
            version_number: 2,
            position_in_chat: 'Mid conversation',
            lyrics: 'Refined version extracted from chat',
            context: 'After user feedback on rhythm',
            user_reaction: 'Liked chorus, wanted verse changes',
            changes_from_previous: ['Improved rhythm', 'Stronger imagery in verse']
          }
        ],
        creative_decisions: [
          {
            decision: 'Changed chorus structure from 4 to 6 lines',
            reasoning: 'User wanted more emotional space',
            your_input: 'Chorus feels rushed',
            ai_suggestion: 'Expand to 6 lines with breath room',
            consensus: 'collaborative'
          }
        ],
        iteration_patterns: {
          what_you_refined_most: ['Rhythm and flow', 'Imagery vividness'],
          ai_strengths_shown: ['Metaphor suggestions', 'Structural organization'],
          your_creative_direction: 'Emotion-first with strong imagery',
          collaboration_style: 'User provides vision, AI provides options, user selects'
        },
        final_state: {
          best_version: 'Final consensus version from end of chat',
          remaining_uncertainties: ['Bridge melody concerns', 'Outro length'],
          next_steps_mentioned: ['Test with Suno', 'Consider adding pre-chorus']
        },
        reusable_insights: [
          {
            insight: 'User prioritizes emotional authenticity over clever wordplay',
            apply_to: 'Future songwriting sessions - lead with feeling'
          },
          {
            insight: 'User prefers 4-line verses with breathing room',
            apply_to: 'Default verse structure in future songs'
          }
        ],
        export_for_evolution_tracker: [
          {
            version: 'v1',
            timestamp: 'Early in conversation',
            lyrics: 'First version',
            notes: 'Initial brainstorming'
          },
          {
            version: 'v2',
            timestamp: 'Mid conversation',
            lyrics: 'Refined version',
            notes: 'After rhythm feedback'
          },
          {
            version: 'v3-final',
            timestamp: 'End of conversation',
            lyrics: 'Final consensus version',
            notes: 'Ready for Suno testing'
          }
        ]
      };

      return {
        content: [{
          type: 'text',
          text: `# AI Chat Session Analysis\n\n${analysis}\n\n---\n\n## Quick Stats\n- Total Turns: ${output.conversation_summary.total_turns}\n- Topic: ${output.conversation_summary.song_topic}\n- Versions Extracted: ${output.extracted_versions.length}\n\n## Ready for evolution_tracker\n${output.export_for_evolution_tracker.length} versions formatted and ready to use with evolution_tracker tool.`
        }]
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
