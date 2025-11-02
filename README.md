# Metamorphic Mixtape (Suno MCP Server)

An **AI-first** MCP (Model Context Protocol) server for professional songwriting workflows with Suno AI. Provides sophisticated AI-powered tools for lyric creation, refinement, and Suno optimization.

## 🎉 What's New in v2.0.0

**Production-ready platform with comprehensive web UI:**
- ✅ **Angular 20 Web UI** with songwriting studio, Suno formatter, and tool browser
- ✅ **HTTP REST API** for integrations and external access
- ✅ **Docker deployment** with CI/CD pipelines
- ✅ **100% seam-driven** with 7 versioned contracts
- ✅ **Zero technical debt** (audited and verified)
- ✅ **Zero security vulnerabilities**

See [CHANGELOG.md](./CHANGELOG.md) for full details.

## Overview

This MCP server integrates with VS Code (via GitHub Copilot) and Claude Desktop to provide 16 specialized songwriting tools across four categories:

- **Meta-Analytical Tools**: Pattern recognition, constraint generation, creative ecosystems
- **Analysis Tools**: Emotional archaeology, evolution tracking, conversation mining
- **Songwriting Tools**: Lyric generation, refinement, multi-persona feedback, critical analysis
- **Suno Tools**: Formatting, tag generation, prompt optimization, output analysis

**Philosophy**: AI-powered intelligence over hardcoded heuristics. Every tool leverages sophisticated AI analysis to amplify human creativity.

## Features

### 🎵 Songwriting Tools
- **generate_lyrics**: Create original lyrics from concepts with emotional depth
- **refine_lyrics**: Intelligent improvement focusing on rhythm, imagery, impact
- **songwriting_council**: Multi-persona feedback (perfectionist, experimentalist, storyteller, etc.)
- **devils_advocate**: Critical analysis to push work deeper

### 🎧 Suno Integration
- **format_for_suno**: Convert lyrics to Suno-ready format with optimal structure
- **generate_suno_tags**: AI-powered genre/style tag generation
- **optimize_suno_prompt**: Complete prompt engineering for best results
- **analyze_suno_output**: Iteration strategy based on generation results

### 🧬 Meta-Analytical
- **extract_song_dna**: Analyze successful songs for creative patterns
- **constraint_generator**: Generate creative constraints that spark innovation
- **semantic_bridging**: Find unexpected connections between concepts
- **song_ecosystem_builder**: Create interconnected song universes

### 📊 Deep Analysis
- **emotional_archaeology**: Mine digital life for authentic song themes
- **evolution_tracker**: Track creative growth and pattern development
- **conversation_miner**: Extract song concepts from communications
- **emotional_journey_mapper**: Map and optimize emotional arcs

## Installation

### Prerequisites
- Node.js 20 or later
- VS Code with GitHub Copilot OR Claude Desktop
- npm or yarn

### Setup

1. **Clone or download this repository**:
```bash
git clone <your-repo-url>
cd sunbomcp
```

2. **Install dependencies**:
```bash
npm install
```

3. **Build the server**:
```bash
npm run build
```

4. **Start the server** (for testing):
```bash
npm start
```

### HTTP Adapter & Web UI

To expose the MCP tools over HTTP and serve the Angular dashboard:

```bash
npm run build
npm run build --prefix web -- --configuration=production
npm run start:http
```

The adapter listens on port `8080` by default. Visit `http://localhost:8080` to open the Angular interface. The following REST endpoints are available:

- `GET /health` – service readiness probe
- `GET /tools` – list of registered tool contracts
- `GET /tools/:name` – detailed contract metadata
- `POST /tools/:name` – invoke a tool with runtime validation

### Docker Image

Build a production container that bundles the HTTP adapter and Angular assets:

```bash
docker build -t metamorphic-mixtape:local .
docker run -p 8080:8080 metamorphic-mixtape:local
```

### DigitalOcean App Platform

Deploy the container to DigitalOcean using the provided spec and deployment helper:

```bash
export DIGITALOCEAN_ACCESS_TOKEN=... # personal access token
./scripts/deploy-digitalocean.sh infra/digitalocean/app-spec.yaml ghcr.io/OWNER/REPO:latest
```

After deployment, validate the seam with the smoke test script:

```bash
node scripts/smoke-test.mjs https://your-app-url
```

## VS Code Integration

### Configure GitHub Copilot for MCP

1. **Create or edit** `~/.copilot/config.json` (or Windows: `%USERPROFILE%\.copilot\config.json`):

```json
{
  "mcpServers": {
    "suno-songwriting": {
      "command": "node",
      "args": ["C:\\path\\to\\sunbomcp\\dist\\index.js"],
      "env": {}
    }
  }
}
```

2. **Restart VS Code**

3. **Open Copilot Chat** and verify tools are available:
```
@workspace /tools
```

You should see all 16 songwriting tools listed.

## Claude Desktop Integration

### Configure Claude Desktop

1. **Edit Claude Desktop config** (`~/Library/Application Support/Claude/claude_desktop_config.json` on Mac, `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "suno-songwriting": {
      "command": "node",
      "args": ["C:\\path\\to\\sunbomcp\\dist\\index.js"]
    }
  }
}
```

2. **Restart Claude Desktop**

3. **Verify in a new conversation**:
```
What songwriting tools do you have available?
```

## Usage Examples

### Generate Lyrics from Concept

```
Use generate_lyrics to create a melancholic indie folk song about 
childhood memories fading. Use water imagery as a constraint.
```

**Output**: Complete lyrics with structure markers, creative notes, emotional arc analysis, and refinement suggestions.

### Refine Existing Lyrics

```
Use refine_lyrics on these lyrics, focusing on rhythm and imagery:

[Your lyrics here]

Keep the structure but make it more vivid. Moderate intensity.
```

**Output**: Improved lyrics with detailed change explanations and further suggestions.

### Get Multi-Persona Feedback

```
Use songwriting_council with perfectionist, experimentalist, and 
storyteller personas to review these lyrics:

[Your lyrics here]
```

**Output**: Distinct perspectives from each persona, consensus points, creative tensions, and synthesis.

### Format for Suno

```
Use format_for_suno to prepare these lyrics for Suno generation:

[Your lyrics here]

Optimize for balanced creativity and clarity.
```

**Output**: Suno-ready formatted lyrics with structure markers and best practices applied.

### Generate Suno Tags

```
Use generate_suno_tags for these lyrics. I want an indie folk sound 
similar to Bon Iver, with prominent acoustic guitar and melancholic mood.

[Your lyrics here]
```

**Output**: Primary and secondary tags, alternatives, usage tips, and tag explanation.

### Analyze Patterns in Favorite Songs

```
Use extract_song_dna to analyze patterns in:
- "Holocene" by Bon Iver
- "Chicago" by Sufjan Stevens  
- "Skinny Love" by Bon Iver

Focus on emotional_arc and metaphor_usage.
```

**Output**: Deep pattern analysis, emotional blueprints, inspiration seeds, and application suggestions.

## Project Structure

```
sunbomcp/
├── src/
│   ├── index.ts              # Server entry point
│   └── tools/
│       ├── meta.ts           # Meta-analytical tools
│       ├── analysis.ts       # Deep analysis tools
│       ├── songwriting.ts    # Core songwriting tools
│       └── suno.ts           # Suno-specific tools
├── dist/                     # Compiled JavaScript (generated)
├── .github/
│   ├── copilot-instructions.md  # AI assistant guide
│   ├── AGENTS.md                # Agent behavior config
│   └── GEMINI.md                # Gemini integration guide
├── .claudefiles/             # AI-generated examples and plans
├── CHANGELOG.md              # Version history
├── LESSONS_LEARNED.md        # Development insights
├── ERROR_LOG.md              # Issue tracking
├── package.json
├── tsconfig.json
└── README.md
```

## Development

### Architecture Principles

This project follows **Seam-Driven Development (SDD)**:
- **Contract-First**: Zod schemas define tool contracts before implementation
- **Versioning**: Breaking changes → new tool versions (e.g., `tool.v2`)
- **Regeneration Rule**: After 2 failed fixes, regenerate from contract
- **Self-Documentation**: Schema descriptions are the documentation

Additional principles:
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **DRY**: Reuse schema definitions, extract common patterns
- **AI-First**: Leverage AI intelligence over hardcoded heuristics
- **Rich Context**: Pass comprehensive context to AI for better results

### Adding New Tools

1. **Define Contract** (Zod schema with detailed descriptions):
```typescript
inputSchema: {
  param: z.string().describe('Detailed description of parameter')
}
```

2. **Implement Handler**:
```typescript
server.registerTool('tool_name', { inputSchema, outputSchema }, async (input) => {
  // AI prompting logic
  const response = await server.server.createMessage({...});
  // Return structured output
});
```

3. **Test**: Run `npm run build` and test via MCP client

4. **Document**: Update CHANGELOG.md and add examples

### Scripts

```bash
npm run build    # Compile TypeScript
npm run dev      # Build and start in dev mode
npm start        # Run compiled server
npm run clean    # Remove dist/ directory
```

## Troubleshooting

### Tools not appearing in Copilot/Claude

1. Verify config file path and JSON syntax
2. Check that `dist/index.js` exists (run `npm run build`)
3. Restart VS Code or Claude Desktop completely
4. Check logs in MCP client for connection errors

### TypeScript compilation errors

1. Ensure Node.js 20+ is installed: `node --version`
2. Delete `node_modules` and `dist`, reinstall: `npm install && npm run build`
3. Check ERROR_LOG.md for known issues

### Tool execution errors

1. Check that AI model is accessible (tools use AI for analysis)
2. Verify prompts are within token limits (configurable in tool code)
3. Review ERROR_LOG.md for common patterns

## License

[Your License Here]

## Contributing

This is an AI-first project. When contributing:

1. **Follow SDD**: Define contracts before implementation
2. **No Heuristics**: Use AI analysis, not hardcoded rules
3. **Document Learnings**: Add to LESSONS_LEARNED.md
4. **Test Tools**: Verify via actual MCP integration
5. **Update Docs**: Keep README, CHANGELOG, and ERROR_LOG current

## Roadmap

### Phase 1 (Current) ✅
- 16 core tools across 4 categories
- VS Code and Claude Desktop integration
- Comprehensive documentation

### Phase 2 (Planned)
- Song version database with SQLite
- Caching layer for common analyses
- Batch processing capabilities
- Export formats (PDF, Markdown, JSON)

### Phase 3 (Future)
- Audio analysis integration (Spotify API or Librosa)
- Multimodal capabilities (image → lyrics inspiration)
- Direct Suno API integration
- Collaborative multi-user features

## Support

- **Documentation**: See `.github/` directory for detailed guides
- **Examples**: Check `.claudefiles/examples/` for sample sessions
- **Issues**: Review ERROR_LOG.md for known problems and solutions
- **Patterns**: Read LESSONS_LEARNED.md for development insights

---

**Built with**: TypeScript, MCP SDK, Zod, Node.js  
**Philosophy**: AI-First, Seam-Driven Development, SOLID & DRY principles  
**Purpose**: Amplify human creativity through sophisticated AI collaboration
