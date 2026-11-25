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

_(Kishan adds his section here: his F1 AC6 cycle, and what helped most coming into the repo cold.)_
