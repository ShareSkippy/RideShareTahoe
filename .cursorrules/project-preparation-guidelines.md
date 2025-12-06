# Project Preparation Protocol

## Objective

Execute the "Preparation Phase" for the current project. This process generates the strategic foundation required before coding begins, populating the `## Preparation` section of the Project Document.

## Phase 1: Workflow Design

Before executing, generate a **Preparation Workflow** based on the project's complexity.

### Complexity Archetypes

1.  **Standard/Linear:** For well-defined tasks (e.g., strict bug fixes, simple features).
    - _Workflow:_ Research -> Design Spec -> Update Doc.
2.  **Complex/Architectural:** For ambiguous or high-impact tasks.
    - _Workflow:_ Information Gathering -> Brainstorming (3+ options) -> Evaluation Rubric -> Decision -> Design Spec -> Update Doc.

**Action:** Select an archetype or customize a workflow using the **Execution Modules** below. Render this workflow as a **Mermaid flowchart** for the user to approve.

## Phase 2: Execution Modules

Execute the selected workflow steps sequentially.

- **Module: Information Gathering**
  - _Goal:_ Context retrieval (existing patterns, APIs, legacy code).
  - _Output:_ concise bulleted findings.
- **Module: Brainstorming & Logic Mapping**
  - _Goal:_ Generate options for implementation paths or edge-case handling.
  - _Constraint:_ For complex logic, map flow and scenarios explicitly.
- **Module: Evaluation & Decision**
  - _Goal:_ Select the best approach.
  - _Requirement:_ State the decision and the _why_ (trade-offs).
- **Module: Design Specification**
  - _Goal:_ Detailed technical blueprint.
  - _Standard:_ Must be clear enough for a different developer to implement without questions.
- **Module: Review & Refine**
  - _Goal:_ Self-correction.
  - _Trigger:_ Execute this module immediately after _Design Specification_ to catch gaps.

## Phase 3: Documentation Updates

**Critical Constraint:** All thinking and final decisions must be persisted to the `## Preparation` section of the project document.

- **Format:** Use clear subheadings (e.g., `### 2.1 Research Findings`, `### 2.2 Architecture Decision`).
- **conciseness:** Summarize the _outcome_ of the modules. Do not dump raw "thought process" logs; write for the "Future Developer."

## Execution Trigger

1.  Assess Project Complexity.
2.  Define and Visualize the Workflow (Mermaid).
3.  Execute the modules.
4.  Commit findings to the Project Document.
