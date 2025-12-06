# Task List Generation Protocol

## Objective

Generate precise, actionable task lists for software implementation, split into **Coding Tasks** (for an LLM/Agent) and **QA Tasks** (for a Human).

## Section 1: Coding Tasks (`**Coding Tasks:**`)

- **Target Audience:** LLM Coding Agent (No browser access).
- **Format:** Single-line bullet points `- [ ] <Task>`. No sub-bullets.
- **Content Constraints:**
  - **Actionable Verbs:** Use specific verbs (e.g., "Implement," "Refactor," "Configure").
  - **No Vague Testing:** Never use "Test" or "Verify" in isolation.
    - _Instead of "Verify X":_ Use "Visually review execution path of X to ensure Y."
    - _Instead of "Test X":_ Use "Write unit tests for X in <filepath>."
  - **Granularity:** Each task must be a complete, atomic unit of work.
  - **Automated Tests:** Place requests for writing programmatic tests (Unit/Integration) at the end of this list.

## Section 2: QA Tasks (`**QA for <User>:**`)

- **Target Audience:** Human User (Has browser access).
- **Format:** Single-line bullet points `- [ ] <Task>`.
- **Content Constraints:**
  - Focus on UI/UX interaction, visual verification, and browser-based edge cases.
  - Focus on "feel," multi-user scenarios, or large data tests that are hard to unit test.
  - _Example:_ "Paste >500KB text from VS Code to verify performance optimization."

## Output Template

```markdown
**Coding Tasks:**

- [ ] Implement <Feature A> using <Pattern B>.
- [ ] Refactor <Function C> to handle <Edge Case D>.
- [ ] Visually review <Module E> to ensure logical flow handles null states.
- [ ] Write unit tests for <Feature A> in `tests/feature-a.test.ts`.

**QA for <User>:**

- [ ] Open the application and verify <UI Element> renders correctly on mobile.
- [ ] Trigger <Action> and observe <Expected Result>.
```
