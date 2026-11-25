# HW4 handoff: Kishan's part

Hey Kishan, thanks for jumping in. Everything below is self-contained; budget about 1 to 1.5 hours. HW4 is due **Wed Nov 25, 11:59pm**. I'm flying all day Wednesday, so **you submit on Canvas** when you're done.

## What's already done (Nicholas)

- **Part 1:** `/init` output (`docs/hw4/init-output.md`), rewritten `CLAUDE.md` v1.0 with `@docs/PRD.md` import, `.claude/settings.json` permissions.
- **Part 2:** F1 fingering chart via Explore → Plan → Implement → Commit (`docs/hw4/f1-explore.md`, `f1-plan.md`, then the F1 commits).
- **Part 3:** F2 note detection with strict red/green/refactor commits for AC1 to AC5 (`src/lib/pitch/`).
- Session log exported to `docs/hw4/`.

## Your part

You'll add one small feature that ties F1 and F2 together, using the same workflow, on your own branch. This gives the repo a second developer's Explore → Plan → Implement → Commit cycle and a reviewed PR.

**Feature: F1 AC6. The chart shows each note's target pitch in Hz** (for example "C5 · 523.3 Hz"), so learners know what the tuner should read. `frequencyHzAt(note)` in `src/lib/pitch/scale.ts` already does the math.

### Steps

1. **Setup**
   ```bash
   git clone https://github.com/nkaplun/ocarina-coach.git && cd ocarina-coach
   npm install && npm test
   git switch -c feature/f1-ac6-target-hz
   claude
   ```
2. **Explore.** Paste:
   > Explore only, no code yet. Read CLAUDE.md, docs/PRD.md (F1, F2), src/components/FingeringPanel.tsx and src/lib/pitch/scale.ts. Summarize how the chart page gets its note and where a Hz label would go. Save to docs/hw4/f1-ac6-explore.md and commit as "docs(explore): F1 AC6 target Hz".
3. **Plan.** Press **Shift+Tab** until it shows plan mode. Paste:
   > Plan F1 AC6: show the selected note's target frequency in Hz, rounded to 1 decimal, on the fingering panel. Add AC6 to docs/PRD.md. Plan the tests first.
   Approve the plan, then:
   > Save the plan to docs/hw4/f1-ac6-plan.md and commit as "docs(plan): F1 AC6 target Hz".
4. **Implement with TDD.** Paste:
   > Implement with strict TDD per CLAUDE.md: failing test first, commit as "test(F1): AC6 ... [red]", minimum code, commit as "feat(F1): AC6 ... [green]", then refactor if useful. Run npm test, lint and typecheck before each commit.
5. **Context management.** Type `/compact`, then ask "What's left for F1 AC6?" so the log shows it.
6. **Export your log.** `/export docs/hw4/session-log-kishan.md`, commit it.
7. **PR.** Push and open a PR. Ask Claude:
   > Push this branch and open a PR. In the description include: what changed, test results, and AI disclosure (tool used, rough % AI-written, what you reviewed by hand).
   Then in a **new** Claude session (`/clear`), have it review the PR as a second reviewer:
   > Review PR #N using the C.L.E.A.R. framework from class. Post the review as a PR comment.
   Merge when green.
8. **Reflection.** Add your half to `docs/hw4/reflection.md` under "Kishan" (about half a page): how Explore → Plan → Implement → Commit compared to how we worked on LoopLab, and what helped most coming into a repo cold (CLAUDE.md, the PRD, /compact). Commit and push.
9. **Submit** the repo URL on Canvas: https://github.com/nkaplun/ocarina-coach

## If you run short on time

Skip steps 7's review and anything optional. Steps 1 to 6 plus your reflection paragraph are the important ones. Nothing you do can break the existing work: it's all on your branch until you merge.
