# DRY Refactoring Execution Plan - GitHub Copilot Agent Instructions

**Target**: GitHub Copilot Workspace Agent  
**Project**: Metamorphic Mixtape MCP Server  
**Goal**: Eliminate 35-40% code duplication by extracting utilities  
**Estimated Time**: 4-6 hours  
**Status**: READY TO EXECUTE

---

## 🎯 Mission Overview

**WHAT**: Extract 3 utility functions from 18 duplicated tool implementations  
**WHY**: Reduce 283-361 lines of duplicated code, improve maintainability  
**HOW**: Create `tool-helpers.ts`, refactor tools sequentially, test each step

---

## ⚠️ CRITICAL RULES

1. **Test After Each Phase** - Do NOT move to next phase until current phase tests pass
2. **One File at a Time** - Refactor one tool file completely before moving to next
3. **Preserve Output** - Tool outputs MUST remain identical to current behavior
4. **Type Safety** - Use TypeScript strict types, NO `any` types
5. **Git Commits** - Commit after each successful phase with descriptive message

---

## 📋 STEP-BY-STEP EXECUTION

---

### **PHASE 1: Create Utility Module** (30 minutes)

#### Step 1.1: Create `src/utils/tool-helpers.ts`

**WHY**: Centralize duplicated JSON parsing, AI message creation, and formatting logic that appears 17-18 times across all tools.

**WHAT TO DO**:
```typescript
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

/**
 * Parse AI response text for JSON content with typed fallback
 * 
 * WHY: This pattern is duplicated 17 times across all tools. Centralizing it:
 * - Ensures consistent error handling
 * - Makes debugging easier (one place to fix)
 * - Reduces code by ~170-200 lines
 * 
 * @param responseText - Raw text from AI response
 * @param fallback - Fallback object if parsing fails (must match expected type)
 * @returns Parsed JSON or fallback
 */
export function parseToolResponse<T extends object>(
  responseText: string,
  fallback: T
): T {
  try {
    // Try to extract JSON from response (AI often wraps it in text)
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('[Tool Response Parser] No JSON found in response');
      return fallback;
    }
    return JSON.parse(jsonMatch[0]) as T;
  } catch (error) {
    console.error('[Tool Response Parser] JSON parsing failed:', error);
    return fallback;
  }
}

/**
 * Create and send AI message with standard options
 * 
 * WHY: Every tool calls server.server.createMessage() with identical structure.
 * This eliminates 6 lines of boilerplate × 18 tools = ~108 lines saved.
 * 
 * @param server - MCP server instance
 * @param prompt - Prompt text to send to AI
 * @param maxTokens - Optional max tokens (default: 1500)
 * @returns Response text string
 */
export async function createAIMessage(
  server: McpServer,
  prompt: string,
  maxTokens: number = 1500
): Promise<string> {
  const response = await server.server.createMessage({
    messages: [{ role: 'user', content: { type: 'text', text: prompt } }],
    maxTokens
  });

  return response.content.type === 'text' ? response.content.text : '';
}
```

**VERIFICATION**:
- [ ] File created at correct path: `src/utils/tool-helpers.ts`
- [ ] TypeScript compiles without errors: `npm run build`
- [ ] Exports are properly typed
- [ ] No ESLint warnings

**COMMIT MESSAGE**: `feat(utils): add tool-helpers utilities for DRY refactoring`

---

### **PHASE 2: Refactor Songwriting Tools** (1 hour)

**WHY START HERE**: 
- `songwriting.ts` has 4 tools with heavy duplication (112 lines duplicated)
- These are the most-used tools (generate_lyrics, refine_lyrics)
- Success here validates the utility functions work correctly

---

#### Step 2.1: Refactor `generate_lyrics` tool

**CURRENT CODE** (locate this in `src/tools/songwriting.ts`):
```typescript
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
```

**REPLACE WITH**:
```typescript
import { parseToolResponse, createAIMessage } from '../utils/tool-helpers.js';

// ... (in the tool handler)

const responseText = await createAIMessage(server, prompt, 2000);

const result = parseToolResponse(responseText, {
  lyrics: responseText,
  structure: 'Unknown',
  creative_notes: 'AI response could not be fully parsed. See lyrics above.',
  emotional_arc: 'See lyrics for emotional journey.',
  suggested_refinements: ['Review and refine manually based on your vision']
});
```

**WHY THIS CHANGE**:
- Reduces 18 lines to 8 lines (56% reduction)
- Error handling is now consistent with other tools
- Easier to debug (one utility function to check)

**TEST**:
```bash
# Build the project
npm run build

# Test the tool manually (if you have MCP test setup)
# Or just verify TypeScript compiles without errors
```

**VERIFICATION**:
- [ ] Import statement added at top of file
- [ ] Old code completely removed
- [ ] New code uses both utilities
- [ ] TypeScript compiles
- [ ] Fallback object structure matches old version exactly

---

#### Step 2.2: Refactor `refine_lyrics` tool

**REPEAT SAME PATTERN**:
1. Find the `await server.server.createMessage(...)` block
2. Replace with `await createAIMessage(server, prompt, 2000)`
3. Find the `try { const jsonMatch... }` block
4. Replace with `parseToolResponse(responseText, { /* fallback */ })`
5. Ensure fallback object matches original structure

**WHY**: Same benefits as Step 2.1

**VERIFICATION**: Same checklist as Step 2.1

---

#### Step 2.3: Refactor `songwriting_council` tool

**REPEAT SAME PATTERN** - Same as Steps 2.1-2.2

**VERIFICATION**: Same checklist

---

#### Step 2.4: Refactor `devils_advocate` tool

**REPEAT SAME PATTERN** - Same as Steps 2.1-2.2

**VERIFICATION**: Same checklist

---

#### Step 2.5: Test All Songwriting Tools

**WHY**: Ensure refactored tools produce identical output to original versions.

**HOW**:
```bash
# Rebuild
npm run build

# If you have test cases, run them
npm test

# Manual verification:
# 1. Start MCP server: npm start
# 2. Connect via VS Code or Claude Desktop
# 3. Call generate_lyrics with a test prompt
# 4. Verify output matches expected format
```

**VERIFICATION**:
- [ ] All 4 tools compile without errors
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Manual test of at least 1 tool confirms output unchanged

**COMMIT MESSAGE**: `refactor(songwriting): extract utilities to reduce duplication (-112 LOC)`

---

### **PHASE 3: Refactor Suno Tools** (1 hour)

**WHY**: Second-highest duplication (112 lines), validates utilities work across different tool categories.

---

#### Step 3.1: Refactor `format_for_suno` tool

**SAME PATTERN AS PHASE 2**:
1. Add import: `import { parseToolResponse, createAIMessage } from '../utils/tool-helpers.js';`
2. Replace `server.server.createMessage(...)` → `createAIMessage(...)`
3. Replace `try { jsonMatch... }` → `parseToolResponse(...)`

**VERIFICATION**: Same as Phase 2

---

#### Step 3.2: Refactor `generate_suno_tags` tool

**SAME PATTERN** - Repeat Steps 3.1

---

#### Step 3.3: Refactor `optimize_suno_prompt` tool

**SAME PATTERN** - Repeat Steps 3.1

---

#### Step 3.4: Refactor `analyze_suno_output` tool

**SAME PATTERN** - Repeat Steps 3.1

---

#### Step 3.5: Test All Suno Tools

**VERIFICATION**:
- [ ] All 4 tools compile
- [ ] No errors or warnings
- [ ] Manual test confirms output format unchanged

**COMMIT MESSAGE**: `refactor(suno): extract utilities to reduce duplication (-112 LOC)`

---

### **PHASE 4: Refactor Analysis Tools** (45 minutes)

**WHY**: These tools have less duplication (~64 lines) but still benefit from consistency.

---

#### Step 4.1: Refactor `emotional_archaeology` tool

**NOTE**: This tool has slightly different pattern:
- Still uses `server.server.createMessage()`
- Has minimal JSON parsing (mostly returns framework text)
- Focus on `createAIMessage()` utility only

**CHANGE**:
```typescript
// OLD:
const response = await server.server.createMessage({
  messages: [{
    role: 'user',
    content: { type: 'text', text: analysisPrompt }
  }],
  maxTokens: 1200
});
const analysis = response.content.type === 'text' ? response.content.text : 'Analysis framework failed';

// NEW:
const analysis = await createAIMessage(server, analysisPrompt, 1200);
```

**WHY**: Even though JSON parsing isn't used here, consistent message creation is valuable.

---

#### Step 4.2-4.4: Refactor remaining analysis tools

**SAME PATTERN**: Apply to `evolution_tracker`, `conversation_miner`, `emotional_journey_mapper`

**VERIFICATION**: Same checklist

**COMMIT MESSAGE**: `refactor(analysis): extract utilities to reduce duplication (-64 LOC)`

---

### **PHASE 5: Refactor Meta Tools** (45 minutes)

**WHY**: Similar to analysis tools, ~64 lines saved.

---

#### Steps 5.1-5.4: Refactor all 4 meta tools

**TOOLS**:
- `extract_song_dna`
- `constraint_generator`
- `semantic_bridging`
- `song_ecosystem_builder`

**SAME PATTERN**: Apply utilities as in Phases 2-4

**COMMIT MESSAGE**: `refactor(meta): extract utilities to reduce duplication (-64 LOC)`

---

### **PHASE 6: Refactor Collaboration Tools** (30 minutes)

**WHY**: Smallest file, but completes the refactoring.

---

#### Steps 6.1-6.2: Refactor collaboration tools

**TOOLS**:
- `ai_chat_session_analyzer`
- `chat_export_helper` (may not need changes - it's a utility itself)

**SAME PATTERN**: Apply utilities

**COMMIT MESSAGE**: `refactor(collaboration): extract utilities to reduce duplication (-32 LOC)`

---

### **PHASE 7: Final Verification** (30 minutes)

**WHY**: Ensure entire refactoring is successful and production-ready.

---

#### Step 7.1: Run Full Build

```bash
# Clean build
npm run clean
npm run build
```

**VERIFICATION**:
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Build completes successfully

---

#### Step 7.2: Calculate LOC Reduction

**HOW**:
```bash
# Before refactoring (from git history)
git show HEAD~7:src/tools/songwriting.ts | wc -l

# After refactoring (current)
wc -l src/tools/songwriting.ts

# Repeat for all tool files
```

**EXPECTED RESULTS**:
- `songwriting.ts`: ~450 → ~338 lines (-112, 24% reduction)
- `suno.ts`: ~520 → ~408 lines (-112, 21% reduction)
- `analysis.ts`: ~500 → ~436 lines (-64, 13% reduction)
- `meta.ts`: ~480 → ~416 lines (-64, 13% reduction)
- `collaboration.ts`: ~200 → ~168 lines (-32, 16% reduction)
- **TOTAL**: ~2,150 → ~1,766 lines (**~384 lines saved, 18% reduction**)

**VERIFICATION**:
- [ ] Total LOC reduction ≥ 250 lines
- [ ] Reduction percentage ≥ 12%

---

#### Step 7.3: Update Documentation

**FILES TO UPDATE**:

1. **CHANGELOG.md**:
```markdown
## [Unreleased]

### Changed
- **Refactoring**: Extracted common utilities to reduce code duplication
  - Created `src/utils/tool-helpers.ts` with `parseToolResponse()` and `createAIMessage()`
  - Refactored all 18 tools to use shared utilities
  - Reduced total LOC by ~384 lines (18% reduction)
  - Improved consistency in error handling across all tools
  - Improved maintainability (centralized parsing and messaging logic)
```

2. **README.md** (if needed):
```markdown
## Architecture

### Utilities
- `src/utils/logger.ts` - Centralized logging
- `src/utils/tool-helpers.ts` - Shared tool utilities (JSON parsing, AI messaging)
```

**VERIFICATION**:
- [ ] CHANGELOG.md updated
- [ ] README.md updated (if applicable)

---

#### Step 7.4: Final Commit

```bash
git add .
git commit -m "chore(refactor): complete DRY refactoring - reduce duplication from 35% to <10%

- Created tool-helpers.ts with parseToolResponse() and createAIMessage()
- Refactored all 18 tools to use shared utilities
- Reduced codebase by ~384 lines (18% reduction)
- Improved error handling consistency
- All tools tested and verified
- Updated documentation (CHANGELOG.md)"
```

---

## 📊 SUCCESS CRITERIA

**MUST ACHIEVE**:
- [x] All 18 tools refactored
- [x] Total LOC reduced by ≥250 lines
- [x] TypeScript compiles with 0 errors
- [x] No ESLint warnings
- [x] Tool outputs unchanged (verified manually)
- [x] Documentation updated
- [x] All phases committed to git

**QUALITY GATES**:
- [x] No `any` types introduced
- [x] Error handling preserved
- [x] Fallback behavior identical to original
- [x] Type safety maintained/improved

---

## 🚨 TROUBLESHOOTING

### If TypeScript errors appear:

**Problem**: Import path incorrect  
**Solution**: Ensure `import { x } from '../utils/tool-helpers.js'` (note the `.js` extension for ESM)

**Problem**: Type mismatch in `parseToolResponse()`  
**Solution**: Ensure fallback object structure exactly matches original structure

### If tool output changes:

**Problem**: JSON parsing behavior different  
**Solution**: Check that fallback object is identical to original

**Problem**: Missing fields in output  
**Solution**: Verify all fields from original result object are in fallback

### If build fails:

**Problem**: Circular dependency  
**Solution**: Ensure `tool-helpers.ts` doesn't import from tools (only types from SDK)

---

## 📁 FILE MANIFEST

**Files Created**:
- `src/utils/tool-helpers.ts` (+37 lines)

**Files Modified**:
- `src/tools/songwriting.ts` (-112 lines)
- `src/tools/suno.ts` (-112 lines)
- `src/tools/analysis.ts` (-64 lines)
- `src/tools/meta.ts` (-64 lines)
- `src/tools/collaboration.ts` (-32 lines)
- `CHANGELOG.md` (+10 lines)

**Net LOC Change**: -347 lines

---

## ⏱️ TIME TRACKING

| Phase | Estimated | Actual | Status |
|-------|-----------|--------|--------|
| Phase 1: Create Utilities | 30 min | __ min | ⬜ Not Started |
| Phase 2: Songwriting Tools | 1 hour | __ min | ⬜ Not Started |
| Phase 3: Suno Tools | 1 hour | __ min | ⬜ Not Started |
| Phase 4: Analysis Tools | 45 min | __ min | ⬜ Not Started |
| Phase 5: Meta Tools | 45 min | ⬜ Not Started |
| Phase 6: Collaboration Tools | 30 min | __ min | ⬜ Not Started |
| Phase 7: Verification | 30 min | __ min | ⬜ Not Started |
| **TOTAL** | **4.5 hours** | **__ hours** | ⬜ Not Started |

---

## 🎯 EXECUTION COMMAND FOR GITHUB COPILOT AGENT

**GitHub Copilot Workspace Agent**: Execute this plan sequentially, one phase at a time. After each phase:
1. Verify all checkboxes are complete
2. Run `npm run build` to ensure no errors
3. Commit changes with provided commit message
4. Proceed to next phase

**DO NOT SKIP PHASES**. Each phase builds on the previous one.

**WHEN COMPLETE**: Report total LOC reduction, time taken, and any issues encountered.

---

## ✅ COMPLETION CHECKLIST

- [ ] Phase 1: Utilities created and tested
- [ ] Phase 2: Songwriting tools refactored (4 tools)
- [ ] Phase 3: Suno tools refactored (4 tools)
- [ ] Phase 4: Analysis tools refactored (4 tools)
- [ ] Phase 5: Meta tools refactored (4 tools)
- [ ] Phase 6: Collaboration tools refactored (2 tools)
- [ ] Phase 7: Final verification complete
- [ ] Documentation updated
- [ ] All commits pushed to repository
- [ ] Total LOC reduction ≥250 lines confirmed
- [ ] Zero TypeScript errors
- [ ] Zero ESLint warnings
- [ ] Manual tool test passed (at least 1 tool from each category)

**When all checkboxes are complete**: DRY refactoring is DONE ✅
