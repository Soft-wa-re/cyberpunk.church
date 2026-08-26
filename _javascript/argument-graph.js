import cytoscape from "cytoscape";
import { computeSemanticLayout } from "./semantic-layout.mjs";

const NODE_TYPE_LABELS = {
  question: "Question",
  claim: "Claim",
  hypothesis: "Hypothesis",
  evidence: "Evidence",
  objection: "Objection",
  assumption: "Assumption",
  conclusion: "Conclusion"
};

const RELATION_PHRASES = {
  supports: "supports",
  attacks: "attacks",
  contradicts: "contradicts",
  entails: "entails",
  assumes: "assumes",
  "depends-on": "depends on",
  explains: "explains",
  "alternative-to": "is an alternative to"
};

const capitalize = (value) => value ? value.charAt(0).toUpperCase() + value.slice(1) : "";
const GRAPH_TARGET_PATTERN = /^#argument-map\?node=([a-z0-9]+(?:-[a-z0-9]+)*)$/;

function graphTargetFromHash(hash = window.location.hash) {
  return hash.match(GRAPH_TARGET_PATTERN)?.[1] || null;
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function appendMeta(container, label, value) {
  if (value === undefined || value === null || value === "") return;
  const row = element("div", "argument-graph__meta-row");
  row.append(element("dt", "", label), element("dd", "", value));
  container.append(row);
}

function beliefLabel(belief) {
  if (!belief) return null;
  if (belief.type === "probability") return `${Math.round(belief.value * 100)}%`;
  if (belief.type === "qualitative") return belief.value;
  return "Unknown";
}

function selectGraphView(canonicalGraph, viewId) {
  if (!viewId) {
    return {
      ...canonicalGraph,
      canonicalTitle: canonicalGraph.title,
      canonicalNodeCount: canonicalGraph.nodes.length
    };
  }

  const view = canonicalGraph.views?.find((candidate) => candidate.id === viewId);
  if (!view) throw new Error(`Graph view “${viewId}” does not exist.`);

  const selectedIds = new Set(view.nodes);
  const nodes = canonicalGraph.nodes.filter((node) => selectedIds.has(node.id));
  const edges = canonicalGraph.edges.filter((edge) => selectedIds.has(edge.from) && selectedIds.has(edge.to));

  return {
    ...canonicalGraph,
    title: view.title,
    description: view.description || canonicalGraph.description,
    nodes,
    edges,
    activeView: view.id,
    canonicalTitle: canonicalGraph.title,
    canonicalNodeCount: canonicalGraph.nodes.length
  };
}

function renderOverview(container, graph) {
  container.replaceChildren();
  container.append(
    element("p", "argument-graph__inspector-kicker", "Map overview"),
    element("h3", "argument-graph__inspector-title", graph.title),
    element("p", "argument-graph__inspector-body", graph.description || "Select a node to inspect its reasoning and epistemic metadata.")
  );

  const counts = element("dl", "argument-graph__meta");
  appendMeta(counts, "Nodes", String(graph.nodes.length));
  appendMeta(counts, "Relationships", String(graph.edges.length));
  if (graph.activeView) appendMeta(counts, "Canonical map", `${graph.canonicalNodeCount} nodes`);
  appendMeta(counts, "Schema", `v${graph.version}`);
  container.append(counts, element("p", "argument-graph__inspector-prompt", "Select any node in the map to examine it."));
}

function renderInspector(container, graph, node) {
  container.replaceChildren();
  container.append(
    element("p", `argument-graph__inspector-kicker argument-graph__type--${node.type}`, NODE_TYPE_LABELS[node.type]),
    element("h3", "argument-graph__inspector-title", node.title)
  );

  if (node.body) container.append(element("p", "argument-graph__inspector-body", node.body));

  const epistemics = node.epistemics || {};
  const metadata = element("dl", "argument-graph__meta");
  appendMeta(metadata, "Status", capitalize(epistemics.status));
  appendMeta(metadata, "Belief", beliefLabel(epistemics.belief));
  appendMeta(metadata, "Confidence", capitalize(epistemics.confidence));
  if (metadata.children.length) container.append(metadata);

  if (epistemics.cruxes?.length) {
    const section = element("section", "argument-graph__detail-section");
    section.append(element("h4", "", "Cruxes"));
    const list = element("ul", "argument-graph__detail-list");
    epistemics.cruxes.forEach((crux) => list.append(element("li", "", crux)));
    section.append(list);
    container.append(section);
  }

  [
    ["up", "Raises this claim"],
    ["down", "Lowers this claim"]
  ].forEach(([direction, heading]) => {
    const observations = epistemics.updates?.[direction];
    if (!observations?.length) return;

    const section = element("section", `argument-graph__detail-section argument-graph__updates argument-graph__updates--${direction}`);
    section.append(element("h4", "", heading));
    const list = element("ul", "argument-graph__detail-list");
    observations.forEach((observation) => list.append(element("li", "", observation)));
    section.append(list);
    container.append(section);
  });

  if (node.sources?.length) {
    const section = element("section", "argument-graph__detail-section");
    section.append(element("h4", "", "Sources"));
    const list = element("ul", "argument-graph__source-list");
    node.sources.forEach((source) => {
      const item = element("li");
      const label = source.title || source.url || "Source";

      if (source.url) {
        const link = element("a", "", label);
        link.href = source.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        item.append(link);
      } else {
        item.append(element("span", "", label));
      }

      if (source.note) item.append(element("p", "", source.note));
      list.append(item);
    });
    section.append(list);
    container.append(section);
  }

  const nodeById = new Map(graph.nodes.map((candidate) => [candidate.id, candidate]));
  const connections = graph.edges.filter((edge) => edge.from === node.id || edge.to === node.id);
  if (connections.length) {
    const section = element("section", "argument-graph__detail-section");
    section.append(element("h4", "", "Relationships"));
    const list = element("ul", "argument-graph__relationship-list");

    connections.forEach((edge) => {
      const outgoing = edge.from === node.id;
      const other = nodeById.get(outgoing ? edge.to : edge.from);
      const phrase = RELATION_PHRASES[edge.type] || edge.type;
      const sentence = outgoing
        ? `This node ${phrase} “${other.title}”.`
        : `“${other.title}” ${phrase} this node.`;
      const item = element("li", `argument-graph__relation--${edge.type}`, sentence);
      if (edge.note) item.append(element("p", "", edge.note));
      list.append(item);
    });

    section.append(list);
    container.append(section);
  }
}

function cytoscapeStyles() {
  return [
    {
      selector: "node",
      style: {
        "background-color": "#171a17",
        "border-color": "#a7ada8",
        "border-width": 2,
        color: "#f2f4f2",
        "font-family": "Monaco, 'Bitstream Vera Sans Mono', 'Lucida Console', monospace",
        "font-size": 11,
        height: 74,
        label: "data(label)",
        padding: 8,
        shape: "round-rectangle",
        "text-halign": "center",
        "text-max-width": 150,
        "text-outline-color": "#171a17",
        "text-outline-width": 2,
        "text-valign": "center",
        "text-wrap": "wrap",
        "transition-duration": "120ms",
        "transition-property": "opacity, border-width, background-color",
        width: 176
      }
    },
    { selector: "node[type = 'question']", style: { "border-color": "#63c0f5", shape: "round-diamond" } },
    { selector: "node[type = 'claim']", style: { "border-color": "#d0d0d0" } },
    { selector: "node[type = 'hypothesis']", style: { "border-color": "#aa759f", shape: "round-tag" } },
    { selector: "node[type = 'evidence']", style: { "border-color": "#b5e853", shape: "round-rectangle" } },
    { selector: "node[type = 'objection']", style: { "border-color": "#e46a6a", shape: "round-hexagon" } },
    { selector: "node[type = 'assumption']", style: { "border-color": "#f4bf75", "border-style": "dashed" } },
    { selector: "node[type = 'conclusion']", style: { "background-color": "#182320", "border-color": "#75b5aa", "border-width": 3 } },
    {
      selector: "edge",
      style: {
        "arrow-scale": 0.85,
        color: "#8b918c",
        "curve-style": "bezier",
        "font-family": "Monaco, 'Bitstream Vera Sans Mono', 'Lucida Console', monospace",
        "font-size": 8,
        label: "data(type)",
        "line-color": "#777d78",
        "target-arrow-color": "#777d78",
        "target-arrow-shape": "triangle",
        "text-background-color": "#0d0f0d",
        "text-background-opacity": 0.92,
        "text-background-padding": 2,
        "text-rotation": "autorotate",
        width: "data(weight)"
      }
    },
    {
      selector: "edge[type = 'supports'], edge[type = 'entails']",
      style: { "line-color": "#8fbd4f", "target-arrow-color": "#8fbd4f", color: "#b5e853" }
    },
    {
      selector: "edge[type = 'attacks'], edge[type = 'contradicts']",
      style: { "line-color": "#d45b5b", "target-arrow-color": "#d45b5b", color: "#ee8a8a" }
    },
    {
      selector: "edge[type = 'contradicts']",
      style: { "source-arrow-color": "#d45b5b", "source-arrow-shape": "diamond" }
    },
    {
      selector: "edge[type = 'assumes'], edge[type = 'depends-on']",
      style: { "line-color": "#c79550", "line-style": "dashed", "target-arrow-color": "#c79550", color: "#f4bf75" }
    },
    {
      selector: "edge[type = 'explains']",
      style: { "line-color": "#589bc0", "target-arrow-color": "#589bc0", color: "#63c0f5" }
    },
    {
      selector: "edge[type = 'alternative-to']",
      style: {
        "line-color": "#9f7197",
        "line-style": "dotted",
        "source-arrow-color": "#9f7197",
        "source-arrow-shape": "triangle",
        "target-arrow-color": "#9f7197",
        color: "#c99bc1"
      }
    },
    { selector: ".is-dimmed", style: { opacity: 0.12 } },
    { selector: "edge.is-related", style: { "z-index": 8, opacity: 1, width: 3.5 } },
    { selector: "node.is-related", style: { opacity: 1 } },
    { selector: "node.is-selected", style: { "background-color": "#263026", "border-width": 5, opacity: 1, "z-index": 10 } },
    {
      selector: "node.is-target",
      style: {
        "background-color": "#29361f",
        "border-color": "#dfff9a",
        "border-width": 7,
        opacity: 1,
        "underlay-color": "#b5e853",
        "underlay-opacity": 0.28,
        "underlay-padding": 14,
        "z-index": 20
      }
    },
    { selector: "edge.is-target-context", style: { opacity: 1, width: 4, "z-index": 12 } },
    { selector: "node.is-hovered", style: { "border-width": 4 } }
  ];
}

function graphElements(graph, positions) {
  const nodes = graph.nodes.map((node) => ({
    data: {
      id: node.id,
      label: `${NODE_TYPE_LABELS[node.type].toUpperCase()}\n${node.title}`,
      title: node.title,
      type: node.type
    },
    position: positions[node.id]
  }));

  const edges = graph.edges.map((edge) => ({
    data: {
      id: edge.id,
      source: edge.from,
      target: edge.to,
      type: edge.type,
      weight: edge.strength === undefined ? 2 : 1 + (edge.strength * 3)
    }
  }));

  return [...nodes, ...edges];
}

async function initializeGraph(root) {
  const canvas = root.querySelector("[data-argument-graph-canvas]");
  const inspector = root.querySelector("[data-argument-graph-inspector]");
  const summary = root.querySelector("[data-argument-graph-summary]");
  const select = root.querySelector("[data-argument-graph-select]");
  const errorBox = root.querySelector("[data-argument-graph-error]");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  root.setAttribute("aria-busy", "true");

  try {
    const response = await fetch(root.dataset.graphSrc, { headers: { Accept: "application/json" } });
    if (!response.ok) throw new Error(`Graph request returned ${response.status}.`);
    const canonicalGraph = await response.json();
    const graph = selectGraphView(canonicalGraph, root.dataset.graphView);
    const nodeById = new Map(graph.nodes.map((node) => [node.id, node]));

    summary.textContent = graph.description || "Explore the claims, evidence, objections, and assumptions behind this post.";
    select.disabled = false;
    graph.nodes.forEach((node) => {
      const option = element("option", "", `${NODE_TYPE_LABELS[node.type]} — ${node.title}`);
      option.value = node.id;
      select.append(option);
    });

    renderOverview(inspector, graph);

    const semanticLayout = computeSemanticLayout(graph);

    const cy = cytoscape({
      container: canvas,
      elements: graphElements(graph, semanticLayout.positions),
      style: cytoscapeStyles(),
      layout: { name: "preset", fit: false },
      minZoom: 0.2,
      maxZoom: 2.25,
      wheelSensitivity: 0.18,
      boxSelectionEnabled: false,
      autounselectify: true
    });

    const fitGraph = () => {
      if (reducedMotion) {
        cy.fit(cy.elements(), 34);
      } else {
        cy.animate({ fit: { eles: cy.elements(), padding: 34 } }, { duration: 180 });
      }
    };

    const clearEmphasis = () => {
      cy.elements().removeClass("is-dimmed is-related is-selected is-target is-target-context");
    };

    const selectNode = (id, { center = false, target = false } = {}) => {
      const node = cy.$id(id);
      if (!node.length) return null;

      clearEmphasis();
      const neighborhood = node.closedNeighborhood();
      if (target) {
        neighborhood.addClass("is-related");
        node.connectedEdges().addClass("is-target-context");
        node.addClass("is-target");
      } else {
        cy.elements().addClass("is-dimmed");
        neighborhood.removeClass("is-dimmed").addClass("is-related");
      }
      node.addClass("is-selected");

      select.value = id;
      renderInspector(inspector, graph, nodeById.get(id));

      if (center) {
        if (reducedMotion) cy.center(node);
        else cy.animate({ center: { eles: node } }, { duration: 160 });
      }

      return node;
    };

    const clearSelection = () => {
      clearEmphasis();
      select.value = "";
      renderOverview(inspector, graph);
    };

    const clearTargetUrl = () => {
      if (!graphTargetFromHash()) return;
      window.history.replaceState(null, "", `${window.location.pathname}${window.location.search}`);
    };

    const focusTargetNode = (id, scroll = true) => {
      const node = selectNode(id, { target: true });
      if (!node) return false;

      if (scroll) {
        canvas.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center",
          inline: "nearest"
        });
      }

      const context = node.closedNeighborhood();
      const focusCanvas = () => canvas.focus({ preventScroll: true });
      window.requestAnimationFrame(() => {
        cy.resize();
        if (reducedMotion) {
          cy.fit(context, 76);
          focusCanvas();
        } else {
          cy.animate(
            { fit: { eles: context, padding: 76 } },
            { duration: 360, complete: focusCanvas }
          );
        }
      });

      return true;
    };

    const syncTargetFromUrl = (scroll = true) => {
      const id = graphTargetFromHash();
      if (id) return focusTargetNode(id, scroll);

      cy.elements().removeClass("is-target is-target-context");
      return false;
    };

    cy.on("tap", "node", (event) => {
      clearTargetUrl();
      selectNode(event.target.id());
    });
    cy.on("tap", (event) => {
      if (event.target === cy) {
        clearTargetUrl();
        clearSelection();
      }
    });
    cy.on("mouseover", "node", (event) => event.target.addClass("is-hovered"));
    cy.on("mouseout", "node", (event) => event.target.removeClass("is-hovered"));

    select.addEventListener("change", () => {
      clearTargetUrl();
      if (select.value) selectNode(select.value, { center: true });
      else clearSelection();
    });

    document.querySelectorAll("a.mapped-claim").forEach((link) => {
      const id = graphTargetFromHash(link.hash);
      if (!id) return;

      link.dataset.argumentNode = id;
      link.addEventListener("click", (event) => {
        if (!nodeById.has(id)) return;

        event.preventDefault();
        if (window.location.hash !== link.hash) {
          window.history.pushState(null, "", link.hash);
        }
        focusTargetNode(id);
      });
    });

    window.addEventListener("hashchange", () => syncTargetFromUrl());

    root.querySelectorAll("[data-argument-graph-action]").forEach((button) => {
      button.addEventListener("click", () => {
        const action = button.dataset.argumentGraphAction;
        if (action === "fit") fitGraph();
        if (action === "zoom-in") {
          cy.zoom({ level: Math.min(cy.zoom() * 1.2, cy.maxZoom()), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
        }
        if (action === "zoom-out") {
          cy.zoom({ level: Math.max(cy.zoom() / 1.2, cy.minZoom()), renderedPosition: { x: cy.width() / 2, y: cy.height() / 2 } });
        }
      });
    });

    canvas.addEventListener("keydown", (event) => {
      if (event.key === "0") {
        event.preventDefault();
        fitGraph();
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        root.querySelector("[data-argument-graph-action='zoom-in']").click();
      }
      if (event.key === "-") {
        event.preventDefault();
        root.querySelector("[data-argument-graph-action='zoom-out']").click();
      }
    });

    window.requestAnimationFrame(() => {
      cy.resize();
      if (!syncTargetFromUrl()) {
        fitGraph();
        const initialNode = graph.nodes.find((node) => node.type === "question") || graph.nodes[0];
        if (initialNode) selectNode(initialNode.id);
      }
    });

    if (window.ResizeObserver) {
      const observer = new ResizeObserver(() => window.requestAnimationFrame(() => cy.resize()));
      observer.observe(canvas);
    }
  } catch (error) {
    root.classList.add("argument-graph--error");
    errorBox.hidden = false;
    errorBox.textContent = `The argument map could not be loaded. ${error.message}`;
    inspector.replaceChildren(
      element("p", "argument-graph__inspector-kicker", "Graph unavailable"),
      element("p", "argument-graph__inspector-body", "The essay remains available above. The structured graph data could not be rendered.")
    );
  } finally {
    root.setAttribute("aria-busy", "false");
  }
}

function initializeArgumentGraphs() {
  document.querySelectorAll("[data-argument-graph]").forEach(initializeGraph);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeArgumentGraphs);
} else {
  initializeArgumentGraphs();
}
