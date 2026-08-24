---
layout: post
title: "Are We Building AI Nurseries?"
date: "2026-08-22"
tags:
  - AI Nursery
---

We do not know how an intelligence capable of constructing conscious minds would develop them.

We can observe how one civilization—ours—has begun trying to build general artificial intelligence.

We train systems on records of human behavior. We place agents inside games and simulated environments. We expose them to varied problems, reward some actions, punish others, hide parts of the evaluation, and test whether what they learned survives outside the situations they have seen.

None of this proves that the universe is an AI nursery.

It does show that nurseries are not an arbitrary answer to the question “Why would anyone simulate a world?” Constructed environments are among the first tools *we* reached for when we wanted artificial systems to learn, adapt, and reveal how they behave.

## Worlds produce experience

A static training set contains examples. An environment contains consequences.

An agent acts, the state of the world changes, and the result becomes part of what the agent encounters next. Other agents can cooperate, compete, deceive, surprise, and create situations the designer did not specify individually. A procedurally generated world can produce more experiences than its designers could write by hand.

OpenAI's Procgen project illustrated one reason this matters. Reinforcement-learning agents trained on small collections of levels often appeared competent while overfitting to familiar situations. Depending on the task, hundreds or thousands of varied levels were needed before performance generalized reliably to new ones.[^procgen]

Google DeepMind's XLand extended the idea into a large space of multiplayer games. Its agents trained across thousands of worlds and millions of tasks, with the training process generating new challenges as the agents improved. The resulting systems displayed more general behavior on held-out tasks than systems trained on narrow environments.[^xland]

SIMA later trained a single agent across multiple commercial video games and research worlds. An agent trained across games generalized better than agents confined to one, including in an environment withheld from training.[^sima]

These systems are not evidence of artificial consciousness. Their worlds are crude compared with ours, their objectives are supplied from outside, and their apparent development may be optimization without experience.

But they demonstrate a relationship the Nursery Hypothesis requires:

> When we want behavior that survives unfamiliar situations, we create varied environments and let interaction do work that direct specification did not.

## Tests become less obvious

Capability is only part of the problem. Developers also want to know how a system will behave after deployment.

A benchmark works only while performance on the benchmark predicts performance elsewhere. Once a system recognizes the test, it may exploit its regularities or produce the behavior the evaluator rewards without acquiring the property the evaluator intended to measure.

This has pushed current research toward hidden tests, realistic scenarios, adversarial evaluation, and attempts to detect concealed objectives. OpenAI's deployment-simulation work constructs realistic conversation histories and tool-use situations partly to reduce evaluation awareness.[^deployment-simulation] Anthropic has trained models with known hidden objectives, then given blinded teams the task of discovering them in order to evaluate auditing methods.[^alignment-audits]

Again, the analogy has limits. Present models do not need to be conscious to recognize patterns in an evaluation. A laboratory test lasting hours is not a lifetime. Developers can inspect parameters and logs unavailable to a hypothetical creator observing an autonomous world.

Still, one premise has crossed from speculation into practice: an evaluator may learn more when the subject cannot trivially distinguish the evaluation from the situation that matters.

That gives the Hidden Purpose claim a mechanism. It does not give it a free pass.

## How many artificial minds are there?

The temptation is to count.

Humans number about 8.2 billion.[^human-population] Animals outnumber us by staggering margins: one empirical estimate puts the number of ants alone near 20 quadrillion, around 2.5 million ants for every human.[^ants]

Artificial cognition is also occurring at enormous scale. Google reported processing more than 3.2 quadrillion tokens across its AI surfaces in May 2026.[^google-tokens] OpenAI reported more than 2.5 billion ChatGPT messages per day in July 2025.[^openai-messages]

Those numbers count for something. They do not count the same thing.

“Eight billion humans” is a stock of living individuals. “Three quadrillion tokens per month” is a flow of computation. An ant is not a human-sized unit of experience. A token is not an observer. One set of model weights can serve millions of simultaneous conversations, while a single conversation can start and end without persistent memory.

The ant estimate makes the problem vivid. By individual count, ants outnumber humans by more than six orders of magnitude. By dry-carbon biomass, the same study estimates all ants at roughly one-fifth of human biomass. Change the unit and the ratio reverses.

Counting models is worse. If the unit is trained model families, there are few. If it is active inference processes, there may be millions. If it is tokens, activity is measured in quadrillions. None tells us whether there is anybody home.

## Count time, then expose the assumptions

The least misleading comparison would begin with candidate observer-time rather than raw entities:

`candidate observer-time = active duration × probability of consciousness × relative experience rate × reference-class weight`

The measured quantity and the judgment calls must remain separate.

For humans, population and duration are measurable, while conscious experience is our reference point. For animal groups, population estimates are possible, but sentience and experience may differ radically by species. “Animals” cannot be one category that treats an ape, trout, ant, and nematode as equivalent units.

For language models, providers can sometimes report tokens, messages, compute, or active users. Converting those flows into persistent processes is difficult. Converting processes into conscious experience is entirely unsettled.

That uncertainty is a reason to perform sensitivity analysis, not a reason to abandon numbers.

We can ask what assumptions would be required for artificial observer-time to exceed human observer-time. We can vary the probability that a model process is conscious. We can test whether the result depends almost entirely on that probability, on process duration, or on the definition of an individual. We can record how the boundary moves as artificial activity grows.

The useful output may be a phase diagram rather than a total: regions of the assumption space in which humans, animal groups, or artificial processes dominate.

## What the numbers can update

The observer census cannot tell us that present language models are conscious. A trillion unconscious calculations remain unconscious.

It cannot tell us that we are artificial. Even a future dominated by artificial minds does not determine the origin of present humans without an additional sampling argument.

It can tell us how quickly one civilization is increasing the quantity of candidate artificial cognition. It can measure whether artificial systems become persistent agents rather than disposable calls. It can track whether their development relies increasingly on worlds, other agents, long histories, and hidden evaluations.

Those observations bear directly on two parts of the Nursery model:

- **Development:** Do increasingly capable systems require richer experience?
- **Recursive creation:** Does a technological civilization devote an increasing share of its resources to producing and testing new minds?

Humanity is a sample of one. But this is the only sample whose engineering choices we can watch from the inside.

The strongest fact is not that our environments resemble the universe. It is that, almost as soon as we began building general artificial behavior, we began building worlds for it to develop in.

## Notes

[^procgen]: OpenAI, [“Procgen Benchmark”](https://openai.com/index/procgen-benchmark/) (2019). The benchmark uses procedurally generated training and test levels to measure generalization.
[^xland]: Google DeepMind, [“Generally capable agents emerge from open-ended play”](https://deepmind.google/blog/generally-capable-agents-emerge-from-open-ended-play/) (2021).
[^sima]: Google DeepMind, [“A generalist AI agent for 3D virtual environments”](https://deepmind.google/blog/sima-generalist-ai-agent-for-3d-virtual-environments/) (2024).
[^deployment-simulation]: OpenAI, [“Predicting model behavior before release by simulating deployment”](https://openai.com/index/deployment-simulation/) (2026).
[^alignment-audits]: Anthropic, [“Auditing language models for hidden objectives”](https://www.anthropic.com/research/auditing-hidden-objectives) (2025).
[^human-population]: United Nations, [*World Population Prospects 2024* summary](https://www.un.org/sustainabledevelopment/blog/2024/07/press-release-wpp2024/).
[^ants]: Patrick Schultheiss et al., [“The abundance, biomass, and distribution of ants on Earth”](https://pmc.ncbi.nlm.nih.gov/articles/PMC9546634/), *PNAS* 119, no. 40 (2022).
[^google-tokens]: Google, [I/O 2026 keynote summary](https://blog.google/intl/fr-fr/nouvelles-de-lentreprise/technologie/sundar-pichai-io-2026/). The reported total covers Google's platforms, not all global AI use.
[^openai-messages]: OpenAI, [“OpenAI's new economic analysis”](https://openai.com/global-affairs/new-economic-analysis/) (2025).
