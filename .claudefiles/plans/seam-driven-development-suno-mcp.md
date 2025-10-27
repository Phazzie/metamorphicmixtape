Seam-Driven Development Constitution
 (Completely revised – supersedes v1, ratified Aug 2025)
 Preamble
 We hold these truths to be self-evident: all software is a network of seams—boundaries where data, control, or responsibility crosses. At every seam, clarity beats cleverness. Therefore we organize our work around explicit contracts, automated regeneration, and fail-fast feedback, so that even non-coders can create trustworthy systems.
 Article I — Supremacy of Seams
 1. Seams first. Before components, before code, seams exist.
 2. Every interaction is a seam. APIs, queues, databases, CSV imports—if data crosses a line, name the line.
 3. Hidden seams are bugs. Undeclared boundaries break builds.
 Article II — Law of Contracts
 1. Contracts precede code. No implementation may begin until its seam’s contract is ratified.
 2. Immutability through versioning.
   • Files are named <Seam>.contract.v<n>.yml.
   • Any change creates v<n+1>; in-place edits are forbidden and blocked by CI.
   • A symlink or alias latest always points to the highest version.
 3. Completeness required. A contract must define inputs, outputs, errors, and at least one working example.
 4. Self-documentation. Contracts are written for humans first—plain language with machine-readable linting.
 Article III — Regeneration Doctrine
 1. Debugging is limited. A generated artifact may receive at most two manual patches. On the third failure it must be deleted and fully regenerated from its contract.
 2. Regeneration prompt. Every regeneration is accompanied by a YAML block:
   regenerate:
     component: <SeamName>
     cause: "<why it failed>"
     tests_failing: [<test files>]
     contract_change: |
       - <bulleted edits>
 3. The contract is the single source of truth. If regenerated code still fails, the contract—not the code—must change.
 4. Manual fixes outside the two-strike window are heresy. Delete and regenerate.
 Article IV — Tool Supremacy
 1. Automation over discipline. Enforcement is mechanical: linters, hooks, pipelines.
 2. Tools build tools. Bootstrap code may be manual; everything else is generated.
 3. Simplicity imperative, not straitjacket. <100 lines per tool is the goal; larger tools are allowed if generated and self-documenting.
 Article V — Phases of Development
 Development flows one-way; a later phase never mutates an earlier artifact.
 Phase | Description | Locked when…
 0. Define Requirements | Plain-language PRD or feature brief. | PRD pushed to repo
 1. Identify Seams | AI or human lists every boundary. | seams.json committed
 2. Define Contracts | One versioned contract per seam. | All contracts validate
 3. Build UI first to help define seams.
 4. Validate | Examples execute, schemas pass. | CI green
 5. Generate | Code, tests, blueprints emitted. | Builds & tests green
 6. Regenerate | Triggered only by two-strike rule or new contract version. | New code passes tests
 Completed phase directories become read-only by Git hooks and file permissions.
 Article VI — Rights & Guarantees
 1. Right to Seam Clarity. Anyone can understand a component by reading its contract.
 2. Right to Regeneration. Any component can be rebuilt from its contract with one command.
 3. Right to Fail Fast. Violations surface instantly and verbosely.
 4. Right to Tool Assistance. Users—coder or not—receive scaffolds.
 Enforcement Mechanisms
 Enforcement Mechanisms


 NOTES:

