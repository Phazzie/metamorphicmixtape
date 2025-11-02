# CI Enhancements for Seam-Driven Development

This directory contains CI workflows and scripts that enforce seam-driven development principles across the Metamorphic Mixtape codebase.

## 📋 Overview

Per the project's **seam-driven development philosophy**, all MCP tools and HTTP boundaries follow contract-first development with versioned schemas. These CI enhancements automate validation, detection of breaking changes, and enforcement of best practices.

## 🔧 Workflows

### 1. **Seam Contract Validation** (`.github/workflows/seam-validation.yml`)

Comprehensive validation of all Zod contract schemas:

**Jobs:**
- **`validate-contracts`**: Validates contract structure and completeness
  - Checks for required properties (name, version, schemas)
  - Verifies documentation quality
  - Ensures version consistency
  
- **`lint-contracts`**: Lints Zod schemas for best practices
  - Ensures all fields have `.describe()` documentation
  - Checks for explicit optional/required declarations
  - Warns about short descriptions

- **`check-breaking-changes`**: Detects breaking changes between base and head
  - Identifies removed fields
  - Detects type changes
  - Flags optional → required conversions
  - Suggests version increments

- **`verify-two-strike-rule`**: Enforces regeneration doctrine
  - Checks git history for repeated fixes to same files
  - Warns when files have 3+ fixes (time to regenerate from contract)

**Triggers**: On push to `main`, PRs affecting contracts or tools

### 2. **Standard CI** (`.github/workflows/ci.yml`)

Enhanced with seam validation steps:
- Builds server and Angular client
- **NEW**: Validates seam contracts
- **NEW**: Checks contract versions

### 3. **Contract Tests** (`.github/workflows/contract-tests.yml`)

Validates tool implementations match contracts:
- Ensures all tools use shared contracts
- Verifies schema consistency

### 4. **Seam Documentation** (`.github/workflows/seam-docs.yml`)

Automatically generates and comments contract documentation on PRs:
- Lists all contracts by category
- Shows versions and descriptions
- Helps reviewers understand changes

## 🛠️ Scripts

All scripts are in `/scripts/` and are executable:

### Core Validators

#### `validate-seam-contracts.mjs`
Validates contract structure follows seam-driven principles:
```bash
node scripts/validate-seam-contracts.mjs
```

**Checks:**
- ✅ Every contract has name and version
- ✅ Input and output schemas are defined
- ✅ Adequate documentation via `.describe()`
- ✅ Version naming consistency

**Exit codes:**
- `0`: All contracts valid
- `1`: Validation errors found

---

#### `check-contract-versions.mjs`
Ensures version sequences are correct:
```bash
node scripts/check-contract-versions.mjs
```

**Checks:**
- ✅ Versions start at 1
- ✅ No gaps in version sequences (v1, v2, v3...)
- ✅ Contract names are unique per version

**Output:**
```
📋 generateLyrics:
   Versions: 1
   Files: songwriting.ts
   ✅ Valid
```

---

#### `lint-zod-contracts.mjs`
Lints Zod schemas for quality and completeness:
```bash
node scripts/lint-zod-contracts.mjs
```

**Checks:**
- ⚠️ Fields missing `.describe()` documentation
- ⚠️ Short descriptions needing examples
- ❌ Usage of `any` type (blocks build)
- ⚠️ Large enums without explanations

**Exit codes:**
- `0`: No errors (warnings don't block)
- `1`: Errors found

---

#### `detect-contract-breaking-changes.mjs`
Detects breaking changes between two contract versions:
```bash
node scripts/detect-contract-breaking-changes.mjs <base-dir> <head-dir>
```

**Detects:**
- 🔴 Contract removed
- 🔴 Field removed
- 🔴 Type changed
- 🔴 Optional → Required
- 🟡 New required field

**Used in CI** to compare PR changes against base branch.

---

#### `check-two-strike-violations.mjs`
Enforces the two-strike regeneration rule:
```bash
node scripts/check-two-strike-violations.mjs
```

**What it does:**
- Analyzes last 50 commits
- Identifies files with 3+ fix commits
- Suggests regeneration from contract

**Example output:**
```
⚠️  Possible two-strike rule violations:

📄 src/tools/songwriting.ts:
   Fixed 3 times in recent history
   Commits:
     - abc1234 fix: correct lyrics generation
     - def5678 bugfix: handle empty input
     - ghi9012 patch: null reference

   ⚠️  Consider: Regenerate from contract instead of patching
```

---

#### `generate-contract-docs.mjs`
Generates markdown documentation from contracts:
```bash
node scripts/generate-contract-docs.mjs
```

**Output:**
- Contract overview by category
- Tool names and versions
- Descriptions
- Used for PR comments

---

## 🎯 Seam-Driven Principles Enforced

### 1. **Contract-First Development**
- ✅ Contracts must exist before tools
- ✅ All contracts have explicit schemas
- ✅ Documentation is required, not optional

### 2. **Versioning**
- ✅ Breaking changes require new versions (v1 → v2)
- ✅ Version sequences are validated
- ✅ Breaking change detection on PRs

### 3. **Regeneration Doctrine**
- ✅ Two-strike rule monitored via git history
- ✅ Warnings when files have 3+ patches
- ✅ Encourages contract-based regeneration

### 4. **Quality Standards**
- ✅ No `any` types allowed
- ✅ All fields documented with `.describe()`
- ✅ Consistent naming conventions

## 📊 Example CI Run

**Pull Request with Contract Changes:**

1. **Seam Validation** workflow runs:
   - ✅ Validates structure
   - ✅ Lints schemas (190 warnings, non-blocking)
   - ✅ Checks versions (18 contracts, all valid)
   - ⚠️ Detects no breaking changes

2. **Seam Documentation** workflow runs:
   - 📝 Generates contract overview
   - 💬 Comments on PR with changes

3. **Standard CI** runs:
   - ✅ Build succeeds
   - ✅ Contract tests pass (5/5)
   - ✅ Seam validation passes

## 🔄 Integration with Development Workflow

### Adding New Tool

1. **Define contract** in `contracts/tool-contracts/src/`:
```typescript
export const myNewToolContractV1 = createToolContract(
  'my_new_tool',
  'v1',
  inputSchemaV1,
  outputSchemaV1
);
```

2. **CI automatically validates**:
   - Structure is correct
   - Version is v1
   - Documentation exists

3. **Implement tool** in `src/tools/`:
```typescript
import { myNewToolContractV1 } from '@metamorphicmixtape/contracts';
server.registerTool(
  myNewToolContractV1.name,
  { inputSchema: myNewToolContractV1.inputSchema },
  async (input) => { /* ... */ }
);
```

4. **Contract tests verify** alignment

---

### Making Breaking Change

1. **Create new version**:
```typescript
export const myToolContractV2 = createToolContract(
  'my_tool',
  'v2',
  inputSchemaV2, // Breaking change here
  outputSchemaV2
);
```

2. **CI detects** breaking change:
   - Compares v1 and v2
   - Lists differences
   - Warns in PR

3. **Keep v1 for compatibility** (if needed)

---

### Fixing Bugs

1. **First fix**: Manual patch ✅
2. **Second fix**: Manual patch ✅
3. **Third fix**: ⚠️ CI warns - **regenerate from contract**

---

## 🚀 Local Development

**Run all validators before committing:**

```bash
# Validate contracts
npm run build:contracts
node scripts/validate-seam-contracts.mjs

# Check versions
node scripts/check-contract-versions.mjs

# Lint contracts
node scripts/lint-zod-contracts.mjs

# Check for two-strike violations
node scripts/check-two-strike-violations.mjs

# Run standard contract tests
npm run contract:test
```

**Add to pre-commit hook** (optional):
```bash
#!/bin/sh
npm run build:contracts && \
node scripts/validate-seam-contracts.mjs && \
node scripts/check-contract-versions.mjs
```

---

## 📝 Configuration

### Adjusting Validation Rules

**Severity levels in `lint-zod-contracts.mjs`:**
- `'error'`: Blocks build
- `'warning'`: Logged but non-blocking
- `'info'`: Informational only

**Customize:**
- Minimum `.describe()` count
- Required documentation length
- Two-strike commit threshold

### Disabling Specific Checks

Add to workflow:
```yaml
- name: Validate contracts (no lint)
  run: node scripts/validate-seam-contracts.mjs
  # Skip linting step if needed
```

---

## 🎓 Best Practices

1. **Always build contracts first**: `npm run build:contracts`
2. **Review lint warnings**: They improve contract quality
3. **Watch for breaking changes**: Increment version when needed
4. **Regenerate, don't patch**: After 2 fixes, regenerate from contract
5. **Document thoroughly**: Rich descriptions help AI and humans

---

## 🐛 Troubleshooting

### "Missing input schema" error
- Ensure contract uses `createToolContract()` or has `inputSchema` property
- Check import paths

### "Gap in versions" error
- Don't skip versions (no v1 → v3)
- If removing v2, clean up exports

### Linter false positives
- Output schemas don't need every field documented (derived from input)
- Adjust severity if needed

### Breaking change detector issues
- Ensure both branches build contracts successfully
- Check that contract names match between versions

---

## 📚 References

- **Seam-Driven Development**: `.github/copilot-instructions.md`
- **Contract Structure**: `contracts/tool-contracts/src/contract.ts`
- **Example Contracts**: `contracts/tool-contracts/src/songwriting.ts`
- **Tool Implementation**: `src/tools/songwriting.ts`

---

## ✅ Success Criteria

Your seam-driven development CI is working when:

- ✅ All workflows pass on `main` branch
- ✅ PRs with contract changes get auto-documented
- ✅ Breaking changes are detected and flagged
- ✅ Two-strike violations are caught early
- ✅ Contract quality improves over time

---

**Built with**: Node.js 20, GitHub Actions
**Philosophy**: Contract-first, version-aware, regeneration-driven
**Goal**: Enforce seam-driven development at CI level

