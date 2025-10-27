# Conversation Mining Enhancement Plan

## Current Tool: `conversation_miner`
**Status**: Working, but generic for any conversation text

**Current capabilities**:
- Extract emotional moments, story fragments, unique phrases
- Identify relationship dynamics and universal themes
- Privacy filtering (anonymize, generalize, preserve essence)
- Creative angle selection (literal, metaphorical, thematic, emotional core)

**Limitations for AI chat sessions**:
- Doesn't parse chat format (User: / Assistant:)
- No multi-turn context tracking
- Doesn't identify iterative refinement patterns
- Can't extract "version evolution" from conversation
- No recognition of AI brainstorming vs final decisions

## Proposed Enhancement: `ai_chat_session_analyzer`

### New Tool Contract (SDD)

**Purpose**: Parse entire ChatGPT/Claude/Gemini conversations about songwriting to extract insights, track evolution, and identify final decisions vs explorations.

**Input Schema**:
```typescript
{
  chat_export: z.string().describe('Full chat transcript (copy-paste from ChatGPT/Claude/Gemini)'),
  chat_format: z.enum(['chatgpt', 'claude', 'gemini', 'auto-detect']).default('auto-detect'),
  analysis_focus: z.enum(['final_lyrics', 'creative_decisions', 'iteration_patterns', 'all']).default('all'),
  extract_versions: z.boolean().default(true).describe('Automatically extract different lyric versions'),
  identify_consensus: z.boolean().default(true).describe('Find what you and AI agreed was best')
}
```

**Output Schema**:
```typescript
{
  conversation_summary: {
    total_turns: number,
    song_topic: string,
    evolution_arc: string // "Started with X, evolved to Y, finalized Z"
  },
  extracted_versions: Array<{
    version_number: number,
    timestamp_estimate: string, // "Early in conversation" / "Midpoint" / "Final"
    lyrics: string,
    context: string, // What led to this version
    user_reaction: string, // Your feedback on this version
    changes_from_previous: string[]
  }>,
  creative_decisions: Array<{
    decision: string, // "Changed chorus from X to Y"
    reasoning: string,
    your_input: string,
    ai_suggestion: string,
    consensus: 'user_led' | 'ai_led' | 'collaborative'
  }>,
  iteration_patterns: {
    what_you_refined_most: string[],
    ai_strengths_shown: string[],
    your_creative_direction: string,
    collaboration_style: string
  },
  final_state: {
    best_version: string, // Full lyrics
    remaining_uncertainties: string[], // Things you were still unsure about
    next_steps_mentioned: string[]
  },
  reusable_insights: Array<{
    insight: string,
    apply_to: string // "Future songs with similar mood"
  }>
}
```

### Key Capabilities

1. **Multi-Turn Parsing**: Understands "User:" and "Assistant:" roles
2. **Version Extraction**: Automatically identifies different lyric iterations
3. **Decision Tracking**: What changed and why
4. **Consensus Detection**: What you liked vs dismissed
5. **Pattern Recognition**: Your creative preferences over multiple sessions
6. **Export Ready**: Format for `evolution_tracker` and database storage

### Usage Example

```
Use ai_chat_session_analyzer:

[Paste entire ChatGPT conversation about your song]

Extract all versions and identify my creative direction.
```

**Returns**:
- Version 1, 2, 3 automatically extracted
- Your feedback on each: "loved the chorus", "verse needs work"
- Final consensus version
- What you care about most (rhythm? imagery? emotion?)
- Ready to feed into `evolution_tracker` or `refine_lyrics`

## Implementation Priority

**Phase 2 Tool** - Builds on existing `conversation_miner` pattern

**Why separate tool vs expanding current?**
- SDD principle: New contract, new tool
- `conversation_miner` stays generic (any conversation)
- `ai_chat_session_analyzer` specialized for AI songwriting chats
- Can coexist and cross-reference

**Development time**: ~2 hours
- Input: Copy-paste raw chat exports
- Processing: AI parses roles, extracts versions, identifies patterns
- Output: Structured analysis + extracted lyric versions

## Integration with Existing Tools

**Feeds into**:
- `evolution_tracker` - Auto-provides version history
- `refine_lyrics` - Uses consensus version + your stated preferences
- `devils_advocate` - Knows what you already considered and rejected
- `songwriting_council` - Aware of your collaboration style

**Uses**:
- `conversation_miner` - For deep emotional moment extraction
- `emotional_journey_mapper` - For each extracted version

## Next Steps

1. ✅ Document contract (this file)
2. ⏳ Get user approval for approach
3. ⏳ Implement in new `src/tools/collaboration.ts` file
4. ⏳ Add to Phase 2 roadmap
5. ⏳ Create example with real ChatGPT export

**User decision needed**: 
- Proceed with `ai_chat_session_analyzer` as separate tool? 
- Or expand `conversation_miner` to detect chat format?
- Or wait until Phase 2 with database storage?
