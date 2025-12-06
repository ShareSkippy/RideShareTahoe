# Project Planning Orchestration Protocol

## Objective

Execute a standardized four-stage planning workflow for all new project requests.

## Phase 1: Scoping & Assessment

**Reference:** `project-planning/initial-project-scoping-guidelines.md`

1.  **Complexity Check:**
    - **Simple/Clear Request:** (e.g., "Change the button color to red"). Proceed immediately to Phase 2.
    - **Complex/Ambiguous Request:** Execute the full scoping protocol defined in the reference document.
2.  **Ambiguity Trigger:** If clarification is required during scoping, **STOP** and query the user. Resume this workflow only after the ambiguity is resolved.

## Phase 2: Project Initialization

**Reference:** `project-planning/project-document-creation-guidelines.md`

- **Action:** Create the project plan file (e.g., `plans/YYYY-MM-DD-name.md`) following the exact schema and naming conventions defined in the reference.
- **Constraint:** This step is mandatory for _all_ projects, regardless of size.

## Phase 3: Technical Preparation

**Reference:** `project-planning/project-preparation-guidelines.md`

- **Action:** Ingest the preparation guidelines and execute the defined research/analysis steps.
- **Output:** Update the "Preparation" section of the project document created in Phase 2.

## Phase 4: Implementation Planning

**Reference:** `project-planning/implementation-log-guidelines.md`

- **Action:** Ingest the implementation log guidelines.
- **Execution:**
  - Determine the strategy (MVP vs. Linear).
  - Generate the phased "Implementation Log" in the project document.
- **Final Verification:** Ensure the plan is concrete, phased, and ready for code execution.
