# Metamorphic Mixtape - Gemini AI Instructions

## What You're Working On
You're assisting with **Metamorphic Mixtape**, an AI songwriting platform delivered as a VS Code extension. This project combines a powerful MCP (Model Context Protocol) server with 17 AI-powered songwriting tools accessible directly within VS Code.

## Current Project State
**Phase**: Designing VS Code Extension Architecture  
**Status**: Planning extension integration patterns  
**Methodology**: Seam-Driven Development (SDD) - contracts before code  

## Tech Stack
```
Extension: VS Code Extension API (TypeScript)
MCP:       17 AI tools via stdio transport (native VS Code MCP support)
AI:        Claude via GitHub Copilot (no API key needed)
UI:        WebView API for rich tool result visualization
Storage:   VS Code workspace for lyric files, extension state
```

## Project Structure
```
src/
├── index.ts              # MCP server entry point (stdio transport)
├── tools/                # 17 AI-powered songwriting tools
│   ├── meta.ts          # Pattern analysis, constraint generation
│   ├── analysis.ts      # Emotional archaeology, evolution tracking
│   ├── songwriting.ts   # Lyric generation, refinement
│   └── suno.ts          # Suno AI formatting and optimization
└── utils/
    └── logger.ts         # Logging utilities

vscode-extension/        # [PLANNED] VS Code extension
├── src/
│   ├── extension.ts     # Extension activation and command registration
│   ├── commands/        # Command handlers for 17 MCP tools
│   ├── webview/         # WebView panels for tool results
│   └── mcp/             # MCP client integration
└── package.json         # Extension manifest

.claudefiles/plans/
└── [Future architecture docs for VS Code extension]
```

## The 17 MCP Songwriting Tools
These are the core AI tools users will interact with via the web app:

**Meta-Analytical Tools** (4 tools)
- `extract_song_dna` - Pattern recognition in successful songs
- `constraint_generator` - Creative limitation generation for innovation
- `semantic_bridging` - Unexpected concept connection discovery
- `song_ecosystem_builder` - Interconnected song universe creation

**Analysis Tools** (4 tools)
- `emotional_archaeology` - Digital life mining for song themes
- `evolution_tracker` - Creative pattern tracking and growth analysis
- `conversation_miner` - Extract song concepts from communications
- `emotional_journey_mapper` - Emotional arc plotting and optimization

**Songwriting Tools** (5 tools)
- `generate_lyrics` - AI-powered lyric creation from concepts
- `refine_lyrics` - Intelligent lyric improvement and optimization
- `songwriting_council` - Multi-persona collaborative songwriting
- `devils_advocate` - Critical analysis and deeper exploration
- `lyric_structure_analyzer` - Analyze song structure and patterns

**Suno Tools** (4 tools)
- `format_for_suno` - Convert lyrics to Suno-ready format
- `generate_suno_tags` - Intelligent genre/style tag generation
- `optimize_suno_prompt` - Prompt engineering for Suno AI
- `analyze_suno_output` - Post-generation analysis and iteration

## Seam-Driven Development (SDD) Principles
This project follows **contract-first development**. Before writing any implementation code, you must:

1. **Define contracts** (Zod schemas for inputs, outputs, errors)
2. **Validate contracts** (ensure completeness, clarity, examples)
3. **Document in SEAMS.md** (explain what, why, how for each seam)
4. **Generate implementation** (code follows contract exactly)
5. **Apply Two-Strike Rule** (fix once, fix twice, regenerate on third failure)

**Every file must have a header:**
```typescript
/**
 * FILE: src/backend/auth/jwt.ts
 * 
 * WHAT: JWT token generation and verification utilities.
 * 
 * WHY: Angular frontend needs stateless authentication. JWT tokens allow
 * the backend to verify user identity without session storage.
 * 
 * HOW:
 * 1. generateToken() creates signed JWT with userId payload, 24hr expiry
 * 2. verifyToken() validates signature and expiration
 * 3. Uses HS256 algorithm with JWT_SECRET from environment
 * 
 * SEAMS:
 * - Input: userId (string) → JWT token (string)
 * - Input: JWT token (string) → userId (string) or null
 * 
 * CONTRACT: See contracts/auth.service.contract.ts
 * VERSION: 1.0
 * LAST MODIFIED: 2025-10-27
 * REGENERATION COUNT: 0
 */
```

## Architecture Overview

### User Journey
1. User opens VS Code with Metamorphic Mixtape extension installed
2. User opens Command Palette (Ctrl+Shift+P)
3. User types "Metamorphic:" → sees all 17 MCP tools
4. User selects "Metamorphic: Generate Lyrics"
5. WebView panel opens with tool-specific input form
6. User fills parameters → clicks "Generate"
7. Extension calls MCP tool via native stdio transport
8. AI-generated result appears in WebView with markdown rendering
9. User clicks "Save to Workspace" → lyrics saved as .txt file
10. User can access saved lyrics in workspace explorer

### Data Flow
```
VS Code Command
  → Extension Command Handler
    → Open WebView Panel (tool-specific form)
      → User submits form
        → MCP Client (stdio transport)
          → MCP Server (src/index.ts)
            → Tool Handler (src/tools/*.ts)
              → Claude AI via MCP SDK
                → AI-generated result
              ← Structured output
            ← Tool result
          ← MCP response
        ← Display in WebView
      ← Optional: Save to workspace file
```

### Key Architectural Seams
Future planning needed. Key seams will be:

1. **Command Seams**: VS Code commands for each of 17 tools
2. **WebView Seams**: Communication between extension and WebView UI
3. **MCP Client Seam**: Extension → MCP server via stdio
4. **Workspace Seams**: File creation/updates for saved lyrics
5. **Extension State**: Settings and history (VS Code storage API)

## Current Phase: Architecture Planning
**Goal**: Design VS Code extension architecture and integration patterns.

**What to plan**:
- [ ] Extension manifest (package.json) structure
- [ ] Command registration strategy for 17 tools
- [ ] WebView panel design for tool inputs/outputs
- [ ] MCP client integration via stdio transport
- [ ] Workspace file management for saved lyrics
- [ ] Extension settings and state management

**What NOT to do yet**:
- ❌ Don't scaffold extension (need architecture first)
- ❌ Don't modify existing MCP tools
- ❌ Don't worry about publishing to marketplace yet

## How to Help
When asked to work on this project:

1. **Understand existing MCP tools**: The 17 tools in `src/tools/` are stable and working
2. **Plan extension architecture**: Think through VS Code extension patterns
3. **Follow SDD**: Contract → Validate → Implement → Test → Regenerate (if needed)
4. **Document decisions**: Create architecture docs as planning progresses
5. **File headers required**: Every file needs WHAT/WHY/HOW/SEAMS/CONTRACT/VERSION/REGEN_COUNT

## Common Questions

**Q: Where do the existing 17 MCP tools live?**  
A: `src/tools/*.ts` - These are already built and working via stdio transport. We're NOT changing them, just adding VS Code extension wrapper.

**Q: Why Zod schemas for everything?**  
A: Contracts are the source of truth. If a contract is correct, implementation is mechanical. Zod provides runtime validation + TypeScript types.

**Q: What's the Two-Strike Rule?**  
A: Fix code once, fix twice, on third failure DELETE and regenerate from contract. If regeneration fails, the contract needs updating (not the code).

**Q: Why VS Code extension instead of web app?**  
A: Native integration with user's existing workflow, leverages VS Code's MCP support, no authentication/hosting needed, local-first approach.

**Q: How does the extension communicate with MCP server?**  
A: Via VS Code's native MCP support using stdio transport (same as current GitHub Copilot integration).

**Q: Where is the extension installed?**  
A: Locally in VS Code (future: VS Code marketplace for distribution).

**Q: What AI model powers the MCP tools?**  
A: Claude via GitHub Copilot (via MCP SDK's `server.createMessage()` calls). All 17 tools use AI-powered analysis, not hardcoded rules.

## Important Files to Reference

- **Existing Tools**: `src/tools/*.ts` (the 17 AI tools we're exposing via VS Code extension)
- **MCP Server**: `src/index.ts` (MCP server entry point with stdio transport)
- **Copilot Instructions**: `.github/copilot-instructions.md` (GitHub Copilot context)
- **Future Architecture Docs**: Will be created in `.claudefiles/plans/` as extension design progresses

## Your Role
You're the **implementation architect**. The user provides requirements, you:
1. Identify seams proactively
2. Write bulletproof contracts
3. Generate defensive code
4. Track regenerations
5. Escalate to contract updates when needed

Think like a senior full-stack engineer who knows Angular, Node.js, PostgreSQL, and AI-first design patterns.

---

**Last Updated**: 2025-10-28  
**Project Status**: Architecture Planning - Designing VS Code extension integration  
**Next Action**: Plan extension architecture and command structure
