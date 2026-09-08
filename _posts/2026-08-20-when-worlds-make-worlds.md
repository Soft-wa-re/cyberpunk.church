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
R_sim = direct-child observer-history measure
        -------------------------------------
             parent observer-history measure
```

[Cheap replication can give constructed observers a numerical advantage.](#argument-map?node=simulation-replication-advantage){:.mapped-claim} But [finite resources can keep that advantage small or drive it below replacement.](#argument-map?node=physical-reproduction-cost){:.mapped-claim}

The numerator is deliberately not “number of simulations.” A short empty world, a frozen copy, and a civilization containing billions of persistent conscious lives should not be treated as equal outputs. The units must match whatever observer-history measure we eventually defend.

## Worlds can produce different kinds of worlds

A single ratio is not enough when a host with laws `theta_i` can implement children with different laws `theta_j`.

Define:

```text
K_ij = expected direct-child observer-history measure
       in worlds with laws theta_j
       produced per unit of parent observer-history measure
       in worlds with laws theta_i
```

> [A reproduction kernel records both how much observer measure a world produces and which kinds of worlds receive it.](#argument-map?node=reproduction-kernel){:.mapped-claim}

The kernel records one reproductive step. Its powers generate later descendants, so including grandchildren inside `K` would count them again. The kernel can incorporate many bottlenecks without pretending they are independent: the probability intelligence develops, whether it survives, its accessible resources, the cost of computation, the possibility of artificial consciousness, and the purposes for which it constructs worlds.

This is the formal version of simulation fertility. The units come before the matrix.

## Recursion changes the result

Constructed civilizations may construct further worlds. If `m_n` is the expected observer-measure distribution at depth `n`, a simplified model evolves as:

```text
m_(n+1) = m_n K
```

[Nested world genealogies can be represented by a branching model only when their one-step outputs satisfy the model's independence and stationarity assumptions.](#argument-map?node=recursive-observer-reproduction){:.mapped-claim} Even without those stochastic assumptions, total measure still depends on reproduction beyond a single constructed layer.

The word *expected* matters. As written, `K` defines only the first moment of a linear measure model. It does not define a stochastic process. Before asking about survival or variance, we would need a probability law over direct-child outputs and assumptions about independence across parents and generations. In a standard branching process with those extra ingredients, a supercritical population can still become extinct in a particular realization even while its expectation grows.[^branching-process]

### Question one: is the unnormalized total finite?

In a finite, stationary linear model, the spectral radius of `K` gives the exact dividing line for the full matrix series:[^matrix-series]

```text
spectral radius(K) < 1  -> I + K + K^2 + ... converges
spectral radius(K) = 1  -> the series does not converge
spectral radius(K) > 1  -> the series does not converge and expanding modes grow
```

For a particular starting distribution `m_0`, only the part of the kernel reachable from `m_0` matters. In the standard nonnegative case, if an accessible reproductive mode has spectral radius at least one, its infinite descendant sum fails to converge without an additional cutoff or weighting rule.

[Whether recursive observer measure converges is a property of reproduction rates and the measure—not of depth by itself.](#argument-map?node=reproduction-convergence){:.mapped-claim}

### Question two: do normalized proportions settle?

Divergent total measure does not imply that every summary diverges. In a primitive multitype Galton-Watson count model, normalized type proportions can approach the Perron-Frobenius eigenvector even while absolute population grows without bound.[^branching-process] An analogous result for observer measure would require a justified additive quantity and a stochastic reproduction law. In the deterministic matrix toy model, Perron-Frobenius theory can still identify the dominant direction of expected measure under suitable regularity conditions.

It does not produce an anthropic measure by itself. Normalizing each generation answers which types dominate *within that generation*. Sampling from all generations still requires a rule for weighting depth or physical time. A depth cutoff, a time cutoff, and a resource cutoff can select different populations. Reducible or periodic kernels may also fail to approach one stable composition.

Real models may have changing resources, nonstationary civilizations, finite lifetimes, or infinite measures. Shared finite resources can make reproduction density-dependent, so a constant linear kernel may describe only an early regime.[^carrying-capacity] The model may need a physical cutoff, discount, saturation law, or explicit sampling rule. "Normalize the infinity" is not yet such a rule.

The toy criterion therefore establishes a boundary, not a cosmological result: it separates convergence of an unnormalized matrix sum, asymptotic type composition, stochastic survival, and the still-open choice of observer measure.

## Short descriptions can be expensive to run

One earlier intuition was that deeper simulations should receive lower prior probability because they require longer descriptions. That need not follow.

“Run this world-generator recursively one more time” may add almost nothing to a program's description. Executing the additional world may still require enormous resources.

> [Description complexity and physical execution cost are separate constraints.](#argument-map?node=description-execution-distinction){:.mapped-claim}

Algorithmic priors may tell us how much prior weight to give a compact generative rule. Resource accounting tells us whether that rule can actually produce the observer histories it describes. Neither substitutes for the other.

We now have the pieces needed to ask when adding more worlds changes anthropic odds. The answer is not “always” and not “never.” It depends on whether reproduction is differential.

[^matrix-series]: Carl D. Meyer, [*Matrix Analysis and Applied Linear Algebra*, second edition](https://doi.org/10.1137/1.9781611977448) (SIAM, 2023). The matrix geometric series converges to `(I - K)^(-1)` exactly when the finite matrix's spectral radius is below one.
[^branching-process]: Raphaël Cerf and Joseba Dalmau, [“Galton-Watson and Branching Process Representations of the Normalized Perron-Frobenius Eigenvector”](https://doi.org/10.1051/ps/2019007), *ESAIM: Probability and Statistics* 23 (2019): 797-802. For a primitive mean matrix with Perron-Frobenius eigenvalue above one, survival has positive probability and, conditional on survival, normalized type proportions converge under the paper's stated branching assumptions.
[^carrying-capacity]: Naor Bauman, Pavel Chigansky, and Fima Klebaner, [“An Approximation of Populations on a Habitat with Large Carrying Capacity”](https://doi.org/10.1007/s00285-024-02069-w), *Journal of Mathematical Biology* 88 (2024). Their density-dependent model illustrates why unconstrained Galton-Watson growth can be an initial approximation when reproduction changes as a finite carrying capacity is approached.
