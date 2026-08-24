# cyberpunk.church

A clean Jekyll blog shell using the Hacker theme.

Add new posts under `_posts/` with filenames like `2026-08-16-first-post.md`.

## Argument graphs

Posts can optionally include one interactive argument graph. Graphs are authored as readable YAML in `_arguments/`, validated and compiled to normalized JSON in `assets/argument-graphs/`, and rendered with Cytoscape.js.

The layers are intentionally separate:

1. `_arguments/*.yml` — author-edited source
2. `lib/argument_graph.rb` — YAML loader, normalized model validation, and post-reference checks
3. `assets/argument-graphs/*.json` — generated canonical JSON for the browser and future non-visual consumers
4. `_javascript/argument-graph.js` — reusable Cytoscape visualization and inspector
5. `_includes/argument-graph.html` — Jekyll integration

The canonical schema is documented in `_schemas/argument-graph.schema.json`.

### Add a graph to a post

Create `_arguments/my-post.yml`:

```yaml
version: 1
id: my-post
title: My argument

nodes:
  - id: central-question
    type: question
    title: What are we trying to explain?
    epistemics:
      status: open
      belief:
        type: unknown

  - id: first-observation
    type: evidence
    title: An observation relevant to the question

edges:
  - id: observation-supports-question
    from: first-observation
    to: central-question
    type: supports
```

Node types are `question`, `claim`, `hypothesis`, `evidence`, `objection`, `assumption`, and `conclusion`.

Relationship types are `supports`, `attacks`, `contradicts`, `entails`, `assumes`, `depends-on`, `explains`, and `alternative-to`. Use `entails` only for a logical consequence; use `supports` when something merely provides evidence or makes another node more plausible.

Reference the graph in the post's frontmatter:

```yaml
argument_graph: my-post
```

Then compile and validate it:

```sh
npm run arguments:build
```

Graphs are optional. A post without `argument_graph` renders exactly as before.

### Development commands

```sh
npm install
npm test
npm run build
```

`npm test` checks the validator, JavaScript syntax, post references, and whether committed JSON is current. `npm run build` regenerates argument JSON and the browser bundle before running Jekyll.
