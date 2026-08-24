---
layout: post
title: "How Would We Keep Score?"
date: "2026-08-24"
section: "AI Nursery"
argument_graph: epistemic-map
argument_graph_view: how-would-we-keep-score
tags:
  - AI Nursery
---

Eventually every discussion of simulation theory reaches a number.

Ten percent. Fifty percent. Ninety-nine point nine.

The number arrives long before its units.

The Alignment Nursery Hypothesis is not ready for one probability. It is a chain of propositions, and our observations update different links by different amounts.

The first useful calculation is therefore not the probability that the hypothesis is true.

It is a map of what would have to be true first.

## Ten separate claims

We can track ten propositions:

- **C — Engineered consciousness:** A creator can deliberately instantiate a conscious mind.
- **D — Development:** Experience inside an environment materially contributes to what an artificial mind becomes.
- **A — Artificial inhabitants:** We are artificial minds rather than biological originals or historical reconstructions.
- **N — Nursery:** Our environment was constructed or selected for our development.
- **S — Safety pressure:** Greater capability and access increase the cost of unsafe deployment enough to justify extraordinary assurance.
- **J — Joint production:** One rich environment can economically combine development or refinement with safety evaluation.
- **E — Evaluation realism:** Direct inspection and recognizable tests become less predictive under novel, long-horizon, high-capability conditions.
- **H — Hidden information:** Concealing criteria, test boundaries, purpose, or the environment's nature preserves safety-relevant evidence.
- **G — Gated deployment:** Greater freedom, capability, or access remains conditional on an adequate safety case.
- **L — Alignment Nursery:** Our Nursery uses that combined process to develop and establish the safety of new intelligences before wider deployment.

The broad AI Nursery requires C, D, A, and N. The strict Alignment Nursery adds S, J, E, some justified portion of H, and G.

These are not one evidence bucket.

Varied training environments can support D without supporting A or N. Capability-scaled safeguards can support S and G without showing that our world was constructed. Alignment faking can support E while leaving the stronger claim—that the nature of reality must be hidden—almost untouched.

Recursive creation may still be an interesting milestone. It is not part of the strict definition unless we specify why producing another generation is required for development or deployment.

## Record the mechanism

An evidence entry needs more than columns labeled *for* and *against*.

Every entry should answer:

**What did we observe?**

State the observation without the hypothesis. “Developers increased deployment restrictions after a model crossed a capability threshold” is an observation. “Developers built an Alignment Nursery” is an interpretation.

**Which claim can it update?**

Name C, D, A, N, S, J, E, H, G, or L. Do not allow evidence for an upstream engineering pressure to leak into the claim that we inhabit a constructed world.

**What is the mechanism?**

Explain why the claim predicts the observation. Similarity is not a mechanism. Our world resembling a training environment matters only if a creator has a reason to produce that feature.

**What do the alternatives predict?**

Natural development, ancestor simulation, research simulation, and a non-alignment Nursery may predict the same result.

**What would move the claim down?**

Record the negative update before seeing it. A theory that only knows how to rise is not an empirical model.

**When did we record it?**

Timestamp the prediction and preserve revisions.

## A directional ledger

The present update rules can be stated without fake likelihood ratios:

| Claim | Moves up when | Moves down when |
| --- | --- | --- |
| D — Development | Rich, persistent experience remains important as capability grows | Capable minds can be directly specified or trained without meaningful environmental interaction |
| S — Safety pressure | Estimated harm, control difficulty, and assurance effort rise with capability and access | Risk and control costs remain flat as capability grows |
| J — Joint production | Training and safety evaluation increasingly share realistic environments and histories | Development and assurance remain cheaply separable |
| E — Evaluation realism | Recognizable tests miss deployment behavior; evaluation awareness grows with capability or horizon | Transparent compact tests remain predictive under novel, high-stakes conditions |
| H — Hidden information | Blinding specific information measurably improves prediction of deployment behavior | Awareness has little effect, or hiding only a cheaper layer is sufficient |
| G — Gated deployment | Greater autonomy and access require stronger safety cases | Access expands independently of safety evidence, even after serious failures |
| C — Consciousness | Implementable consciousness indicators gain empirical support | Consciousness requires processes unavailable to engineered systems |
| A / N — Our origin | An observation is substantially more expected if we are artificial and developed here | Natural development continues to explain every observation equally well or better |

Current frontier practice gives preliminary upward evidence for S, E, and G: developers connect safeguards to capability thresholds and use deployment-like evaluation to reduce evaluation-awareness effects.[^preparedness][^deployment-simulation] That evidence is narrow. It does not justify an automatic update to A, N, or L.

## Use numbers without laundering uncertainty

Some observations support numerical estimates. They still need units.

Suppose we compare humans, animal groups, and language-model processes. We can measure human population, estimate animal populations, and collect partial reports of AI messages, tokens, active instances, or compute. Those values describe different things.

A conversion to candidate observer-time might look like:

`active duration × consciousness probability × relative experience rate × reference-class weight`

Only part of that expression is empirical. Consciousness probability and reference-class membership are judgments. Experience rate may not be a coherent scalar across radically different minds.

Keep the raw quantities separate. Then vary the uncertain conversions and locate where the conclusion changes.

If artificial processes dominate only when we assign a 90 percent probability of LLM consciousness, consciousness is the crux. If they dominate at one chance in a million because persistent artificial activity has become enormous, scale is doing real work. If the result depends on whether insects enter the reference class, the word *observer* is hiding the model.

That census bears on the abundance and possible reference class of artificial cognition. It does not directly test S, J, E, H, or G. Safety investment should be measured separately: compute, labor, evaluation depth, duration, deployment restrictions, and the access withheld pending assurance.

## What the notebook should show

The argument graph should make the causal boundaries visible:

- which conclusions depend on which claims;
- where observations enter;
- which edges are logical, evidential, or merely explanatory;
- which specific result would raise or lower each node;
- which claims concern rational Nursery design and which concern our own origin.

The evidence ledger should preserve sources, mechanisms, alternatives, confidence, cruxes, timestamps, and revisions—including evidence against the hypothesis.

The prediction ledger should record what we expected before the next generation of systems arrived. For the safety mechanism, that means tracking capability, autonomy, evaluation realism, evaluation awareness, safety expenditure, deployment gates, and post-deployment failures over time.

Epistemic values should remain displayed rather than automatically propagated. A probability on S cannot become a probability on L until the other dependencies and the relevant update rules are defensible.

## The number we want comes last

The Alignment Nursery is now more specific than the broad AI Nursery.

It proposes a motive: unsafe deployment is expensive.

It proposes an economy: development and safety evaluation share one rich environment.

It proposes an evaluation pressure: capable agents make recognizable tests less reliable.

It proposes a consequence: wider access is gated on safety evidence.

Each claim can rise or fall as we build artificial systems ourselves. Even if all four gain support, the conclusion that *our world* is such a Nursery remains a separate inference.

That separation is the point of keeping score.

The goal is not to make the final number large.

The goal is to know exactly what could change our minds.

## Notes

[^preparedness]: OpenAI, [“Our updated Preparedness Framework”](https://openai.com/index/updating-our-preparedness-framework/) (2025); Anthropic, [“Responsible Scaling Policy”](https://www.anthropic.com/responsible-scaling-policy); and Google DeepMind, [“Introducing the Frontier Safety Framework”](https://deepmind.google/blog/introducing-the-frontier-safety-framework/) (2024).
[^deployment-simulation]: OpenAI, [“Predicting model behavior before release by simulating deployment”](https://openai.com/index/deployment-simulation/) (2026).
