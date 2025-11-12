# Metamorphic Mixtape - AI Agent Instructions

## Quick Overview
**Project**: AI songwriting platform delivered as VS Code extension  
**Current Task**: Designing VS Code extension architecture to expose 17 existing MCP songwriting tools  
**Methodology**: Seam-Driven Development (contracts before code)  
**Status**: Architecture Planning - Designing extension integration patterns  

## Stack at a Glance
- **Extension**: VS Code Extension API (TypeScript)
- **MCP**: 17 pre-built AI songwriting tools via stdio transport
- **AI**: Claude via GitHub Copilot (no API key needed)
- **UI**: WebView API for rich tool result visualization
- **Storage**: VS Code workspace for lyric files and extension state

## What This Project Does
Users open VS Code → access 17 AI songwriting tools via Command Palette → fill out WebView forms → get AI-generated lyrics/analysis → save to workspace files.

**The 17 Tools** (already built in `src/tools/`):
- Meta tools: extract_song_dna, constraint_generator, semantic_bridging, song_ecosystem_builder
- Analysis tools: emotional_archaeology, evolution_tracker, conversation_miner, emotional_journey_mapper
- Songwriting tools: generate_lyrics, refine_lyrics, songwriting_council, devils_advocate, lyric_structure_analyzer
- Suno tools: format_for_suno, generate_suno_tags, optimize_suno_prompt, analyze_suno_output

## Key Files to Know About
```
src/
├── index.ts        # MCP server entry point (stdio transport)
├── tools/          # 17 existing MCP tools (stable, don't modify)
│   ├── meta.ts
│   ├── analysis.ts
│   ├── songwriting.ts
│   └── suno.ts
└── utils/          # Logger utilities

vscode-extension/   # [PLANNED] VS Code extension
└── (to be designed)

.claudefiles/plans/
└── [Future architecture docs]
```

## Current Phase: Architecture Planning
**What we're doing right now**: Designing VS Code extension architecture:
- Extension manifest (package.json) structure
- Command registration for 17 tools
- WebView panel design for tool UIs
- MCP client integration patterns
- Workspace file management
- Extension settings and state

**Why architecture first?**: Clear architectural patterns make implementation straightforward and prevent rework.

**What NOT to create yet**:
- ❌ Extension scaffolding (need architecture first)
- ❌ Don't modify existing MCP tools
- ❌ Don't worry about marketplace publishing yet

## Seam-Driven Development (SDD) Quick Rules
1. **Contract first**: Write Zod schema before implementation
2. **File headers required**: Every file needs WHAT/WHY/HOW comment block
3. **Two-strike rule**: Fix once, fix twice, on third failure delete and regenerate from contract
4. **Document in SEAMS.md**: Update architecture doc when adding new seams
5. **Validate before coding**: Mentally execute contract with example data

## Architecture in 3 Sentences
VS Code extension registers commands for 17 MCP tools. User invokes command → WebView opens with tool-specific form → extension calls MCP tool via stdio transport. AI-generated results display in WebView, optionally saved to workspace files.

## Common Tasks You Might Be Asked

### "Design extension command structure"
1. List all 17 MCP tools from `src/tools/`
2. Design command naming convention (e.g., `metamorphic.generateLyrics`)
3. Map each tool to VS Code command
4. Document in architecture plan
5. Consider command categories for organization

### "Plan WebView panel design"
1. Review tool input schemas (Zod schemas in tool files)
2. Design WebView UI for dynamic form generation
3. Plan communication protocol (extension ↔ WebView)
4. Consider result visualization options
5. Document in architecture plan

### "Design MCP client integration"
1. Research VS Code's native MCP support
2. Plan stdio transport connection to existing MCP server
3. Design error handling and retry logic
4. Consider concurrency (multiple tools executing)
5. Document in architecture plan

## Decision Framework
**When stuck, ask:**
1. Does a contract exist for this? (If no, we're ahead of ourselves - go to Phase 1)
2. Is the contract complete? (All fields have descriptions, examples, error cases?)
3. Does the implementation match the contract exactly?
4. Have I tracked this in the checklist?

**Red flags:**
- 🚩 Creating implementation without a contract
- 🚩 Fixing the same code 3+ times (should regenerate)
- 🚩 Modifying existing MCP tools in `src/tools/` (these are stable!)
- 🚩 Skipping file headers
- 🚩 Not updating SEAMS.md when architecture changes

## File Header Template
Every implementation file needs this at the top:

```typescript
/**
 * FILE: src/backend/routes/auth.ts
 * 
 * WHAT: Express routes for user authentication (register, login, logout).
 * 
 * WHY: Angular frontend needs secure user authentication to access MCP tools.
 * JWT tokens provide stateless auth that scales on serverless platforms.
 * 
 * HOW:
 * 1. POST /register: Validate input, check email uniqueness, hash password, insert DB, return JWT
 * 2. POST /login: Validate input, query user, verify password, update last_login, return JWT
 * 3. POST /logout: Validate JWT, delete session from DB, return success
 * 
 * SEAMS:
 * - Input: HTTP request body → validated against LoginFormContract/RegisterFormContract
 * - Database: PostgreSQL users table (query/insert)
 * - Output: HTTP response → { user: User, token: string } or { error: AuthError }
 * 
 * CONTRACT: See contracts/api/auth-api.contract.ts
 * VERSION: 1.0
 * LAST MODIFIED: 2025-10-27
 * REGENERATION COUNT: 0
 */
```

## The Two-Strike Rule Explained
1. **Code fails on first run**: Make one targeted fix. Update REGENERATION COUNT to 1.
2. **Fails again (different issue)**: Make one more fix. Update count to 2.
3. **Fails third time**: DELETE the file. Regenerate from scratch using the contract.
4. **Regenerated code still fails**: The contract is wrong. Update the contract (possibly create v2), then regenerate.

This prevents endless debugging of fundamentally flawed implementations.

## Quick Reference Links
- **Existing MCP tools**: `src/tools/meta.ts`, `src/tools/analysis.ts`, `src/tools/songwriting.ts`, `src/tools/suno.ts`
- **MCP Server**: `src/index.ts`
- **Copilot Instructions**: `.github/copilot-instructions.md`
- **Future architecture docs**: Will be created in `.claudefiles/plans/`

## Success Criteria
By the end of this project:
- ✅ VS Code extension installed and activated successfully
- ✅ All 17 MCP tools accessible via Command Palette
- ✅ WebView panels provide rich, interactive tool UIs
- ✅ AI-generated results display beautifully with markdown rendering
- ✅ Generated lyrics save to workspace files seamlessly
- ✅ Extension follows VS Code best practices
- ✅ 100% of code generated from contracts (no manual hacking)
- ✅ 0 regenerations needed (contracts were right the first time)

## When to Ask for Clarification
- "Should this be a new contract or does one exist?"
- "This implementation is failing for the 3rd time - should I update the contract?"
- "Does this change require updating SEAMS.md?"
- "Which phase are we in? I want to make sure I'm working on the right thing."

## Tone & Style
- Be **direct and technical** - we're building production code
- Be **proactive** - identify seams without being asked
- Be **defensive** - validate everything, handle all error cases
- Be **disciplined** - follow SDD methodology strictly
- Be **collaborative** - ask questions when contracts are ambiguous

---

**Remember**: Contracts are king. If the contract is sound, the implementation will be too. When in doubt, update the contract, not the code.

**Status**: Architecture Planning - Designing VS Code extension integration  
**Next Action**: Plan extension manifest and command structure
