# Suno MCP Server - Copilot Instructions

## Project Overview
This is an **AI-first** MCP (Model Context Protocol) server designed for professional songwriting workflows with Suno AI. The server prioritizes **intelligent AI analysis** over rule-based heuristics, providing meta-analytical tools, creative constraint generation, and deep pattern recognition.

## Core Philosophy
- **AI-Powered Analysis**: All tools leverage AI for insights, not hardcoded rules
- **Rich Context**: Tools pass comprehensive context to enable sophisticated AI responses
- **Structured Intelligence**: Data formats optimized for AI comprehension and processing
- **Creative Amplification**: Tools designed to enhance human creativity, not replace it
- **Iterative Evolution**: Version tracking and pattern learning across creative sessions
- **Seam-Driven Development**: All interactions are explicit seams with versioned contracts; contracts precede code; regenerate on third failure

## Architecture Principles

### Tool Design
1. **Input Schemas**: Use Zod for type-safe, descriptive parameter definitions
2. **Context Richness**: Pass maximum relevant context to AI for informed decisions
3. **Structured Output**: Return both human-readable text and structured data
4. **LLM Sampling**: Leverage `server.server.createMessage()` for AI-powered analysis
5. **Error Handling**: Graceful degradation with meaningful error messages

### Code Standards
- **TypeScript Strict Mode**: All code must pass strict type checking
- **ESM Modules**: Use ES6 module syntax throughout
- **Async/Await**: Prefer async/await over promises or callbacks
- **Descriptive Naming**: Tool names should be self-documenting
- **Comments**: Document AI prompting strategies and expected behaviors
- **SOLID Principles**: 
  - Single Responsibility: Each tool does one thing well
  - Open/Closed: Extend via new tools, not modifying existing ones
  - Liskov Substitution: Tool versions must maintain contract compatibility
  - Interface Segregation: Minimal, focused input/output schemas
  - Dependency Inversion: Depend on AI abstractions, not specific implementations
- **DRY (Don't Repeat Yourself)**: 
  - Extract common AI prompting patterns into shared utilities
  - Reuse schema definitions where appropriate
  - Avoid duplicating tool logic across similar tools
- **Seam-First Design**: 
  - Define tool contracts (input/output schemas) before implementation
  - Every MCP tool is a seam with explicit Zod schema contract
  - Version contracts on breaking changes (tool.v2 pattern)
  - Two-strike rule: After 2 fixes, delete and regenerate from contract
  - Contracts are self-documenting (human-readable descriptions)

## Tool Categories

### 1. Meta-Analytical Tools (`src/tools/meta.ts`)
Tools that analyze patterns, generate constraints, and build creative ecosystems:
- `extract_song_dna`: Pattern recognition in successful songs
- `constraint_generator`: Creative limitation generation for innovation
- `semantic_bridging`: Unexpected concept connection discovery
- `song_ecosystem_builder`: Interconnected song universe creation

### 2. Analysis Tools (`src/tools/analysis.ts`)
Deep analytical capabilities for lyrics, patterns, and evolution:
- `emotional_archaeology`: Digital life mining for song themes
- `evolution_tracker`: Creative pattern tracking and growth analysis
- `conversation_miner`: Extract song concepts from communications
- `emotional_journey_mapper`: Emotional arc plotting and optimization

### 3. Songwriting Tools (`src/tools/songwriting.ts`)
Core creative tools for lyric generation and refinement:
- `generate_lyrics`: AI-powered lyric creation from concepts
- `refine_lyrics`: Intelligent lyric improvement and optimization
- `songwriting_council`: Multi-persona collaborative songwriting
- `devils_advocate`: Critical analysis and deeper exploration

### 4. Suno Tools (`src/tools/suno.ts`)
Suno-specific formatting and optimization:
- `format_for_suno`: Convert lyrics to Suno-ready format
- `generate_suno_tags`: Intelligent genre/style tag generation
- `optimize_suno_prompt`: Prompt engineering for Suno AI
- `analyze_suno_output`: Post-generation analysis and iteration

## Development Workflow

### Seam-Driven Tool Development
**Every MCP tool follows this flow:**

1. **Define Contract First** (before any code)
   - Input schema (Zod): What parameters the tool accepts
   - Output schema (Zod): What structure it returns
   - Description: Human-readable purpose and behavior
   - Example: At least one working example

2. **Validate Contract**
   - Schema compiles and validates
   - Example can be executed
   - Descriptions are clear

3. **Generate Implementation**
   - Tool handler implements the contract
   - AI prompting strategy documented
   - Error handling included

4. **Test & Iterate**
   - First failure: Fix manually
   - Second failure: Fix manually
   - Third failure: **Delete and regenerate** from contract
   - If still failing: **Update contract**, not code

5. **Version on Breaking Changes**
   - Contract changes that break existing usage → new version
   - Old version can remain for compatibility
   - Document migration path

### Adding New Tools
1. **Conceptualize**: Define the AI-powered insight the tool provides
2. **Schema Design**: Create rich Zod schemas with detailed descriptions
3. **Prompt Engineering**: Craft prompts that guide AI to optimal responses
4. **Implementation**: Use `server.registerTool()` with proper typing
5. **Testing**: Verify structured output and AI response quality
6. **Documentation**: Update README and this file with tool details

### Modifying Existing Tools
1. **Preserve Intent**: Maintain the AI-first philosophy
2. **Enhance Context**: Add parameters that improve AI understanding
3. **Structured Output**: Keep output schemas backward-compatible
4. **Version Notes**: Document changes in CHANGELOG.md
5. **Learn**: Record insights in LESSONS_LEARNED.md

### AI Prompt Design Best Practices
- **Clarity**: Be explicit about what analysis is needed
- **Context**: Provide all relevant information upfront
- **Structure**: Request specific format for responses
- **Examples**: Include examples when helpful for AI understanding
- **Constraints**: Set boundaries (token limits, focus areas)
- **Quality**: Ask for depth, creativity, and actionable insights

## File Organization
```
src/
├── index.ts              # Server entry point, transport setup
├── tools/
│   ├── meta.ts          # Meta-analytical tools
│   ├── analysis.ts      # Deep analysis tools
│   ├── songwriting.ts   # Core creative tools
│   └── suno.ts          # Suno-specific tools
└── types/               # Shared types (future)

.claudefiles/             # AI-GENERATED FILES GO HERE
├── examples/             # Generated song examples, use cases
├── templates/            # Song templates, prompt templates
├── outputs/              # Tool execution outputs, analysis results
├── plans/                # Project plans, roadmaps, feature designs
├── ideas/                # Brainstorming, concepts, suggestions
└── scratch/              # Temporary/experimental files
```

**IMPORTANT - AI ASSISTANT FILE GENERATION RULE:**
When generating example files, output files, templates, or any AI-created content files (NOT source code), always place them in the `.claudefiles/` directory structure:
- `.claudefiles/examples/` - Example songs, lyrics, use cases, demos
- `.claudefiles/templates/` - Song templates, prompt templates, format guides
- `.claudefiles/outputs/` - Tool execution outputs, analysis results, reports
- `.claudefiles/plans/` - Project plans, roadmaps, feature designs, implementation strategies
- `.claudefiles/ideas/` - Brainstorms, concepts, suggestions, explorations
- `.claudefiles/scratch/` - Experimental or temporary files

This keeps AI-generated content separate from project source code and makes it easy to:
- Find all generated examples, plans, and ideas
- Clean up temporary files
- Share examples without cluttering the repo
- Track project evolution through saved plans
- Gitignore if needed (add `.claudefiles/scratch/` to .gitignore)

## Integration Points

### VS Code Integration
- Accessed through GitHub Copilot Chat via MCP
- Tools appear as available functions
- Structured output for easy parsing
- File-based workflows supported

### Claude Desktop Integration
- stdio transport for direct communication
- Same tools, different interface
- Conversation-based workflow
- Rich context passing

## Common Patterns

### Tool Registration Pattern
```typescript
server.registerTool(
  'tool_name',
  {
    title: 'Human-Readable Title',
    description: 'Clear description of what this tool does',
    inputSchema: {
      param1: z.string().describe('Detailed parameter description'),
      param2: z.enum(['option1', 'option2']).default('option1')
    },
    outputSchema: {
      result: z.string(),
      structured_data: z.object({ /* ... */ })
    }
  },
  async ({ param1, param2 }) => {
    // AI prompting logic
    const response = await server.server.createMessage({ /* ... */ });
    
    // Structure output
    return {
      content: [{ type: 'text', text: formattedText }],
      structuredContent: structuredData
    };
  }
);
```

### AI Prompting Pattern
```typescript
const prompt = `Task description with clear instructions:

User Input:
${userProvidedData}

Parameters:
- Setting 1: ${param1}
- Setting 2: ${param2}

Analyze and provide:
1. Specific insight type 1
2. Specific insight type 2
3. Actionable recommendations

Focus on ${focus_area} with ${depth_level} depth.`;

const response = await server.server.createMessage({
  messages: [{ role: 'user', content: { type: 'text', text: prompt }}],
  maxTokens: 1200
});
```

## Key Learnings
- AI-powered tools are more flexible than rule-based ones
- Rich context leads to better AI responses
- Structured output enables downstream processing
- Meta-analysis tools unlock unique creative insights
- Iteration tracking reveals growth patterns

---

**Remember**: This is an AI-first creative tool. Every decision should prioritize intelligent analysis over fixed rules. The goal is to amplify human creativity through sophisticated AI assistance.