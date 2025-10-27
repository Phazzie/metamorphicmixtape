# Suno MCP Server - Master Roadmap & Tool Breakdown

**Created:** October 10, 2025  
**Status:** Planning Phase  
**Version:** 1.0.0 Development Plan

---

## 🎯 Project Vision

Build an AI-first MCP server that transforms songwriting for Suno users by providing intelligent analysis, creative collaboration, and workflow optimization. Focus on **enhancing creativity** through sophisticated AI assistance, not replacing human artistry.

---

## 📊 Current Status

### ✅ Completed (Phase 0: Foundation)
- [x] Project structure and TypeScript configuration
- [x] MCP server core implementation with stdio transport
- [x] Meta-analytical tools (4 tools)
  - extract_song_dna
  - constraint_generator
  - semantic_bridging
  - song_ecosystem_builder
- [x] Analysis tools (4 tools)
  - emotional_archaeology
  - evolution_tracker
  - conversation_miner
  - emotional_journey_mapper
- [x] Comprehensive documentation suite
- [x] .claudefiles/ directory system

### 🚧 In Progress (Phase 1: Core Songwriting)
- [ ] Songwriting tools (4 tools planned)
- [ ] Suno-specific tools (4 tools planned)
- [ ] Dependencies installation and build
- [ ] README with examples
- [ ] Initial testing

---

## 🗺️ Development Phases

### Phase 1: Core Songwriting Tools (Current - Week 1-2)
**Goal:** Essential songwriting functionality for immediate use

**Priority:** HIGH  
**Timeline:** 1-2 weeks  
**Deliverables:** Working stdio MCP server with core tools

### Phase 2: Enhancement & Polish (Weeks 3-4)
**Goal:** Improve tool quality, add examples, gather feedback

**Priority:** HIGH  
**Timeline:** 2 weeks  
**Deliverables:** Production-ready local version

### Phase 3: Advanced Features (Months 2-3)
**Goal:** Power-user features and workflow optimization

**Priority:** MEDIUM  
**Timeline:** 4-6 weeks  
**Deliverables:** Advanced analysis and creative tools

### Phase 4: Remote Hosting (Month 4+)
**Goal:** Multi-user cloud deployment

**Priority:** FUTURE  
**Timeline:** TBD  
**Deliverables:** Hosted service with chat interface

---

## 🛠️ Tool Breakdown - Phase 1 (Build Now)

### SONGWRITING TOOLS (src/tools/songwriting.ts)

---

#### 1. `generate_lyrics` 
**Purpose:** AI-powered lyric generation from concepts, themes, or prompts

**What It Does:**
- Takes user's song concept/theme/mood as input
- Allows specification of genre, style, structure
- Generates complete lyrics with verses, chorus, bridge
- Maintains consistent voice and narrative throughout
- Respects user's creative direction and constraints

**Input Parameters:**
- `concept` (string, required): Core idea or theme
- `genre` (enum): Genre/style guidance
- `mood` (enum): Emotional tone target
- `structure` (enum): Song structure preference (verse-chorus, AABA, etc.)
- `length` (enum): Short/medium/long
- `specific_requirements` (string, optional): Special instructions
- `reference_style` (string, optional): "Write like [artist/song]"

**Output:**
- Complete lyric text with section labels
- Structural breakdown (verse count, chorus variations)
- Rhyme scheme analysis
- Syllable count per section
- Suggested delivery notes
- Alternative lines for key moments

**Complexity:** MEDIUM
- Requires sophisticated AI prompting for quality
- Must maintain consistency across sections
- Balance creative freedom with structure
- Generate multiple variations internally, return best

**Build Considerations:**
- Prompt engineering for consistent voice
- Section-by-section generation vs. full-song approach
- Quality validation (detect generic/cliché output)
- Iteration support (refine based on user feedback)

**AI Strategy:**
- Use high temperature (0.9-1.0) for creativity
- Provide rich context (genre conventions, mood markers)
- Request structured output with rationale
- Generate 2-3 options internally, surface best

---

#### 2. `refine_lyrics`
**Purpose:** Intelligent improvement of existing lyrics while preserving artist's voice

**What It Does:**
- Analyzes existing lyrics for strengths/weaknesses
- Suggests specific improvements (line-by-line)
- Enhances imagery, flow, emotional impact
- Fixes awkward phrasing or forced rhymes
- Preserves the original voice and intent

**Input Parameters:**
- `original_lyrics` (string, required): Current lyrics
- `refinement_focus` (array of enums): What to improve
  - flow_and_rhythm
  - imagery_and_metaphor
  - emotional_depth
  - rhyme_scheme
  - narrative_clarity
  - word_choice
- `preservation_level` (enum): How much to preserve
  - minimal_changes (fix only obvious issues)
  - moderate_revision (improve while keeping structure)
  - creative_reimagining (bold changes allowed)
- `voice_reference` (string, optional): Other user lyrics for voice matching
- `specific_concerns` (string, optional): User-identified weak spots

**Output:**
- Refined lyrics with changes highlighted
- Line-by-line comparison (before/after)
- Explanation for each change
- Alternative options for key lines
- Overall impact assessment
- Suggestions for further refinement

**Complexity:** HIGH
- Must understand original artistic intent
- Balance improvement with preservation
- Detect voice/style patterns to maintain
- Provide clear rationale for changes
- Avoid making it "sound AI-written"

**Build Considerations:**
- Voice preservation algorithm (analyze user's style first)
- Change tracking and explanation generation
- Multiple refinement passes possible
- User feedback integration
- Undo/rollback capability

**AI Strategy:**
- Lower temperature (0.6-0.7) for thoughtful refinement
- Analyze voice BEFORE suggesting changes
- Explain every change with specific reasoning
- Offer alternatives, not dictates
- Focus on "making it more YOU, but better"

---

#### 3. `songwriting_council`
**Purpose:** Multi-persona AI collaboration for diverse creative perspectives

**What It Does:**
- Summons different AI "personalities" to collaborate on lyrics
- Each persona brings unique perspective and expertise
- Personas debate, build on each other's ideas
- User chooses which perspectives resonate
- Simulates real songwriting collaboration

**Input Parameters:**
- `song_context` (string, required): What you're working on
- `personas_to_summon` (array, optional): Specific personas
  - the_poet (imagery, metaphor, language)
  - the_storyteller (narrative, arc, characters)
  - the_producer (commercial appeal, hooks)
  - the_rebel (unconventional, rule-breaking)
  - the_therapist (emotional authenticity, vulnerability)
  - the_comedian (wit, wordplay, levity)
  - the_philosopher (depth, meaning, universality)
- `collaboration_style` (enum):
  - round_robin (each speaks in turn)
  - debate (challenge each other)
  - build_together (collaborate on single idea)
  - diverge_then_converge (separate then synthesis)
- `session_length` (enum): Brief/medium/deep dive

**Output:**
- Dialogue between personas with distinct voices
- Key insights from each perspective
- Synthesis of best ideas
- Consensus recommendations
- Areas of creative disagreement (for user to resolve)
- Action items from the council

**Complexity:** VERY HIGH
- Create distinct, believable personas
- Maintain persona consistency
- Realistic dialogue/collaboration
- Avoid feeling gimmicky
- Surface genuinely valuable perspectives

**Build Considerations:**
- Persona definition and personality design
- Dialogue generation (natural back-and-forth)
- Prevent one persona from dominating
- Keep output organized and useful (not just entertaining)
- Allow user to join the conversation

**AI Strategy:**
- Multiple AI calls or single sophisticated prompt?
- Develop detailed persona profiles
- Use role-playing prompts effectively
- Balance entertainment with utility
- Ensure diverse perspectives, not just rephrased same idea

---

#### 4. `devils_advocate`
**Purpose:** Constructive critical analysis to push work deeper

**What It Does:**
- Challenges user's creative choices (constructively)
- Asks tough questions about lyrics
- Identifies potential weaknesses
- Pushes user to dig deeper emotionally
- Forces justification and refinement
- Helps avoid surface-level work

**Input Parameters:**
- `lyrics_or_concept` (string, required): What to critique
- `challenge_intensity` (enum):
  - gentle_questioning (supportive critique)
  - moderate_challenge (push for better)
  - direct_honesty (clear and direct, never brutal)
  - socratic_method (questions only)
- `focus_areas` (array, optional):
  - emotional_authenticity
  - originality
  - depth_of_meaning
  - technical_craft
  - commercial_viability
- `user_confidence_level` (enum): Adjust based on user's needs
  - needs_encouragement (challenge gently)
  - ready_for_tough_love (be direct)
  - seeking_validation (balance critique with praise)

**Output:**
- Critical questions about the work
- Identification of weak spots or clichés
- Challenges to dig deeper
- Alternative perspectives to consider
- Specific improvement suggestions
- Acknowledgment of strengths (balanced critique)

**Complexity:** MEDIUM-HIGH
- Must be constructive, not destructive
- Balance honesty with support
- Ask insightful questions
- Avoid generic critiques
- Adapt to user's emotional state

**Build Considerations:**
- Tone calibration (critical but supportive)
- Question quality (insightful, not obvious)
- Detect clichés and surface-level work
- Provide actionable challenges
- Know when to encourage vs. challenge

**AI Strategy:**
- Frame as "making your work stronger"
- Ask "why" questions that force deeper thinking
- Identify unexplored emotional territory
- Challenge assumptions about the work
- End with actionable next steps

---

## 🎵 Tool Breakdown - Phase 1 (Build Now)

### SUNO TOOLS (src/tools/suno.ts)

---

#### 5. `format_for_suno`
**Purpose:** Convert lyrics to Suno's optimal format with proper tags and structure

**What It Does:**
- Takes raw lyrics and formats for Suno AI
- Adds proper section tags ([Verse], [Chorus], etc.)
- Inserts structural markers Suno understands
- Ensures proper line breaks and spacing
- Adds metadata tags (genre, mood, instruments)
- Validates format before submission

**Input Parameters:**
- `lyrics` (string, required): Raw or formatted lyrics
- `auto_detect_structure` (boolean): Detect sections automatically
- `section_labels` (object, optional): Manual section marking
- `include_instrumental_breaks` (boolean): Add [Instrumental] tags
- `vocal_directions` (array, optional): [Whisper], [Shout], etc.
- `song_length_target` (enum): Short/medium/long (affects formatting)

**Output:**
- Suno-formatted lyrics with all tags
- Preview of how Suno will interpret structure
- Warnings about potential issues
- Character count and section count
- Suggestions for optimization
- Ready-to-paste final format

**Complexity:** LOW-MEDIUM
- Learn Suno's format requirements
- Auto-detect song structure
- Insert appropriate tags
- Validate format correctness
- Handle edge cases (unusual structures)

**Build Considerations:**
- Suno format documentation research
- Section detection algorithm
- Tag insertion logic
- Format validation rules
- Preview generation

**AI Strategy:**
- Use AI to detect song structure intelligently
- Suggest optimal tag placement
- Identify where instrumental breaks make sense
- Validate against Suno best practices
- Lower temperature (0.4) for precision

---

#### 6. `generate_suno_tags`
**Purpose:** Create optimal genre, style, and mood tags for Suno generation

**What It Does:**
- Analyzes lyrics for musical style indicators
- Generates appropriate genre tags
- Suggests mood and energy descriptors
- Recommends instrumentation tags
- Creates vocal style tags
- Optimizes tag combinations for best results

**Input Parameters:**
- `lyrics` (string, required): The song lyrics
- `user_intent` (string, optional): Desired sound/vibe
- `genre_preference` (array, optional): Preferred genres
- `mood_target` (array, optional): Target moods/emotions
- `instrumentation_ideas` (string, optional): Instrument preferences
- `reference_songs` (array, optional): "Make it sound like..."

**Output:**
- Primary genre tags (2-3 main)
- Secondary style tags (subgenres, influences)
- Mood/energy tags
- Instrumentation suggestions
- Vocal style tags
- Complete tag string ready for Suno
- Alternative tag combinations to try
- Explanation of tag choices

**Complexity:** MEDIUM
- Understand Suno's tag system
- Analyze lyrics for style indicators
- Map lyrical content to musical styles
- Balance specificity with flexibility
- Test what tag combinations work

**Build Considerations:**
- Suno tag taxonomy research
- Lyric-to-style mapping
- Genre detection from lyrics
- Tag effectiveness database (what works)
- Combination optimization

**AI Strategy:**
- Analyze lyrical content for musical clues
- Consider rhythm, imagery, themes for genre
- Research effective Suno tag patterns
- Provide reasoning for each tag
- Suggest A/B test options

---

#### 7. `optimize_suno_prompt`
**Purpose:** Prompt engineering for best possible Suno generation

**What It Does:**
- Takes user's basic idea and enhances it
- Crafts optimal prompt structure for Suno
- Adds details that improve generation quality
- Removes elements that confuse Suno
- Orders information for maximum impact
- Provides multiple prompt variations

**Input Parameters:**
- `basic_prompt` (string, required): User's initial idea
- `lyrics` (string, optional): If lyrics are ready
- `priority_elements` (array): What matters most
  - lyrical_clarity
  - musical_style
  - vocal_quality
  - production_quality
  - emotional_impact
- `avoid_elements` (array, optional): What NOT to include
- `experimental_level` (enum): Safe/moderate/experimental

**Output:**
- Optimized primary prompt
- 2-3 alternative prompt variations
- Explanation of optimization choices
- Predicted Suno interpretation
- Tips for iteration if first gen doesn't work
- Tag suggestions to pair with prompt

**Complexity:** MEDIUM-HIGH
- Understand Suno's prompt interpretation
- Learn what language works best
- Balance specificity with creative freedom
- Test prompt effectiveness
- Iterate based on results

**Build Considerations:**
- Suno prompt best practices research
- Effective prompt pattern library
- A/B testing results database
- Prompt structure templates
- User feedback integration

**AI Strategy:**
- Analyze successful Suno prompts
- Identify patterns in effective prompts
- Use AI to enhance clarity and specificity
- Provide rationale for each element
- Learn from user's success/failure reports

---

#### 8. `analyze_suno_output`
**Purpose:** Post-generation analysis and iteration strategy

**What It Does:**
- Analyzes generated Suno song
- Compares to original intent
- Identifies what worked/didn't work
- Suggests prompt/tag adjustments
- Provides iteration strategy
- Helps user dial in the sound they want

**Input Parameters:**
- `original_prompt` (string, required): What was submitted
- `original_tags` (string, required): Tags used
- `suno_output_description` (string, required): What Suno created
- `user_feedback` (string, required): What user thinks
  - what_worked (array)
  - what_didnt_work (array)
  - desired_changes (array)
- `audio_characteristics` (object, optional):
  - tempo_actual
  - energy_level
  - vocal_style
  - instrumentation

**Output:**
- Analysis of why Suno interpreted prompt that way
- Specific prompt/tag changes for next iteration
- What to keep vs. what to change
- Predicted outcome of suggested changes
- Alternative approaches to try
- Learning points for future generations

**Complexity:** HIGH
- Understand Suno's interpretation patterns
- Reverse-engineer from output to prompt
- Provide actionable iteration advice
- Build knowledge base of patterns
- Learn from user feedback

**Build Considerations:**
- Suno behavior pattern analysis
- Iteration strategy templates
- Change impact prediction
- A/B testing recommendation
- Success pattern recognition

**AI Strategy:**
- Detailed analysis of prompt-to-output relationship
- Pattern recognition in Suno's behavior
- Specific, actionable recommendations
- Build user's understanding of the system
- Create iteration roadmap

---

## 🚀 Tool Breakdown - Phase 2 (Build Next)

### WORKFLOW & UTILITY TOOLS

These tools enhance the user experience and workflow efficiency.

---

#### 9. `create_song_project`
**Purpose:** Set up organized workspace for new song with metadata

**What It Does:**
- Creates structured directory for song project
- Initializes metadata file (title, genre, dates, etc.)
- Sets up version tracking
- Creates template files (lyrics, notes, iterations)
- Establishes project organization
- Enables cross-tool data persistence

**Complexity:** LOW  
**Priority:** MEDIUM  
**Timeline:** Phase 2

**Input:**
- Project name, genre, basic metadata
- Template type (if any)

**Output:**
- Created project structure
- Initialized files
- Project ID for other tools to reference

**Build Considerations:**
- File system operations
- Metadata schema design
- Template system
- Project linking across tools

---

#### 10. `save_song_version`
**Purpose:** Version control for song iterations

**What It Does:**
- Saves snapshot of current song state
- Tags version with notes and timestamp
- Enables rollback to previous versions
- Tracks changes between versions
- Builds version history
- Supports A/B testing of different directions

**Complexity:** LOW-MEDIUM  
**Priority:** HIGH (Phase 2)  
**Timeline:** Phase 2

**Input:**
- Current lyrics/state
- Version notes
- Tags (milestone, experiment, etc.)

**Output:**
- Version saved with ID
- Comparison to previous version
- Version history updated

**Build Considerations:**
- Storage format (JSON, markdown, etc.)
- Diff/comparison logic
- Metadata tracking
- File organization

---

#### 11. `compare_versions`
**Purpose:** Side-by-side comparison of song versions

**What It Does:**
- Shows differences between versions
- Highlights changes (additions, deletions, modifications)
- Analyzes quality progression
- Identifies patterns in revisions
- Helps user understand evolution
- Suggests which version is stronger (with reasoning)

**Complexity:** MEDIUM  
**Priority:** MEDIUM  
**Timeline:** Phase 2

**Input:**
- Two or more version IDs to compare

**Output:**
- Visual diff
- Analysis of changes
- Quality assessment
- Recommendations

**Build Considerations:**
- Diff algorithm (text comparison)
- Quality metrics
- Visualization format
- Multi-version comparison support

---

## 🎨 Tool Breakdown - Phase 3 (Advanced Features)

### CREATIVE ENHANCEMENT TOOLS

These are power-user features for advanced creativity.

---

#### 12. `phonetic_flow_optimizer`
**Purpose:** Analyze and optimize actual sound/flow, not just syllables

**What It Does:**
- Analyzes how lyrics sound when sung
- Considers mouth movements, breath points
- Identifies flow obstacles (hard transitions)
- Suggests smoother alternatives
- Optimizes for singability
- Goes beyond simple syllable counting

**Complexity:** VERY HIGH  
**Priority:** LOW (Phase 3)  
**Timeline:** Phase 3

**Why Complex:**
- Phonetic analysis algorithms
- Prosody understanding
- Breath point detection
- Flow quality heuristics
- Requires deep linguistic knowledge

**Build Considerations:**
- Phonetic transcription
- Flow scoring algorithms
- Alternative generation
- Musical rhythm integration

---

#### 13. `dream_logic_structure`
**Purpose:** Generate non-linear, surreal song structures

**What It Does:**
- Creates unconventional song structures
- Uses dream-like logic and associations
- Breaks traditional patterns
- Generates surprising transitions
- Maintains coherence in chaos
- For experimental/art songs

**Complexity:** VERY HIGH  
**Priority:** LOW (Phase 3)  
**Timeline:** Phase 3

**Why Complex:**
- Abstract pattern generation
- Coherence in non-linearity
- Experimental structure design
- Artistic quality assessment

**Build Considerations:**
- Surrealist techniques research
- Structure generation algorithms
- Coherence validation
- User guidance for interpretation

---

#### 14. `genre_fusion_lab`
**Purpose:** Intelligent blending of disparate genres

**What It Does:**
- Takes multiple genres as input
- Analyzes characteristic elements of each
- Suggests creative fusion approaches
- Generates style guidelines for fusion
- Provides examples and inspiration
- Helps create unique hybrid sounds

**Complexity:** HIGH  
**Priority:** MEDIUM (Phase 3)  
**Timeline:** Phase 3

**Build Considerations:**
- Genre characteristic database
- Fusion strategy patterns
- Conflict resolution (incompatible elements)
- Example generation

---

#### 15. `rhyme_scheme_architect`
**Purpose:** Design and implement complex rhyme schemes

**What It Does:**
- Creates custom rhyme scheme patterns
- Suggests slant rhymes, internal rhymes
- Designs complex rhyming structures
- Validates adherence to scheme
- Suggests words that fit scheme + meaning
- Teaches rhyme scheme theory

**Complexity:** MEDIUM-HIGH  
**Priority:** LOW (Phase 3)  
**Timeline:** Phase 3

**Build Considerations:**
- Rhyme dictionary integration
- Scheme notation system
- Pattern validation
- Word suggestion engine
- Theory explanation

---

## 🔮 Tool Breakdown - Phase 4 (Future/Maybe)

### ADVANCED INTEGRATION TOOLS

These require external integrations or significant infrastructure.

---

#### 16. `suno_api_integration`
**Purpose:** Direct Suno generation from MCP (if API becomes available)

**What It Does:**
- Submit generations directly to Suno
- Monitor generation progress
- Retrieve results automatically
- Enable full workflow automation

**Complexity:** MEDIUM (depends on Suno API)  
**Priority:** FUTURE  
**Timeline:** When Suno releases API  
**Blocker:** Suno doesn't have public API yet

---

#### 17. `audio_reference_analysis`
**Purpose:** Analyze reference tracks for style replication

**What It Does:**
- Takes audio file as input
- Analyzes musical characteristics
- Generates tags/prompts to replicate style
- Identifies key elements to capture

**Complexity:** VERY HIGH  
**Priority:** FUTURE  
**Timeline:** Phase 4+  
**Requirements:** Audio analysis libraries, ML models

---

#### 18. `collaborative_session`
**Purpose:** Real-time multi-user songwriting

**What It Does:**
- Multiple users work on same song
- Real-time synchronization
- Role assignment (different perspectives)
- Merge conflicting edits
- Chat + tool use together

**Complexity:** VERY HIGH  
**Priority:** FUTURE  
**Timeline:** After remote hosting  
**Requirements:** WebSocket, state management, conflict resolution

---

#### 19. `vocal_melody_suggester`
**Purpose:** Suggest vocal melodies for lyrics

**What It Does:**
- Analyzes lyric rhythm and stress
- Suggests melodic contours
- Provides MIDI or notation
- Matches to genre conventions

**Complexity:** VERY HIGH  
**Priority:** FUTURE  
**Timeline:** Research phase  
**Requirements:** Music theory engine, melody generation AI

---

## 📈 Success Metrics

### Phase 1 Success Criteria
- ✅ All 8 core tools functional
- ✅ Server runs without errors
- ✅ Tools produce quality output
- ✅ Works in VS Code + Claude Desktop
- ✅ Documentation complete
- ✅ 3+ example workflows documented

### Phase 2 Success Criteria
- ✅ Positive user feedback
- ✅ Tool output quality consistently high
- ✅ Project management tools working
- ✅ Version control functional
- ✅ Performance optimized

### Phase 3+ Success Criteria
- ✅ Advanced features add real value
- ✅ User retention/repeat usage
- ✅ Community contributions
- ✅ Feature requests prioritized

---

## 🎯 Immediate Next Steps (Phase 1)

### Week 1: Core Implementation
1. **Day 1-2:** Implement `generate_lyrics` and `refine_lyrics`
2. **Day 3:** Implement `songwriting_council` and `devils_advocate`
3. **Day 4:** Implement all 4 Suno tools
4. **Day 5:** Install dependencies, build, fix compilation errors

### Week 2: Testing & Documentation
1. **Day 1-2:** Test each tool thoroughly
2. **Day 3:** Create comprehensive README
3. **Day 4:** Write usage examples
4. **Day 5:** Final testing and bug fixes

### Week 3: Validation
1. Test in real songwriting scenarios
2. Gather initial feedback
3. Fix critical issues
4. Prepare for Phase 2

---

## 🤔 Open Questions to Resolve

1. **Tool Priority:** Do we agree on these 8 tools for Phase 1?
2. **Quality Bar:** What's acceptable quality for initial release vs. polish later?
3. **Examples:** How many example workflows should we document?
4. **Testing:** Manual testing only, or add automated tests?
5. **Phase 2 Timing:** Start Phase 2 immediately or gather feedback first?

---

## 📝 Notes & Decisions

### Design Philosophy Agreements
- AI-first, no heuristics unless absolutely necessary
- Rich context over minimal prompts
- Multiple options over single answers
- Teach users, don't just do for them
- Preserve artistic voice always

### Technical Decisions
- TypeScript strict mode (type safety)
- Zod for schemas (validation)
- ESM modules (modern)
- stdio transport (local first)
- .claudefiles for generated content

### Scope Boundaries
- **IN SCOPE:** Creative tools, analysis, Suno optimization
- **OUT OF SCOPE (for now):** Audio processing, melody generation, direct Suno API
- **FUTURE:** Remote hosting, multi-user, real-time collaboration

---

## 🎬 Ready to Proceed?

**This plan covers:**
- ✅ All 8 Phase 1 tools with detailed breakdowns
- ✅ 7 Phase 2 tools (planned)
- ✅ 4 Phase 3 advanced tools (future)
- ✅ 4 Phase 4 research tools (maybe)
- ✅ Timeline and priorities
- ✅ Success criteria
- ✅ Open questions

**Next Step:** Review this plan, confirm we're aligned, then I'll start building Phase 1 tools!

What do you think? Any changes, additions, or different priorities?