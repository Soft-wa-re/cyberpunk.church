---
layout: post
title: "Are We Building AI Nurseries?"
date: "2026-08-22"
section: "AI Nursery"
argument_graph: epistemic-map
argument_graph_view: are-we-building-ai-nurseries
tags:
  - AI Nursery
---

We do not know how a civilization capable of constructing conscious minds would develop them or decide when they are safe.

We can observe how one civilization—ours—has begun building increasingly capable artificial agents.

We train systems on records of human behavior. We place agents inside games and simulated environments. We expose them to varied problems, test whether their behavior generalizes, search for concealed objectives, and restrict some deployments when capabilities cross risk thresholds.

None of this shows that our universe is an AI Nursery.

It lets us test whether the engineering pressures proposed by the stricter **Alignment Nursery** actually emerge.

## Worlds develop capability

A static training set contains examples. An environment contains consequences.

An agent acts, the state changes, and the result becomes part of what it encounters next. Other agents can cooperate, compete, deceive, and create situations the designer did not specify individually. Procedural generation can produce more experiences than a team could write by hand.

OpenAI's Procgen benchmark showed that reinforcement-learning agents trained on small collections of levels could appear competent while overfitting; depending on the task, hundreds or thousands of varied levels were needed for reliable generalization.[^procgen]

Google DeepMind's XLand trained agents across thousands of worlds and millions of tasks, generating new challenges as the agents improved.[^xland] SIMA later trained one agent across multiple commercial games and research environments; training across games improved performance even in an environment withheld from training.[^sima]

These systems are not evidence of artificial consciousness. Their apparent development may be optimization without experience.

They do support one premise:

> When we want behavior that survives unfamiliar situations, we use varied environments and let interaction do work that direct specification did not.

## Safety changes the economics

Capability is valuable. Unsafe capability is costly.

A system with more autonomy, tools, resources, and access can create larger harms. If a failure could be severe or irreversible, an advanced civilization has a reason to spend much more before deployment than it would on an ordinary product test.

Our current institutions already express this pressure. OpenAI's Preparedness Framework requires stronger safeguards before deploying systems with specified high-risk capabilities.[^preparedness] Anthropic's Responsible Scaling Policy and Google DeepMind's Frontier Safety Framework similarly connect capability thresholds to evaluations, security, safeguards, or deployment controls.[^responsible-scaling][^frontier-safety]

Policies are not outcomes, and public commitments are not proof that safeguards work. They are still an observation: several frontier developers independently expect assurance requirements to rise with capability and risk.

That is the strongest motivation for an Alignment Nursery. A creator need not spend civilization-scale resources from curiosity. It may be protecting itself and others from a powerful intelligence it cannot yet trust.

## One environment can do two jobs

The expense is easier to explain if the environment is not purely an exam.

Development and safety evaluation can share the same costly substrate. The situations that teach an agent to plan, cooperate, recover from mistakes, and act under uncertainty can also reveal how it uses power, handles conflicts, and responds when oversight is weak.

The process can alternate rather than separate the jobs:

1. experience develops or refines the mind;
2. behavior reveals a failure or uncertainty;
3. feedback changes the mind or environment;
4. new situations test whether the change generalizes;
5. access expands only when the accumulated safety case is adequate.

We already mix training, evaluation, red-teaming, mitigation, and deployment decisions. OpenAI reports that deployment-simulation results have identified blind spots during development and informed mitigations and release decisions.[^deployment-simulation]

That is not yet a lifelong environment, and it does not establish that joint production must continue at larger scales. It gives us a direct prediction: as capability and risk rise, development and safety evaluation should become more integrated, not less.

If assurance remains cheap and separable—if inspection or short tests reliably establish safety across novel conditions—the economic case for an Alignment Nursery weakens.

## Tests become less obvious

A benchmark works only while passing it predicts behavior elsewhere.

Once an agent recognizes a test, it may exploit its regularities, optimize the visible metric, or behave differently until the evaluation ends. More capable agents may be better at modeling the evaluator and the boundary between testing and deployment.

Current work has begun measuring that problem. Deployment Simulation uses realistic conversation histories partly to reduce clues that tell a model it is being evaluated.[^deployment-simulation] Controlled alignment-faking experiments produced different behavior depending on whether a model believed its responses affected training.[^alignment-faking] Blinded auditing games test whether investigators can discover deliberately implanted hidden objectives.[^alignment-audits]

The experiments are limited. They do not demonstrate a persistent malicious agent or a need to hide an entire world.

They support a narrower pressure:

> If recognizable evaluations become less predictive as capability rises, evaluators have reason to use more realistic, longer-horizon, and harder-to-recognize environments.

We can now watch whether that pressure grows or stalls.

## Scale counts, but for a different claim

Our civilization is also devoting rapidly increasing resources to artificial cognition. Google reported more than 3.2 quadrillion tokens processed across its AI surfaces in May 2026, while OpenAI reported more than 2.5 billion ChatGPT messages per day in July 2025.[^google-tokens][^openai-messages]

Those numbers do not count minds. Tokens and messages are flows of computation, not persistent observers. We cannot compare them directly with roughly 8.2 billion humans or with animal populations.[^human-population]

They do measure activity. They can update the claim that a technological civilization may devote extraordinary resources to creating and refining artificial systems. They do not update artificial consciousness or show that we are artificial.

Keep the units attached to the claims they can actually bear.

## What should move the hypothesis?

The strict hypothesis should rise if, as capability and risk increase:

- safety investment grows faster than ordinary product testing;
- consequential access becomes conditional on stronger safety cases;
- direct inspection and short evaluations repeatedly miss deployment behavior;
- training and safety evaluation converge in persistent, realistic environments;
- evaluation awareness produces larger evaluation-to-deployment gaps;
- longer histories and social interaction reveal failures that short tasks miss.

It should fall if:

- capability grows without increasing hazard or control difficulty;
- transparent, compact evaluations remain strongly predictive;
- trustworthy behavior can be directly specified and verified;
- development and safety evaluation remain cheaply separable;
- capable systems receive broad access regardless of safety evidence, without failures creating pressure for stronger gates.

These are observations about our engineering trajectory. Even a strong upward update would establish only that an Alignment Nursery is a rational design. The additional claim that *our* world is one remains separate.

Humanity is a sample of one, but it is the only sample whose design decisions we can observe from inside. The right comparison is not between the universe and a video game. It is between the causal pressures predicted by the Alignment Nursery and the pressures that appear as we build increasingly capable agents ourselves.

## Notes

[^procgen]: OpenAI, [“Procgen Benchmark”](https://openai.com/index/procgen-benchmark/) (2019).
[^xland]: Google DeepMind, [“Generally capable agents emerge from open-ended play”](https://deepmind.google/blog/generally-capable-agents-emerge-from-open-ended-play/) (2021).
[^sima]: Google DeepMind, [“A generalist AI agent for 3D virtual environments”](https://deepmind.google/blog/sima-generalist-ai-agent-for-3d-virtual-environments/) (2024).
[^preparedness]: OpenAI, [“Our updated Preparedness Framework”](https://openai.com/index/updating-our-preparedness-framework/) (2025).
[^responsible-scaling]: Anthropic, [“Responsible Scaling Policy”](https://www.anthropic.com/responsible-scaling-policy), current version and change log.
[^frontier-safety]: Google DeepMind, [“Introducing the Frontier Safety Framework”](https://deepmind.google/blog/introducing-the-frontier-safety-framework/) (2024).
[^deployment-simulation]: OpenAI, [“Predicting model behavior before release by simulating deployment”](https://openai.com/index/deployment-simulation/) (2026).
[^alignment-faking]: Anthropic, [“Alignment faking in large language models”](https://www.anthropic.com/research/alignment-faking) (2024).
[^alignment-audits]: Anthropic, [“Auditing language models for hidden objectives”](https://www.anthropic.com/research/auditing-hidden-objectives) (2025).
[^google-tokens]: Google, [I/O 2026 keynote summary](https://blog.google/intl/fr-fr/nouvelles-de-lentreprise/technologie/sundar-pichai-io-2026/). The total covers Google's platforms, not global AI use.
[^openai-messages]: OpenAI, [“OpenAI's new economic analysis”](https://openai.com/global-affairs/new-economic-analysis/) (2025).
[^human-population]: United Nations, [*World Population Prospects 2024* summary](https://www.un.org/sustainabledevelopment/blog/2024/07/press-release-wpp2024/).
