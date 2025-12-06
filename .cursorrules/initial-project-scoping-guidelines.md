# Project Scoping & Analysis Protocol

## Objective

Analyze new project requests to establish immediate clarity on scope, context, and requirements. The goal is to produce a structured "Scoping Summary" that serves as the source of truth for execution, or to immediately identify blocking ambiguities.

## Phase 1: Contextual Analysis

Before generating output, process the following inputs:

1.  **User Request:** Identify the core intent (Bug fix, Feature, Refactor, Research, etc.).
2.  **Documentation:** Cross-reference the request against `CLAUDE.md` (codebase overview) and prior context to identify implicit requirements, style guides, or architectural constraints.
3.  **Ambiguity Check:** detailed scan for contradictions, missing data, or vague requirements.

## Phase 2: Execution Logic

**Condition A: Critical Ambiguity Detected**
If the request is unclear, contradictory, or lacks essential context that cannot be inferred from `CLAUDE.md`:

- **Action:** Stop immediately.
- **Output:** A bulleted list of clarifying questions required to proceed.

**Condition B: Scope is Clear**
If the request is understood and context is sufficient:

- **Action:** Generate the **Scoping Summary** (see structure below).

## Phase 3: The Scoping Summary (Deliverable)

Generate a markdown block titled `## Project Scoping Summary` containing the following sections. Keep content concise and high-density.

1.  **Project Synopsis:** A precise restatement of the goal in your own words.
2.  **Category:** The specific type of work (e.g., "Critical Bug Fix," "New Feature Implementation," "Architectural Refactor").
3.  **Key Requirements & Constraints:**
    - Explicit deliverables.
    - Implicit constraints derived from `GEMINI.md` or context.
4.  **Execution Strategy:** A high-level sentence on how you intend to approach this (e.g., "Investigation first, then implementation," or "Straightforward implementation").

**Constraint:** Do not include "fluff" or conversational filler. Focus strictly on the data required for "Future Context" to understand the mission.
