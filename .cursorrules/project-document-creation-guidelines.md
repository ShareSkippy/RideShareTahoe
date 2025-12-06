# Project Document Generation Protocol

## Objective

Create a persistent project context file to serve as the "Long-Term Memory" for the current task.

## Step 1: File Configuration

- **Directory:** `plans/` (Strictly enforce this path).
- **Naming Convention:** `YYYY-MM-DD-project-name.md` (Kebab-case, concise).
- **Format:** Markdown.

## Step 2: Context Retrieval

Before generating content, ingest the following sources:

1.  **Current User Request:** For specific project scope.
2.  **`GEMINI.md`:** For codebase patterns, libraries, and architectural standards.
3.  **Conversation History:** For implicit constraints and background.

## Step 3: Content Generation (Schema)

Generate the file using the exact structure below.

### 1. Header & Overview

- **Title:** `# <Project Name>`
- **Overview:** A 1-2 paragraph executive summary.

### 2. Goals (`### Goals`)

- **Format:** Flat bullet list.
- **Priority:** List the primary objective first.
- **Quantity:** Focus on 1-5 core objectives.
- **Criteria:** Must be user-verifiable outcomes.

### 3. Constraints (`### Constraints`)

- **Format:** Flat bullet list.
- **Mandatory Inclusions:**
  - Adherence to `GEMINI.md` patterns (no "reinventing the wheel").
  - Code quality standards (modularity, readability, existing linter rules).
- **Contextual Inclusions:** Specific limits derived from the user request (e.g., "Must use library X," "Must be performant").

### 4. Non-Goals (`### Non-Goals`)

- **Format:** Flat bullet list (3-5 items max).
- **Selection Criteria:**
  - **Ambiguity Resolution:** Explicitly exclude features that might be inferred but are out of scope.
  - **Scope Limits:** "Surprising" exclusions (things a user might expect, but we are intentionally skipping).
  - **Filter:** Do not list obvious irrelevancies (e.g., "Don't cook dinner").

### 5. Placeholders

Include the following headers exactly as written, with `...` as the content, to be filled in later:

- `## Preparation`
- `## Implementation Log`
