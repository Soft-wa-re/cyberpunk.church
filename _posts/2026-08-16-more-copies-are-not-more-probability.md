---
layout: post
title: "More Copies Are Not More Probability"
date: "2026-08-16"
section: "Foundations"
order: 1
argument_graph: epistemic-map
argument_graph_view: more-copies-are-not-more-probability
tags:
  - Anthropics
  - Measure
---

Nick Bostrom's Simulation Argument begins with multiplication.[^bostrom]

If civilizations can create conscious ancestor simulations, and if they create very many of them, simulated observers could outnumber the original observers. The numerical pressure is easy to feel: if almost everyone with experiences like yours is simulated, why expect to be among the few originals?

But a population is not yet a probability distribution.

The missing step is the foundation of everything that follows.

> [More copies do not by themselves determine which observer-instantiation we should expect to be.](#argument-map?node=multiplicity-not-probability){:.mapped-claim}

## Reality may make copies in many ways

Simulation is only one possible source of observer multiplicity.

An enormous universe may contain spatially separated observers with the same local evidence. Quantum theories may contain multiple future outcomes. Cosmological processes may produce multiple universes. Biological reproduction produces related observers. Constructed worlds may produce artificial observers. Some mathematical ontologies contain every suitable structure without requiring any one of them to be generated from another.

[Reality may therefore generate observers compatible with our evidence through several different mechanisms.](#argument-map?node=observer-multiplicity){:.mapped-claim}

That creates a self-location problem:

> Given all observer-instantiations compatible with what I know, where should I expect to be?

Saying "where there are more copies" only postpones the question. More according to which unit? Physical bodies? Conscious moments? Computations? Branch weight? Persistent lives? Perfect duplicates? Similar observers? How are short lives compared with long ones? How are biological and artificial implementations compared?

A raw count silently answers all of those questions at once.

## Every count contains a measure

Suppose a model contains one biological observer and one thousand artificial observer processes. The statement does not yet imply odds of one thousand to one.

We still need to know:

- whether the artificial processes are conscious;
- whether simultaneous processes are distinct observers;
- whether they persist long enough to count as histories rather than isolated states;
- whether unlike implementations belong in the same reference class;
- whether all qualifying instances receive equal weight.

These are not small corrections to the count. They determine what the count means.

The same lesson appears in Everettian quantum mechanics. The existence of multiple branches does not license naive equal branch counting. Work on self-locating uncertainty in Everettian theories treats the weighting rule—rather than branch existence—as the central probability problem.[^everett-measure]

> [Self-location requires a measure over the compatible observers or histories.](#argument-map?node=measure-required){:.mapped-claim}

Call that measure `mu`. If `H` is a candidate observer-history and `E` is our evidence, the structure we eventually need looks like:

```text
P(H | E, model) ∝ mu_model(H) × P(E | H, model)
```

This is not a solution. It is an accounting identity that exposes the missing assumptions.

## When multiplicity really is neutral

There is a tempting response: perhaps multiplication never matters. If every possible world is duplicated a million times, the normalized proportions remain the same.

That is true in the special case where the multiplication is independent of the property being inferred.

If red and blue balls are both duplicated by the same factor, their ratio does not change. If red balls reproduce more rapidly than blue balls, it does.

The same rule applies to worlds.

> **Differential Multiplicity Principle:** multiplicity changes an anthropic probability whenever the mechanism producing multiplicity correlates with production of the observer measure relevant to that probability.

The neutral case requires the multiplicity mechanism to be conditionally independent of observer fertility under the model, evidence, and seed measure being used. Equal multiplication is the simplest example.

[Neutral multiplicity is therefore an independence condition, not the default effect of having many worlds.](#argument-map?node=neutral-multiplicity){:.mapped-claim}

Suppose universes with one set of laws rarely produce intelligence, while universes with another set produce civilizations that construct vast numbers of observer-containing worlds. A multiverse mechanism that favors one law set over the other changes the eventual observer distribution.

[Multiplicity is no longer neutral when it correlates with observer reproduction.](#argument-map?node=differential-multiplicity){:.mapped-claim}

This is why physical laws, computation costs, civilization formation, and recursive simulation will matter later. They determine not merely how many worlds exist, but how much descendant observer measure different worlds can produce.

## Bostrom is one special case

Bostrom supplies an important pressure: constructed minds might be replicated in numbers that overwhelm the original population.

But his argument does not settle:

- the measure over observers;
- the cost of producing each observer-history;
- the depth of recursive construction;
- whether host and simulated physics match;
- whether "base" observers receive any prior advantage;
- whether the relevant unit is an observer, a moment, or a history.

Those are not objections that make population reasoning useless. They show us what must be formalized before it can carry the weight placed on it.

The next question is therefore not how many simulated people there might be.

It is: **what exactly receives measure?**

[^bostrom]: Nick Bostrom, [“Are You Living in a Computer Simulation?”](https://simulation-argument.com/simulation/) (2003).
[^everett-measure]: Charles T. Sebens and Sean M. Carroll, [“Self-Locating Uncertainty and the Origin of Probability in Everettian Quantum Mechanics”](https://arxiv.org/abs/1405.7577) (2014). The paper argues for a particular Everettian probability rule; it is cited here for the narrower lesson that branch multiplicity does not justify naive equal counting.
