# My Kanban Constitution

## Core Principles

### 1. MVP First
All feature work MUST prioritize validating the core user workflow with the smallest reasonable scope. New requirements should default to simplicity, low configuration burden, and direct support for the current product hypothesis.

### 2. Specification Before Delivery
Material product changes MUST be captured in the speckit workflow before implementation proceeds. The specification, plan, and tasks documents are the source of truth for intended scope and acceptance expectations.

### 3. Clear, Testable Requirements
Requirements, scenarios, and success criteria MUST be concrete, bounded, and testable. Ambiguous language should be replaced with observable outcomes or explicit assumptions.

### 4. Consistent Document Language
All documents generated through speckit, including but not limited to `spec.md`, `plan.md`, `tasks.md`, and checklists, MUST be written in Chinese by default. Only proper technical nouns, commands, paths, protocol names, library names, model names, file names, and other established technical identifiers MUST remain in their original form and SHOULD NOT be translated forcibly. Requirement keywords, acceptance-template words, and normative words such as "must", "Given", "When", and "Then" SHOULD be translated into natural Chinese in generated documents.

## Documentation Standards

Project documents should focus on what users need, why the scope exists, and how success will be judged. Implementation details should be included only when the target artifact explicitly requires them.

## Workflow Guidance

When a new feature is created or an existing feature document is updated, the active agent MUST apply the document language rule in this constitution unless the user explicitly requests a one-off exception.

## Governance

This constitution governs speckit-generated artifacts in this repository. If any template output or local instruction conflicts with this document, this constitution takes precedence for document language and specification quality expectations.

**Version**: 1.0.0 | **Ratified**: 2026-07-07 | **Last Amended**: 2026-07-07
