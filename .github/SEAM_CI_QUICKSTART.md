# Quick Start: Seam-Driven CI

## 🚀 TL;DR

We now have automated validation for all seam-driven contracts! Here's what you need to know:

## ✅ What Runs Automatically

### On Every Commit to `main`
- Contract structure validation
- Version checking
- Contract tests

### On Every Pull Request
- All of the above, plus:
- Breaking change detection
- Two-strike rule enforcement
- Auto-generated contract documentation

## 🛠️ Local Commands

### Before Committing
```bash
npm run validate:all
```
This runs:
- ✅ Contract structure validation
- ✅ Version checking
- ⚠️ Contract linting (warnings only)

### Individual Validators
```bash
# Check contract structure
npm run validate:contracts

# Check version sequences
npm run validate:versions

# Lint Zod schemas
npm run lint:contracts

# Check for two-strike violations
npm run check:two-strike

# Generate contract docs
npm run docs:contracts
```

## 📝 Common Scenarios

### Adding a New Tool

1. **Create contract first**:
```typescript
// In contracts/tool-contracts/src/yourfile.ts
const myToolInputSchemaV1 = z.object({
  param: z.string().describe('What this parameter does')
});

const myToolOutputSchemaV1 = z.object({
  result: z.string().describe('What is returned')
});

export const myToolContractV1 = createToolContract(
  'my_tool',
  'v1',
  myToolInputSchemaV1,
  myToolOutputSchemaV1
);
```

2. **Validate locally**:
```bash
npm run build:contracts
npm run validate:contracts
```

3. **Implement tool** in `src/tools/`

4. **CI validates automatically** when you push

### Making a Breaking Change

1. **Create v2 contract**:
```typescript
export const myToolContractV2 = createToolContract(
  'my_tool',
  'v2',
  newInputSchemaV2,
  newOutputSchemaV2
);
```

2. **Keep v1 if needed** for backward compatibility

3. **PR will show** breaking changes detected

### Fixing Bugs

- **1st fix**: ✅ Go ahead
- **2nd fix**: ✅ Still okay
- **3rd fix**: ⚠️ **Time to regenerate from contract**

Check with:
```bash
npm run check:two-strike
```

## 📊 Understanding Output

### ✅ Success
```
✅ All 7 contract files validated successfully!
✅ All contract versions valid! (18 contracts checked)
```

### ⚠️ Warnings (Non-Blocking)
```
⚠️ analysis.ts:7 - Zod field missing .describe() documentation
⚠️  190 warning(s) found (not blocking)
```
These don't fail the build but indicate room for improvement.

### ❌ Errors (Blocking)
```
❌ Contract validation failed:
  - songwriting.ts: Missing "name" property in contract
```
Fix these before committing.

## 🎯 Best Practices

1. **Always validate before pushing**:
```bash
npm run validate:all
```

2. **Address lint warnings** when you can:
- Add `.describe()` to all fields
- Make descriptions detailed with examples

3. **Watch for breaking changes**:
- CI will flag them on PRs
- Increment version (v1 → v2) when breaking

4. **Regenerate instead of patching**:
- After 2 fixes, regenerate from contract
- Maintains code quality

## 📚 Full Documentation

See `.github/workflows/README.md` for comprehensive documentation including:
- All workflow details
- Script documentation
- Troubleshooting guide
- Integration examples

## 🆘 Help

**Contract validation failing?**
```bash
# Check what's wrong
npm run validate:contracts

# Fix and rebuild
npm run build:contracts
npm run validate:contracts
```

**Breaking changes detected?**
- Review the PR comment
- Create v2 contract if needed
- Or make changes backward-compatible

**Two-strike warnings?**
- Consider regenerating from contract
- Avoid repeated patches

---

**Questions?** Check `.github/workflows/README.md` or ask the team!
