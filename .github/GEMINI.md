# Gemini AI Integration Guide for Suno MCP Server

## Overview

This guide provides instructions for integrating Suno MCP Server with Google's Gemini AI models. While the server is designed to work with any MCP-compatible AI system, Gemini offers unique capabilities that can enhance the songwriting experience.

**Seam-Driven Development Note**: All MCP tools follow contract-first development with versioned Zod schemas. When implementing Gemini-specific optimizations, maintain contract compatibility or version appropriately.

## Gemini-Specific Strengths

### Multimodal Capabilities
Gemini's ability to process text, images, and audio can enhance:
- **Visual Inspiration**: Analyze album art concepts for lyrical themes
- **Audio Analysis**: Examine reference tracks for style guidance
- **Cross-Modal Bridging**: Connect visual aesthetics to sonic possibilities

### Long Context Window
Gemini's extended context allows:
- **Full Song Ecosystem Analysis**: Process entire albums at once
- **Deep Conversation Mining**: Analyze extensive chat histories
- **Comprehensive Evolution Tracking**: Compare many song versions simultaneously

### Reasoning Capabilities
Gemini's advanced reasoning enhances:
- **Complex Pattern Recognition**: Identify subtle creative patterns
- **Multi-Step Creative Processes**: Plan sophisticated songwriting workflows
- **Nuanced Critique**: Provide layered, contextual feedback

## Configuration for Gemini

### Recommended Models

**Gemini 1.5 Pro**
- Best for: Deep analysis, complex reasoning, long-context tasks
- Use cases: extract_song_dna, evolution_tracker, song_ecosystem_builder
- Token limit: Extended (up to 1M tokens input)

**Gemini 1.5 Flash**
- Best for: Quick iterations, rapid feedback, real-time collaboration
- Use cases: refine_lyrics, generate_suno_tags, format_for_suno
- Token limit: Standard (optimized for speed)

**Gemini 2.0 Flash (when available)**
- Best for: Multimodal analysis, creative experimentation
- Use cases: Synesthetic translation, visual-to-lyrical inspiration

### Model-Specific Optimizations

#### For Deep Analysis (Gemini 1.5 Pro)
```typescript
const response = await server.server.createMessage({
  messages: [{
    role: 'user',
    content: { type: 'text', text: analysisPrompt }
  }],
  maxTokens: 2000,  // Higher for complex analysis
  temperature: 0.7,  // Balanced creativity/consistency
  model: 'gemini-1.5-pro'  // Specify model if supported
});
```

#### For Creative Generation (Gemini 1.5 Flash)
```typescript
const response = await server.server.createMessage({
  messages: [{
    role: 'user',
    content: { type: 'text', text: creativePrompt }
  }],
  maxTokens: 1200,  // Moderate for lyrics
  temperature: 0.9,  // Higher for creativity
  model: 'gemini-1.5-flash'
});
```

## Prompt Engineering for Gemini

### Leverage Gemini's Strengths

#### 1. **Detailed Instructions**
Gemini excels with comprehensive, structured prompts:

```
TASK: Analyze the emotional DNA of these songs

CONTEXT:
- User is a singer-songwriter focused on indie folk
- Looking for patterns in successful emotional arcs
- Wants actionable insights for new material

SONGS TO ANALYZE:
[song data]

ANALYSIS REQUIREMENTS:
1. Identify emotional arc patterns
2. Extract structural techniques
3. Find hidden creative strategies
4. Suggest applications to new work

OUTPUT FORMAT:
- Summary paragraph
- Detailed pattern breakdown
- Specific creative recommendations
- Example applications

DEPTH: Professional songwriter level
STYLE: Insightful yet accessible
```

#### 2. **Chain-of-Thought Reasoning**
Encourage step-by-step analysis:

```
Analyze this song's emotional journey using these steps:

STEP 1: Identify the emotional state in each section
STEP 2: Map the transitions between states
STEP 3: Evaluate transition effectiveness
STEP 4: Suggest optimizations
STEP 5: Provide implementation guidance

Think through each step carefully before proceeding.
```

#### 3. **Few-Shot Examples**
Provide examples for complex tasks:

```
Here are examples of semantic bridges:

CONCEPTS: ocean, loneliness
BRIDGE: "Like a lighthouse keeper, surrounded by waves but unreachable"
WHY IT WORKS: Concrete image + emotional resonance

CONCEPTS: time, memories
BRIDGE: "Polaroids fading in reverse—the present becoming the past"
WHY IT WORKS: Unexpected inversion + tangible metaphor

Now create bridges for: [user concepts]
```

#### 4. **Structured Output Requests**
Guide Gemini to specific formats:

```
Provide your analysis in this JSON-compatible structure:

{
  "primary_insights": [string array],
  "supporting_evidence": [string array],
  "creative_applications": [
    {
      "suggestion": string,
      "rationale": string,
      "implementation": string
    }
  ],
  "confidence_level": number (1-10)
}
```

## Gemini-Enhanced Tool Implementations

### 1. Multimodal Song DNA Extraction
```typescript
// Future enhancement: analyze reference images
server.registerTool(
  'extract_visual_song_dna',
  {
    title: 'Visual Song DNA Extraction',
    description: 'Analyze album art, music videos, or visual references for lyrical inspiration',
    inputSchema: {
      images: z.array(z.string()).describe('URLs or base64 encoded images'),
      analysis_focus: z.enum(['mood', 'narrative', 'symbolism', 'aesthetic'])
    }
  },
  async ({ images, analysis_focus }) => {
    // When Gemini multimodal is available via MCP
    const response = await server.server.createMessage({
      messages: [{
        role: 'user',
        content: [
          { type: 'text', text: 'Analyze these images for songwriting inspiration...' },
          ...images.map(img => ({ type: 'image', source: img }))
        ]
      }],
      maxTokens: 1500
    });
    // ... process response
  }
);
```

### 2. Long-Context Evolution Tracking
```typescript
// Leverage Gemini's 1M token context
async ({ song_versions }) => {
  const allVersions = song_versions.map(v => `
    VERSION: ${v.version}
    DATE: ${v.timestamp}
    LYRICS: ${v.lyrics}
    NOTES: ${v.notes}
  `).join('\n\n---\n\n');

  const response = await server.server.createMessage({
    messages: [{
      role: 'user',
      content: {
        type: 'text',
        text: `Analyze the complete evolution across all versions:
        
${allVersions}

Identify:
1. Patterns across all versions
2. Creative breakthroughs
3. Persistent themes
4. Growth trajectory
5. Unique voice development`
      }
    }],
    maxTokens: 2000
  });
}
```

## Best Practices

### Token Management
- **Analysis Tools**: Allocate 1500-2000 tokens for comprehensive insights
- **Creative Tools**: Use 1000-1500 tokens for lyric generation
- **Quick Tools**: Limit to 500-800 tokens for formatting/tagging

### Temperature Settings
- **Analytical**: 0.5-0.7 (balanced, consistent)
- **Creative**: 0.8-1.0 (diverse, unexpected)
- **Formatting**: 0.3-0.5 (precise, predictable)

### Prompt Structure
1. **Context First**: Provide all relevant background
2. **Clear Task**: State exactly what you need
3. **Constraints**: Define boundaries and requirements
4. **Output Format**: Specify desired structure
5. **Quality Criteria**: Define success metrics

### Error Handling
```typescript
try {
  const response = await server.server.createMessage({...});
  
  if (response.content.type !== 'text') {
    throw new Error('Unexpected response format');
  }
  
  // Validate response quality
  if (response.content.text.length < 100) {
    console.warn('Response may be incomplete');
  }
  
} catch (error) {
  console.error('Gemini API error:', error);
  // Fallback to simpler analysis or user notification
}
```

## Integration Patterns

### Sequential Analysis
For complex multi-step processes:

```typescript
// Step 1: Extract themes
const themes = await analyzeThemes(lyrics);

// Step 2: Generate constraints based on themes
const constraints = await generateConstraints(themes);

// Step 3: Apply constraints to create new lyrics
const newLyrics = await generateWithConstraints(constraints);
```

### Parallel Analysis
For independent analyses:

```typescript
const [emotional, structural, linguistic] = await Promise.all([
  analyzeEmotional(lyrics),
  analyzeStructural(lyrics),
  analyzeLinguistic(lyrics)
]);
```

### Iterative Refinement
For collaborative improvement:

```typescript
let currentLyrics = initialLyrics;
let feedback = await analyzeQuality(currentLyrics);

while (feedback.score < targetScore && iterations < maxIterations) {
  currentLyrics = await refineBasedOnFeedback(currentLyrics, feedback);
  feedback = await analyzeQuality(currentLyrics);
  iterations++;
}
```

## Performance Optimization

### Caching Strategies
- Cache common analysis patterns
- Store song DNA for frequently referenced tracks
- Maintain user creative profile for personalization

### Batching
- Combine related operations in single prompts
- Process multiple songs simultaneously when possible
- Batch formatting operations

### Smart Token Usage
- Summarize when full context isn't needed
- Use progressive disclosure (overview → details)
- Implement lazy loading for large ecosystems

## Gemini-Specific Features (Future)

### Code Execution
When Gemini code execution becomes available:
- Run phonetic analysis algorithms
- Calculate rhyme scheme complexity
- Generate syllable pattern visualizations

### Grounding with Google Search
Potential applications:
- Find reference songs matching desired style
- Research cultural context for themes
- Discover trending musical elements

### Function Calling
Enhanced tool orchestration:
- Automatic tool selection based on intent
- Multi-tool workflows
- Dynamic parameter optimization

## Quality Assurance

### Response Validation
```typescript
function validateGeminiResponse(response: any, tool: string) {
  // Check response structure
  if (!response.content || response.content.type !== 'text') {
    logError('Invalid response structure', { tool, response });
    return false;
  }
  
  // Check response quality
  const text = response.content.text;
  if (text.length < 50) {
    logError('Response too short', { tool, length: text.length });
    return false;
  }
  
  // Tool-specific validation
  if (tool === 'generate_lyrics' && !text.includes('\n')) {
    logError('Lyrics missing line breaks', { tool });
    return false;
  }
  
  return true;
}
```

### Fallback Strategies
- Retry with adjusted parameters
- Simplify prompt if too complex
- Use alternative analysis approach
- Notify user of limitations

## Monitoring & Analytics

### Track Performance
- Response times per tool
- Token usage patterns
- Success/failure rates
- User satisfaction scores

### Optimize Based on Data
- Identify slow operations
- Refine prompts for better results
- Adjust token allocations
- Improve error handling

## Security & Privacy

### Data Handling
- Never log complete user lyrics without permission
- Anonymize personal information in prompts
- Respect privacy settings in emotional_archaeology
- Clear sensitive data after processing

### API Key Management
- Store keys securely (environment variables)
- Rotate keys regularly
- Monitor usage for anomalies
- Implement rate limiting

## Troubleshooting

### Common Issues

**Incomplete Responses**
- Increase maxTokens
- Simplify prompt
- Break into smaller requests

**Generic Output**
- Add more specific constraints
- Provide examples
- Increase temperature for creativity

**Inconsistent Format**
- Use stricter output schema
- Provide formatting examples
- Lower temperature for precision

**Slow Performance**
- Reduce input size
- Use Gemini Flash for speed
- Implement caching

## Future Enhancements

- [ ] Multimodal song inspiration from images
- [ ] Audio analysis integration
- [ ] Real-time collaborative editing
- [ ] Gemini-powered learning from user feedback
- [ ] Advanced grounding with music databases
- [ ] Code execution for complex analysis

---

*This guide will evolve as Gemini capabilities expand and integration patterns emerge. See CHANGELOG.md for updates.*