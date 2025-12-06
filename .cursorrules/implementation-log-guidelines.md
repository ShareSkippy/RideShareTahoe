# Project Implementation Log Generation

## Objective

Generate a comprehensive "Implementation Log" section for the project document based on existing context (goals, constraints, preparation specs). The log must break the project into logical phases and actionable tasks.

## Step 1: Context Verification

Before generating, verify that the project document contains sufficient context (goals, overview, constraints).

- **Action:** If critical information is missing, ambiguous, or contradictory, stop immediately and report the specific gaps to the user.
- **Action:** If context is sufficient, proceed to Step 2.

## Step 2: Strategy Selection

Determine the execution strategy based on project complexity:

1.  **MVP Strategy (Default for Complex Projects):**
    - **Phase 1:** Focus strictly on a functional end-to-end "Skeleton/MVP" (Proof of Concept).
    - **Subsequent Phases:** Iteratively add polish and advanced features.
    - _MVP Phase Formatting:_ Must include a subsection (1.1) defining "Core Features to Include" and "Features to Exclude."
2.  **Linear Strategy (Default for Simple Projects):**
    - Phases progress sequentially to the final build (e.g., Setup -> Logic -> UI -> Final).

## Step 3: Content Generation Rules

Generate the `## Implementation Log` section using the rules below.

### Phase Structure

- Use Level 3 Headings (`###`) for Phases.
- Include a 1-3 sentence description under each Phase header explaining its scope.
- Ensure logical dependency order (low-level/foundational blocks first).

### Task List Formatting

- Use a bulleted checklist format: `- [ ] Task description`.
- **Constraint:** Do not separate tasks with empty lines.
- **Constraint:** Do not use subheadings within the task list.

### Task Content Guidelines

- **Coding Tasks:** Must be specific, unambiguous, and granular.
- **Testing Tasks:**
  - Include programmatic testing (e.g., "Write unit tests for X") for complex logic only.
  - Include Manual QA tasks **only** for interface/interaction verification.
  - **Manual QA Format:** `- **For <User Name>:** Open <Page> and verify <Action>.` (Do not use a checkbox for manual QA).

## Step 4: Final Output Review

Ensure the generated log meets the following criteria before outputting:

1.  Phases are non-redundant and non-overlapping.
2.  The "MVP" or "Linear" choice logically fits the project scope.
3.  All tasks are actionable and clear.
