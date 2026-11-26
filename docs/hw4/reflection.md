# HW4 Reflection: Claude Code Workflow and TDD

Project: Ocarina Coach (https://github.com/nkaplun/ocarina-coach). Annotated log: [session-log-annotated.md](session-log-annotated.md).

## Nicholas

### How Explore → Plan → Implement → Commit compared to my previous approach

On Project 2 (LoopLab), my loop was "pick an issue, prompt Claude to build it test-first, open a PR." The tests came first, but the thinking didn't: the plan lived in the PRD and in my head, and Claude started writing code in the same turn it started reading. That worked for routine features like CRUD routes, where the model's defaults are usually right.

This homework showed me where that approach breaks. The fingering chart looks like a simple data feature, but the Explore step found that the web sources disagree: one note was missing everywhere, two notes had conflicting fingerings, and three sharps used a split hole that doesn't exist on a 12-hole ocarina. Because I had told Claude "explore only, don't write code yet", it stopped and asked me three questions instead of picking an answer. I pointed it at a maker's chart, and it transcribed all 21 fingerings and found the footer that settled which octave the notes are in. Under my old loop, Claude would have written fingerings from memory, the tests would have checked that the code matched those wrong fingerings, and everything would have been green. **TDD only proves the code matches the spec. Explore is what made the spec correct.**

Plan mode changed what I review. Instead of reading a large diff after the fact, I read a one-page plan with every file, every test, and a 16-commit sequence before any code existed. Small decisions I would have missed in a diff were visible up front, like putting the error message in a component so coverage would measure it. Implement then became mostly mechanical, and the git history reads like the plan.

The cost is time and prompting discipline. Explore and Plan took about 15 minutes before the first line of code, which is too much for a one-line fix. My rule going forward: use the full four phases when the feature depends on facts outside the codebase or has more than one reasonable design, and skip straight to TDD otherwise.

### What context management strategies worked best

1. **`/clear` between unrelated tasks.** After Part 1 (rewriting CLAUDE.md) I cleared before starting the chart. CLAUDE.md and the imported PRD reload automatically, so nothing important was lost and the CLAUDE.md wording discussion stopped taking up space.
2. **`/compact` with a focus instruction.** Before F2 I ran `/compact focus on F2 next; keep TDD commit format`. The summary kept the files and conventions F2 needed, and the TDD run that followed stayed on format for 12 commits.
3. **`claude --continue` as a status check.** Resuming and asking "what's done and what's left" gave an accurate summary and caught that 38 commits had never been pushed. My partner was about to clone the repo, so this mattered.
4. **CLAUDE.md as the context that survives everything.** The `@AGENTS.md` import pointed Claude to the bundled Next.js 16 docs when the first build failed. The settings file made Claude ask before installing a library instead of adding it.

What didn't work: I ran `/clear` before exporting the Part 1 session, so I had to rebuild that log from the raw transcript. Export first, then clear. I also found that **my prompts override CLAUDE.md**: my F2 prompt used a different commit-message format than CLAUDE.md, and Claude followed the prompt. Claude also invented a practice (placeholder functions in red commits) that CLAUDE.md doesn't mention. Both went into CLAUDE.md v1.1 so the rules file and my prompts agree.

### Results

- F1 fingering chart: 2 explore commits, 1 plan commit, 17 implementation commits.
- F2 note detection: 5 red/green pairs plus 2 refactors, every failing test committed before its code.
- 136 tests, 100% line coverage and 97.6% branch coverage over `src/lib` and `src/components`.

## Kishan
Annotated log: [session-log-kishan.md](session-log-kishan.md).

### How Explore → Plan → Implement → Commit compared to my previous approach

On LoopLab I already worked from planning artifacts (PRD, mockup, rules file, issues with acceptance criteria), and tests usually came first: a failing-test commit with stubs (`c7d09e1`) came before the code that passed it (`1bce5b9`). The weak spots were scope and consistency. PRs grew past our 400-line guideline (about 690 lines for #11 and 1,050 for #9), and commits made in GitHub's web editor slipped to defaults like "Update standups.md."

For F1 AC6, the new part was a separate Explore step, which mattered because I was coming into Nicholas's codebase cold. It found that AC6 wasn't in the PRD yet, and that putting the Hz inside the `<h2>` would break an existing F1 AC5 test that matches the heading exactly. Plan mode put both options side by side before any code existed, so I chose a separate element and left the old test untouched. **Explore told me what I'd break; Plan let me decide before breaking it.** Each phase got its own commit and the PR covered one acceptance criterion, so it stayed small. Red showed 3 tests failing for the right reason, green changed one file with no test edits, and Claude confirmed the refactor kept the error strings byte-identical, since the F2 tests only match them loosely.

There was some friction. The session had no Glob/Grep tools, so Claude explored with shell `find` and `grep`. A fresh clone also needed `npm ci --legacy-peer-deps` and `npx next typegen` before the baseline passed. Neither step is in the README, so I noted both in the PR.

### What context management strategies worked best

1. **CLAUDE.md, the PRD, and HANDOFF.md as onboarding.** They gave me the conventions (AC names in `describe` blocks, typecheck and lint before green commits) without asking Nicholas anything.
2. **`/compact` before `/export`.** That kept the log focused. Following Nicholas's lesson, I exported before clearing.
3. **`/clear` before the PR review.** The fresh session didn't trust my earlier one. It checked out the red and green commits and re-ran every check itself.
4. **Shared permission rules.** `git push` and `gh pr create` overrode auto mode and asked me first, so every step that touched the remote got a human check.

### Results

- F1 AC6: explore, plan, PRD, red, green and refactor commits, plus the session log, merged via PR #1 with a merge commit so the history stays visible.
- 141/141 tests passing; coverage unchanged at 100% lines and 97.6% branches.
