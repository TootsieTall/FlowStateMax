# Engineering Guidelines (Universal)

## Core Philosophy

- Build only what clearly serves the user’s primary goal.
- Prefer the simplest solution that works; minimize blast radius of changes.
- Make every change reversible and easy to review.
- Favor clarity over cleverness; readability over concision.

---

## Product Principles

1. Minimize friction: reduce setup, clicks, and decisions.
2. Guide with clear next actions; avoid choice paralysis.
3. Progressive disclosure: advanced options stay hidden until needed.
4. No feature bloat: remove or refuse features that don’t serve the mission.
5. Respect user time: optimize for fast, confident completion.

Before adding anything, ask:
- Does this meaningfully help the core user outcome?
- Does it integrate naturally into existing flows?
- Does it remove friction rather than add it?
- Can users opt out and recover quickly?

---

## Technical Principles

- Never hardcode secrets; use environment configuration.
- Validate all inputs at boundaries.
- Handle errors explicitly with actionable messages.
- Avoid hidden state and global side effects.
- Prefer small, composable modules and pure functions.
- Keep dependencies lean; prefer standard library first.
- Optimize only after measuring; keep perf budgets explicit.

---

## Development Workflow

1. Understand the problem and read relevant code.
2. Write a short plan with atomic tasks and acceptance criteria.
3. Implement in small, reviewable edits with clear commit messages.
4. Validate behavior (manual or automated) as you go.
5. Document non-obvious decisions near the code.
6. Land changes behind safe defaults or feature flags when risky.

Definition of done:
- Meets acceptance criteria and passes checks.
- Adds/updates validation and error handling.
- No linter/type errors; no dead code.
- User-facing behavior documented where helpful.

---

## Code Quality Rules

- Single responsibility per module/component.
- Prefer early returns over deep nesting.
- Name things descriptively; avoid abbreviations.
- Keep functions small; extract intent-revealing helpers.
- Write defensive code at boundaries; trust invariants internally.
- Remove unused code, imports, and dependencies.

---

## API and Data

- Validate inputs; sanitize outputs.
- Use consistent error shapes and status codes.
- Version breaking changes; maintain backward compatibility when feasible.
- Log with context; avoid leaking sensitive data.

---

## Testing and Verification

- Test critical paths manually or via automated checks.
- Prefer fast, deterministic tests close to the code.
- Verify failure modes and error messaging.
- Add regression coverage for fixed bugs.

Manual release checklist:
- Clear success criteria verified.
- Rollback path documented.
- Metrics/observability ready for key flows.

---

## Accessibility and UX

- Ensure keyboard navigation, focus states, and ARIA labels where applicable.
- Maintain color contrast standards.
- Provide clear loading, empty, and error states.

---

## Security and Privacy

- Principle of least privilege for data and keys.
- Avoid logging secrets or personal data.
- Enforce authorization at every protected boundary.
- Keep dependencies updated; review high-risk packages.

---

## Operational Discipline

- Small, frequent commits; push after completing logical tasks.
- Use feature flags for risky changes.
- Monitor, alert, and document runbooks for critical flows.

---

## Team Agreements

- Communicate early when blocked; propose options.
- Prefer written context for decisions that affect others.
- Review for correctness, clarity, and scope control.

---

## Remember

- Simplicity scales. Reduce scope, surface area, and surprises.
- Make it obvious what the code does and why.
- If it’s not helping the user reach their goal, don’t build it.



