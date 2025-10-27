# Tool Explanations

## Meta-Analytical Tools (meta.ts)

### extract_song_dna
Analyzes successful songs to identify recurring patterns in structure, metaphors, and emotional arcs. Implementation: Sends song details to AI with focused analysis prompts requesting pattern extraction across specified dimensions (structure, emotional_arc, metaphor_usage, sonic_palette, narrative_voice), returning actionable creative blueprints.

### constraint_generator
Generates creative constraints (forbidden words, required phrases, structural rules) to spark innovation through limitation. Implementation: Uses AI to analyze the song concept and generate 3-5 constraints per type (linguistic, structural, thematic, sonic, temporal) with clear rationales explaining how each limitation drives creativity.

### semantic_bridging
Discovers unexpected connections between disparate concepts to create unique lyrical angles. Implementation: Takes two concepts and prompts AI to find non-obvious bridges through metaphor chains, shared emotional territories, and sensory overlaps, returning 5-7 creative pathways with practical applications.

### song_ecosystem_builder
Creates interconnected song universes with shared themes, characters, and motifs across multiple songs. Implementation: AI analyzes core concept to generate 4-6 related song ideas with distinct angles, shared DNA elements, potential connections, and creative constraints for ecosystem coherence.

## Analysis Tools (analysis.ts)

### emotional_archaeology
Mines digital life data (messages, journal entries, photos) for authentic emotional themes to write about. Implementation: Takes user-provided life data and prompts AI to identify 5-7 emotional themes with supporting evidence, personal metaphors, and song angle suggestions based on genuine lived experience.

### evolution_tracker
Tracks creative growth by analyzing multiple song versions to identify emerging patterns and skill development. Implementation: Compares song versions chronologically, using AI to detect pattern evolution in technical skills, thematic exploration, and stylistic growth, with personalized development recommendations.

### conversation_miner
Extracts song-worthy concepts from conversations, texts, or dialogue by identifying emotional moments and unique phrasings. Implementation: AI analyzes conversation text to find 5-7 compelling moments with emotional hooks, unique language, and song structure suggestions while preserving conversational authenticity.

### emotional_journey_mapper
Maps and optimizes the emotional arc of a song from start to finish for maximum impact. Implementation: AI analyzes lyrics to chart emotional intensity across sections, identifies arc patterns (rise, fall, transformation), suggests peak placement optimizations, and recommends structural refinements for narrative coherence.

## Songwriting Tools (songwriting.ts)

### generate_lyrics
Creates complete original lyrics from a concept, incorporating themes, constraints, and emotional direction. Implementation: Constructs detailed AI prompt with concept, mood, structure preferences, and constraints; AI generates 2-3 verse/chorus cycles with meta-commentary on creative choices, emotional arc analysis, and refinement suggestions.

### refine_lyrics
Improves existing lyrics by enhancing rhythm, imagery, emotional impact, and structural flow. Implementation: Sends original lyrics with focus areas (rhythm, imagery, impact, structure) and intensity level to AI; returns improved version with inline change annotations explaining each modification and further improvement suggestions.

### songwriting_council
Provides multi-perspective feedback through distinct personas (perfectionist, experimentalist, storyteller, commercial, producer). Implementation: AI adopts 3-5 selected personas sequentially, each providing unique feedback; synthesizes consensus areas, creative tensions, and balanced recommendations integrating all perspectives.

### devils_advocate
Challenges lyrics with critical analysis to push deeper exploration and uncover hidden weaknesses. Implementation: AI adopts adversarial stance to identify vulnerabilities (clichés, unclear moments, missed opportunities, weak endings) with uncomfortable questions and provocative improvement challenges designed to strengthen the work.

## Suno Tools (suno.ts)

### format_for_suno
Converts lyrics into Suno-ready format with proper structure markers ([Verse], [Chorus], etc.) and timing optimization. Implementation: AI analyzes lyrics to identify sections, adds Suno structure tags, optimizes line breaks for vocal phrasing, removes problematic formatting, and applies Suno best practices (syllable limits, clarity balance).

### generate_suno_tags
Creates genre/style tags for Suno prompts based on lyrics and desired sound aesthetic. Implementation: AI analyzes lyrics and style description to generate primary tags (2-4 core genres), secondary tags (instrumentation, mood, production), alternatives for experimentation, and usage tips explaining tag interaction effects.

### optimize_suno_prompt
Engineers complete Suno prompts combining lyrics, tags, and style descriptions for optimal generation results. Implementation: Takes formatted lyrics and preferences, constructs optimized prompt with tag ordering strategy, style descriptor placement, structural hints, and common pitfall avoidance; includes prompt explanation and iteration suggestions.

### analyze_suno_output
Analyzes generated Suno output to provide iteration strategy for improving results. Implementation: Takes generation results and user feedback, AI identifies what worked/didn't work, suggests prompt adjustments (tag changes, structure modifications, style tweaks), and provides 2-3 specific iteration strategies with expected improvements.

## Implementation Pattern (All Tools)

All 16 tools follow the same architecture:
1. **Input Schema**: Inline Zod schemas with `.describe()` for type-safe, self-documenting parameters
2. **AI Prompting**: Detailed prompts to `server.server.createMessage()` with rich context and specific output requests
3. **Structured Output**: Parse AI response into both human-readable text and structured data objects
4. **Error Handling**: Type-checked response access with fallbacks for graceful degradation
5. **Token Management**: Configured maxTokens (1200-2000) based on tool complexity

The meta and analysis tools focus on **discovery and insight**, while songwriting and Suno tools focus on **creation and optimization**. All leverage AI intelligence over hardcoded rules.
