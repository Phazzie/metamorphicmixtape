# Error Log

This document tracks errors, bugs, issues, and their resolutions for the Suno MCP Server. All errors should be logged here with status, date, and resolution details.

**Seam-Driven Development**: Tool failures follow two-strike rule: fix manually twice, regenerate from contract on third failure. Contract violations are tracked here.

**Status Key**:
- 🔴 **CRITICAL** - Blocking production use
- 🟡 **HIGH** - Impairs functionality significantly  
- 🟢 **MEDIUM** - Noticeable but workaround exists
- 🔵 **LOW** - Minor inconvenience
- ✅ **RESOLVED** - Fixed and verified
- 🚫 **WONTFIX** - Intentional or unfixable

---

## Active Issues

### 🟡 HIGH-001: Incomplete Tool Implementations
**Date Reported**: 2025-10-10  
**Status**: 🟡 HIGH - In Progress  
**Component**: `src/tools/songwriting.ts`, `src/tools/suno.ts`

**Description**:
Several planned tools are not yet implemented:
- `generate_lyrics`
- `refine_lyrics`
- `songwriting_council`
- `devils_advocate`
- `format_for_suno`
- `generate_suno_tags`
- `optimize_suno_prompt`
- `analyze_suno_output`

**Impact**:
Users cannot access core songwriting and Suno integration features. Only meta-analytical and analysis tools are functional.

**Workaround**:
Use existing analysis tools to inform manual songwriting process.

**Resolution Plan**:
1. Implement `generate_lyrics` and `refine_lyrics` first (core functionality)
2. Add Suno formatting tools next (format_for_suno, generate_suno_tags)
3. Complete advanced tools (songwriting_council, devils_advocate)
4. Add Suno optimization tools last (optimize_suno_prompt, analyze_suno_output)

**Target Date**: 2025-10-17  
**Assigned To**: Development team  
**Dependencies**: None

---

### 🔵 LOW-001: TypeScript Compilation Warnings
**Date Reported**: 2025-10-10  
**Status**: 🔵 LOW  
**Component**: `src/tools/meta.ts`, `src/tools/analysis.ts`

**Description**:
TypeScript shows implicit 'any' type warnings when dependencies are not installed:
```
Binding element 'songs' implicitly has an 'any' type.
Cannot find module 'zod' or its corresponding type declarations.
```

**Impact**:
No runtime impact. Development-time only. Warnings disappear after `npm install`.

**Workaround**:
Run `npm install` to install dependencies and resolve warnings.

**Resolution**:
✅ RESOLVED - Expected behavior before dependency installation. Not an actual error.

**Closed**: 2025-10-10

---

## Resolved Issues

### ✅ RESOLVED-001: Missing Dependencies on Fresh Install
**Date Reported**: 2025-10-10  
**Date Resolved**: 2025-10-10  
**Status**: ✅ RESOLVED  
**Component**: `package.json`

**Description**:
Fresh clone/install would show dependency errors until `npm install` was run.

**Impact**:
New users would see TypeScript errors immediately after cloning.

**Resolution**:
- Added clear installation instructions to README.md
- Documented expected behavior
- No code changes needed (expected workflow)

**Verified**: Installation works correctly with `npm install`

---

## Won't Fix

### 🚫 WONTFIX-001: AI Response Variability
**Date Reported**: 2025-10-10  
**Status**: 🚫 WONTFIX  
**Component**: All tools using AI

**Description**:
AI-powered tools return different results for the same input due to model non-determinism.

**Impact**:
Creative outputs vary between runs, even with identical inputs.

**Rationale**:
This is intentional and desirable for creative tools. Variability:
- Provides fresh perspectives
- Enables creative exploration
- Prevents user over-reliance on single "right" answer
- Aligns with creative process nature

**Recommendation**:
Use temperature parameter to control variability if needed. Document this as a feature, not a bug.

---

## Error Categories

### Build & Compilation Errors

*None currently active*

---

### Runtime Errors

*None currently reported*

---

### Integration Errors

*None currently reported*

---

### Performance Issues

*None currently reported*

---

### User Experience Issues

*None currently reported*

---

## Known Limitations

### LIMIT-001: No Offline Mode
**Status**: Known Limitation  
**Component**: All AI-powered tools

**Description**:
Server requires active connection to AI model provider. Cannot operate offline.

**Impact**:
No functionality without internet/API access.

**Mitigation**:
- Document clearly in README
- Consider caching common analyses (future enhancement)
- Provide clear error messages when connection fails

---

### LIMIT-002: Token Limits Constrain Large Operations
**Status**: Known Limitation  
**Component**: All tools with AI calls

**Description**:
AI model token limits constrain:
- Number of songs that can be analyzed simultaneously
- Length of lyrics that can be processed
- Depth of evolution tracking across many versions

**Impact**:
Large-scale operations may need to be broken into chunks.

**Mitigation**:
- Implement smart summarization for large inputs
- Provide batching capabilities
- Add progress indicators for multi-step operations

---

### LIMIT-003: No Persistent Storage
**Status**: Known Limitation  
**Component**: Server architecture

**Description**:
Server is stateless. No database for:
- Song versions
- User preferences  
- Analysis history
- Creative patterns

**Impact**:
Users must manage their own file storage. No automatic tracking across sessions.

**Mitigation**:
- Encourage file-based workflows
- Future: Add SQLite database
- Future: Implement session persistence

---

## Error Reporting Guidelines

### When to Log an Error

Log errors when:
- ✅ Functionality doesn't work as documented
- ✅ Unexpected behavior occurs
- ✅ Performance is significantly degraded
- ✅ User experience is negatively impacted
- ✅ Build or deployment fails

Don't log:
- ❌ Expected behavior (even if inconvenient)
- ❌ User mistakes or misuse
- ❌ Feature requests (use separate backlog)
- ❌ Documentation issues (track separately)

### Error Report Template

```markdown
### 🔴 [SEVERITY]-[NUMBER]: [Brief Title]
**Date Reported**: YYYY-MM-DD  
**Status**: 🔴 CRITICAL | 🟡 HIGH | 🟢 MEDIUM | 🔵 LOW  
**Component**: `file/path` or module name

**Description**:
Clear description of the error, including:
- What happened
- What was expected
- Steps to reproduce

**Impact**:
How this affects users and functionality.

**Workaround**:
Temporary solution if available.

**Resolution Plan**:
Steps to fix the issue.

**Error Messages**:
```
Exact error text
Stack trace if applicable
```

**Environment**:
- Node version: 
- TypeScript version:
- OS:
- MCP client:

**Related Issues**: Links to related errors if applicable
```

---

## Testing & Verification

### Pre-Release Checklist

Before marking any error as resolved:
- [ ] Fix verified in development environment
- [ ] Fix tested with multiple AI models
- [ ] No new errors introduced
- [ ] Documentation updated if needed
- [ ] CHANGELOG.md updated
- [ ] Tested on Windows, macOS, Linux (if OS-specific)

---

## Common Error Patterns

### Pattern: SDD Contract Violations

**Symptoms**: Runtime validation errors, output structure mismatch, type errors  
**Causes**:
- Implementation written without reference to Zod contract
- Contract modified after implementation
- Misunderstanding of schema requirements

**Solutions (Two-Strike Rule)**:
1. **First failure**: Update implementation to match contract, document in this log
2. **Second failure**: Deep analysis of root cause, fix implementation, document pattern
3. **Third failure**: **Delete entire tool and regenerate from contract**
4. **Still failing**: Update the contract itself (version on breaking changes)

**Prevention**:
- Always read contract (Zod schema) before implementing
- Never modify contract to match buggy code
- Use `.describe()` annotations as implementation guide

---

### Pattern: AI Response Timeout

**Symptoms**: Tool calls hang or timeout  
**Causes**: 
- AI model overloaded
- Network issues
- Excessively long prompts

**Solutions**:
- Implement timeout handling
- Add retry logic with exponential backoff
- Break large prompts into chunks
- Provide user feedback during long operations

---

### Pattern: Invalid AI Response Format

**Symptoms**: Structured output doesn't match schema  
**Causes**:
- AI didn't follow output format instructions
- Schema too strict for creative content
- Prompt ambiguity

**Solutions**:
- Add format examples to prompts
- Implement response validation and retry
- Make schemas more flexible for creative fields
- Provide format templates in prompts

---

### Pattern: Context Window Overflow

**Symptoms**: AI truncates response or misses context  
**Causes**:
- Input exceeds model's context window
- Too many songs/versions provided
- Overly verbose context

**Solutions**:
- Implement intelligent summarization
- Prioritize recent/relevant context
- Use progressive disclosure
- Batch processing for large datasets

---

## Debugging Tips

### Enable Verbose Logging
```bash
# Set environment variable
export DEBUG=suno:*

# Run server with logging
npm start
```

### Test Individual Tools
```typescript
// In test file
const result = await server.callTool('extract_song_dna', {
  songs: [...],
  focus_areas: [...]
});
console.log(JSON.stringify(result, null, 2));
```

### Validate Schemas
```typescript
import { z } from 'zod';

// Test schema separately
const schema = z.object({...});
const result = schema.safeParse(data);
if (!result.success) {
  console.error(result.error);
}
```

### Monitor AI Calls
```typescript
// Wrap AI calls with logging
const response = await server.server.createMessage({...});
console.log('Tokens used:', response.usage);
console.log('Response time:', responseTime);
```

---

## Error Analytics

### Most Common Errors (To Be Tracked)

1. [Will be populated as issues are reported]
2. [Track patterns over time]
3. [Identify systemic issues]

### Error Rate Targets

- Build failures: 0%
- Runtime errors: < 0.1% of tool calls
- AI timeouts: < 1% of calls
- Invalid responses: < 2% of AI calls

---

## Emergency Procedures

### Critical Error Response

1. **Identify Severity**: Is this blocking all functionality?
2. **Document**: Add to this log immediately
3. **Communicate**: Notify users if public release
4. **Isolate**: Disable affected tool if possible
5. **Fix**: Prioritize resolution
6. **Verify**: Test thoroughly before re-enabling
7. **Post-Mortem**: Document root cause and prevention

### Rollback Procedure

```bash
# Revert to last known good version
git checkout [last-good-commit]
npm install
npm run build
npm start
```

---

## Error Prevention

### Code Review Checklist
- [ ] All async operations have error handling
- [ ] Input validation before AI calls
- [ ] Output validation after AI calls
- [ ] Timeout handling implemented
- [ ] Graceful degradation on failure
- [ ] User-friendly error messages
- [ ] Errors logged for debugging

### Testing Requirements
- [ ] Unit tests for core logic
- [ ] Integration tests for tool workflows
- [ ] Error case testing
- [ ] Edge case handling
- [ ] Performance testing for large inputs

---

## Contact & Reporting

### How to Report Errors

1. **GitHub Issues**: Create issue with template
2. **Error Log**: Add to this document
3. **Severity**: Assess and tag appropriately
4. **Details**: Provide reproduction steps

### Response Times

- 🔴 CRITICAL: 24 hours
- 🟡 HIGH: 3 days
- 🟢 MEDIUM: 1 week
- 🔵 LOW: 2 weeks

---

## Changelog

**2025-10-10**: Error log created  
**Next Review**: After first user testing phase

---

*This error log should be kept current. Update immediately when issues are discovered, resolved, or status changes.*