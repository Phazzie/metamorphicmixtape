# Backend Seam Contracts

This directory contains **Seam-Driven Development** contracts for backend services and external boundaries.

## Philosophy

Following the project's seam-driven development principles:
- **Contracts precede code**: Every seam has an explicit contract
- **Versioned contracts**: Breaking changes create new versions (v2, v3, etc.)
- **Self-documenting**: Contracts are human-readable with examples
- **Two-strike rule**: After 2 fixes, regenerate from contract

## Seams in This Directory

### LLMSeam (v1)
**File:** `LLMSeam.contract.v1.yml`  
**Purpose:** Large Language Model interaction via MCP SDK  
**External Service:** AI model provided by MCP host application

This seam documents the boundary between tool implementations and the AI model.
All 16 tools use this seam via `server.server.createMessage()`.

**Critical:** This is an external dependency (AI model) not under our control.

### ConfigSeam (v1)
**File:** `ConfigSeam.contract.v1.yml`  
**Purpose:** Environment configuration access  
**Locations:** Backend (process.env) and Frontend (environment.ts)

Documents all configuration points:
- Backend: PORT, LOG_LEVEL
- Frontend: apiBaseUrl

## Difference from Frontend Contracts

**Frontend contracts** (`web/src/app/contracts/`):
- HTTP boundaries between Angular UI and REST API
- Require service implementations
- Direct seam pattern

**Backend contracts** (this directory):
- External service boundaries (LLM, Config)
- Document existing patterns
- May not require new implementations (SDK provides abstraction)

## Usage

These contracts document critical boundaries that may not have dedicated
TypeScript implementations because:

1. **LLMSeam**: MCP SDK provides the abstraction
2. **ConfigSeam**: Direct process.env access is acceptable for simple cases

The contracts serve to:
- Make boundaries explicit
- Enable regeneration if needed
- Document dependencies
- Guide error handling
- Support understanding of system architecture

## See Also

- Frontend contracts: `web/src/app/contracts/`
- Project philosophy: `.github/copilot-instructions.md`
- Seam-driven principles: `.claudefiles/plans/seam-driven-development-suno-mcp.md`
