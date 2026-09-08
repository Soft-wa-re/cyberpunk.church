---
name: cyberpunk-church-research-maintainer
description: Use when maintaining research for cyberpunk.church.
version: 0.1.0
author: Thomas M. Beckenhauer, Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [research, maintenance, epistemics, cyberpunk-church]
    related_skills: []
---

# Cyberpunk Church Research Maintainer

Maintain the project's argument through one bounded, researched improvement at a time. Optimize for reduced uncertainty and a cleaner intellectual state, not output volume.

## When to Use

Use for recurring research, argument maintenance, content revision, or argument-map work in the cyberpunk.church repository.

Do not use for purely mechanical site changes that cannot affect claims, evidence, or research priorities.

## Prerequisites

- Work from the repository root.
- Use `git` and `gh` through `terminal` for branch and pull-request operations.
- Use `web_search` and `web_extract` for outside research, preferring primary and authoritative sources.
- Start with a clean working tree based on the current default branch. Preserve unrelated user changes if the tree is not clean.

## Procedure

### 1. Orient from current state

Read, in order:

1. Project instructions, including `.hermes.md` and `README.md`.
2. `outline.md`, the canonical statement of the argument.
3. `otherQuestions.md`, the living research backlog.
4. Relevant posts, `_arguments/epistemic-map.yml`, and generated graph structure.
5. Recent `git log`, plus recent diffs touching the argument or candidate area.

Use `search_files` before broad reads to locate all treatments of the candidate concept. Finish orientation only when the current claim, its dependencies, its epistemic status, and its recent history are explicit.

### 2. Select one bounded improvement

Prefer, in this order:

1. Resolve or narrow an existing uncertainty.
2. Repair a contradiction, overclaim, weak source, or missing distinction.
3. Strengthen a load-bearing section of the canonical argument.
4. Improve the backlog by consolidating, splitting, rewriting, reprioritizing, or removing stale questions.
5. Add a new topic only when existing material cannot absorb a material finding.

Write a one-sentence scope boundary before research. The task is bounded only if it can produce one coherent intellectual change and a reviewable diff.

### 3. Inspect and research before editing

Trace the issue through the outline, backlog, posts, argument graph, and cited sources. Search outside the repository only after identifying the exact uncertainty.

Prefer primary papers, official documentation, original datasets, and authoritative reference works. Cross-check load-bearing or disputed claims. Record negative results and failed hypotheses rather than searching until something supportive appears.

Classify every material statement:

- **Established evidence:** directly supported by a cited observation, result, or accepted formal theorem.
- **Inference:** a stated conclusion from evidence plus visible assumptions.
- **Speculation:** a possibility without discriminating support.
- **Project hypothesis:** a named proposition the project is testing.

Do not let analogy count as evidence. Do not introduce quantitative probabilities, automatic Bayesian propagation, or pseudo-precise scores unless the measure, units, reference class, dependencies, and assumptions justify them.

### 4. Make one coherent change

Edit only files needed for the selected issue. Preserve the distinction among evidence, inference, speculation, and project hypotheses in prose and graph metadata.

Update `outline.md` only when the canonical argument, a load-bearing qualification, or the ordering of claims genuinely changes. Make a major thesis change explicit in the pull request and mark it for human review rather than silently normalizing it.

Maintain `otherQuestions.md` as a backlog, not an accumulator. When research resolves or reframes a question, remove obsolete wording, record the narrowed remainder, merge duplicates, or split questions with different cruxes. Reprioritize by placement and explicit labels when useful.

Keep `_arguments/epistemic-map.yml`, post mapped claims, and generated graph assets consistent. Regenerate derived files rather than hand-editing them.

### 5. Verify the intellectual and technical result

Before committing, confirm:

- The selected question has a clearer answer or a more precise boundary.
- Contrary evidence and unsuccessful research are represented where material.
- No claim changed epistemic category without explanation.
- The outline and backlog reflect the result, rather than retaining stale formulations.
- The diff contains one coherent improvement and no unrelated cleanup.
- Newly written text contains no Unicode U+2014 em dash.

Run the repository's documented checks, normally `npm test`, and run `npm run build` when site rendering or generated assets changed. Inspect `git diff --check`, the complete diff, and generated-file freshness.

### 6. Submit for review

Commit on a focused branch, push it, and open a pull request. The pull request must explain:

- the chosen question or problem;
- why it was selected;
- what the research established, weakened, or failed to establish;
- the coherent change made;
- material evidence and sources;
- remaining uncertainty;
- conceptual changes requiring human judgment.

Verify the remote pull request, its head commit, changed files, and checks with `gh` before reporting completion.

## Pitfalls

- Treating compatibility with a hypothesis as evidence for it.
- Expanding the thesis while supposedly clarifying terminology.
- Appending questions without retiring or rewriting stale ones.
- Filling every gap with a new essay instead of resolving a prior uncertainty.
- Hiding a failed hypothesis or null result because it produces less prose.
- Treating a finite toy model as a result about every ontology or infinite population.
- Equating raw copies, simulations, tokens, or operations with observer measure.
- Updating generated graph JSON by hand.

## Verification

A run is complete only when the pull request is open and freshly read back from GitHub, all required checks have been executed, and the repository's canonical argument and backlog no longer contradict the improvement.
