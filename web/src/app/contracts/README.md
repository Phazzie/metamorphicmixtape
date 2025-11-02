# Angular UI Seam Contracts

This directory contains **Seam-Driven Development** contracts for all Angular services that interact with external systems (the MCP server HTTP API).

## Philosophy

Following the project's seam-driven development principles:
- **Contracts precede code**: Every seam has an explicit contract before implementation
- **Versioned contracts**: Breaking changes create new versions (v2, v3, etc.)
- **Self-documenting**: Contracts are human-readable with examples
- **Two-strike rule**: After 2 fixes, regenerate from contract

## Seams in This Directory

### ToolApiSeam (v1)
**File:** `ToolApiSeam.contract.v1.yml`  
**Implementation:** `../services/tool-api.service.ts`  
**Purpose:** Core HTTP adapter for executing MCP tools via REST API

This is the foundational seam. All other seams depend on it.

### SongwritingSeam (v1)
**File:** `SongwritingSeam.contract.v1.yml`  
**Implementation:** `../services/songwriting.service.ts`  
**Purpose:** Access to songwriting tools (generate_lyrics, refine_lyrics)

### SunoSeam (v1)
**File:** `SunoSeam.contract.v1.yml`  
**Implementation:** `../services/suno.service.ts`  
**Purpose:** Suno AI optimization tools (format_for_suno, generate_suno_tags)

### AnalysisSeam (v1)
**File:** `AnalysisSeam.contract.v1.yml`  
**Implementation:** `../services/analysis.service.ts`  
**Purpose:** Analysis tools (emotional_archaeology, evolution_tracker)

## Contract Structure

Each contract follows this structure:

```yaml
seam:
  name: SeamName
  version: 1
  description: |
    Purpose and responsibilities

inputs:
  # Input parameters with types, validation, examples

outputs:
  # Output structure with types, examples

errors:
  # Error codes and conditions

implementation:
  # Language, framework, location, dependencies

example_usage: |
  # Working code example

validation:
  # Validation rules

notes: |
  # Additional context
```

## Usage

### For Developers

1. **Read the contract first** before modifying any service
2. **Contracts are authoritative** - code must match contract
3. **To make changes**:
   - Modify contract first
   - Update version if breaking change
   - Regenerate or update implementation
   - Add example usage

### For AI Agents

1. **Always reference the contract** when generating or modifying services
2. **Validate against contract** before committing code
3. **Follow two-strike rule**: After 2 manual fixes, regenerate from contract
4. **Version on breaking changes**: Create v2 file, don't modify v1

## Regeneration

If a service needs regeneration:

```bash
# Reference the contract
cat contracts/ToolApiSeam.contract.v1.yml

# Regenerate service implementation
# AI: Use contract as single source of truth
```

## Validation

Contracts should validate:
- ✅ Input types match backend contracts (in `contracts/tool-contracts/`)
- ✅ Output types match backend contracts
- ✅ Error handling is comprehensive
- ✅ Examples are executable
- ✅ Dependencies are explicit

## Benefits

- **Clarity**: Anyone can understand a service by reading its contract
- **Regeneration**: Services can be rebuilt from contracts
- **Versioning**: Breaking changes are explicit (v1 → v2)
- **Documentation**: Contracts serve as living documentation
- **Type Safety**: TypeScript models match contract schemas

## See Also

- Project philosophy: `.github/copilot-instructions.md`
- Seam-driven principles: `.claudefiles/plans/seam-driven-development-suno-mcp.md`
- Backend contracts: `contracts/tool-contracts/`
