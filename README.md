# cyberpunk.church

A clean Jekyll blog shell using the Hacker theme.

Add new posts under `_posts/` with filenames like `2026-08-16-first-post.md`.

## Argument graphs

The site's claims live in one canonical, human-editable graph: `_arguments/epistemic-map.yml`. It is validated and compiled to normalized JSON in `assets/argument-graphs/`, then rendered with Cytoscape.js. The full graph appears at `/argument-map/`; each post can select a smaller named view of that same graph.

The layers are intentionally separate:

1. `_arguments/epistemic-map.yml` — author-edited source of truth, including named views
2. `lib/argument_graph.rb` — YAML loader, normalized model validation, and post-reference checks
3. `assets/argument-graphs/*.json` — generated canonical JSON for the browser and future non-visual consumers
4. `_javascript/argument-graph.js` — reusable Cytoscape visualization and inspector
5. `_includes/argument-graph.html` — Jekyll integration

The canonical schema is documented in `_schemas/argument-graph.schema.json`.

### Extend the graph for a post

Add nodes and edges to `_arguments/epistemic-map.yml`:

```yaml
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

Then add a named view containing the nodes the post should show. A view is an induced subgraph: every canonical edge whose endpoints are both listed is included automatically.

```yaml
views:
  - id: my-post
    title: My post's argument
    description: The portion of the canonical map used by this essay.
    nodes:
      - central-question
      - first-observation
```

Node types are `question`, `claim`, `hypothesis`, `evidence`, `objection`, `assumption`, and `conclusion`.

Relationship types are `supports`, `attacks`, `contradicts`, `entails`, `assumes`, `depends-on`, `explains`, and `alternative-to`. Use `entails` only for a logical consequence; use `supports` when something merely provides evidence or makes another node more plausible.

Reference the canonical graph and view in the post's frontmatter:

```yaml
argument_graph: epistemic-map
argument_graph_view: my-post
```

Then compile and validate it:

```sh
npm run arguments:build
```

Graphs are optional. A post without `argument_graph` renders exactly as before. Omitting `argument_graph_view` displays the full canonical graph, which is how the `/argument-map/` page works.

### Development commands

```sh
npm install
npm test
npm run build
```

`npm test` checks the validator, JavaScript syntax, post references, and whether committed JSON is current. `npm run build` regenerates argument JSON and the browser bundle before running Jekyll.
