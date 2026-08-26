---
layout: post
title: "When Worlds Make Worlds"
date: "2026-08-20"
section: "Reproductive Reality"
order: 1
argument_graph: epistemic-map
argument_graph_view: when-worlds-make-worlds
tags:
  - Simulation
  - Measure
---

Bostrom's Simulation Argument contains an intuition that survives every complication: once minds can be constructed, a civilization might produce many more observer-histories than biology produced on the way to that civilization.

Call this the **replication advantage**.

Against it stands an equally simple constraint: every constructed history requires a physical implementation. It consumes some combination of energy, matter, time, memory, and error correction.

Call this the **reproduction cost**.

> [The important contest is descendant observer measure versus the physical cost of producing it.](#argument-map?node=world-reproduction){:.mapped-claim}

## The intuitive reproduction rate

For one kind of world, we can imagine a rough ratio:

```text
R_sim = descendant observer-history measure
        -----------------------------------
           parent observer-history measure
```

[Cheap replication can give constructed observers a numerical advantage.](#argument-map?node=simulation-replication-advantage){:.mapped-claim} But [finite resources can keep that advantage small or drive it below replacement.](#argument-map?node=physical-reproduction-cost){:.mapped-claim}

The numerator is deliberately not “number of simulations.” A short empty world, a frozen copy, and a civilization containing billions of persistent conscious lives should not be treated as equal outputs. The units must match whatever observer-history measure we eventually defend.

## Worlds can produce different kinds of worlds

A single ratio is not enough when a host with laws `theta_i` can implement children with different laws `theta_j`.

Define:

```text
K_ij = expected descendant observer-history measure
       in worlds with laws theta_j
       produced per unit of parent observer-history measure
       in worlds with laws theta_i
```

> [A reproduction kernel records both how much observer measure a world produces and which kinds of worlds receive it.](#argument-map?node=reproduction-kernel){:.mapped-claim}

The kernel can incorporate many bottlenecks without pretending they are independent: the probability intelligence develops, whether it survives, its accessible resources, the cost of computation, the possibility of artificial consciousness, and the purposes for which it constructs worlds.

This is the formal version of simulation fertility. The units come before the matrix.

## Recursion changes the result

Constructed civilizations may construct further worlds. If `m_n` is the observer-measure distribution at depth `n`, a simplified model evolves as:

```text
m_(n+1) = m_n K
```

[Nested simulations form a branching process, so total measure depends on reproduction across the entire tree rather than the existence of a single simulated layer.](#argument-map?node=recursive-observer-reproduction){:.mapped-claim}

In a finite, stationary toy model, the spectral radius of `K` gives a useful dividing line:

```text
spectral radius(K) < 1  -> descendant measure tends to converge
spectral radius(K) > 1  -> descendant measure can grow without bound
```

[Whether recursive observer measure converges is a property of reproduction rates and the measure—not of depth by itself.](#argument-map?node=reproduction-convergence){:.mapped-claim}

Real models may have changing resources, nonstationary civilizations, finite lifetimes, or infinite measures. The toy criterion is not a cosmological result. It shows which quantity a serious model must constrain.

## Short descriptions can be expensive to run

One earlier intuition was that deeper simulations should receive lower prior probability because they require longer descriptions. That need not follow.

“Run this world-generator recursively one more time” may add almost nothing to a program's description. Executing the additional world may still require enormous resources.

> [Description complexity and physical execution cost are separate constraints.](#argument-map?node=description-execution-distinction){:.mapped-claim}

Algorithmic priors may tell us how much prior weight to give a compact generative rule. Resource accounting tells us whether that rule can actually produce the observer histories it describes. Neither substitutes for the other.

We now have the pieces needed to ask when adding more worlds changes anthropic odds. The answer is not “always” and not “never.” It depends on whether reproduction is differential.
