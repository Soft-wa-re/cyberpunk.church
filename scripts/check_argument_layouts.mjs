#!/usr/bin/env node

import assert from "node:assert/strict";
import fs from "node:fs";
import {
  computeSemanticLayout,
  semanticFlow,
  SEMANTIC_LAYOUT_RULES
} from "../_javascript/semantic-layout.mjs";

const graphPath = new URL("../assets/argument-graphs/epistemic-map.json", import.meta.url);
const canonicalGraph = JSON.parse(fs.readFileSync(graphPath, "utf8"));

function selectView(graph, view) {
  const selectedIds = new Set(view.nodes);
  return {
    id: view.id,
    nodes: graph.nodes.filter((node) => selectedIds.has(node.id)),
    edges: graph.edges.filter((edge) => selectedIds.has(edge.from) && selectedIds.has(edge.to))
  };
}

function graphBounds(layout) {
  const positions = Object.values(layout.positions);
  const xs = positions.map((position) => position.x);
  const ys = positions.map((position) => position.y);
  return {
    width: Math.max(...xs) - Math.min(...xs) + SEMANTIC_LAYOUT_RULES.nodeWidth,
    height: Math.max(...ys) - Math.min(...ys) + SEMANTIC_LAYOUT_RULES.nodeHeight
  };
}

function assertNoOverlaps(graph, layout) {
  const horizontalClearance = SEMANTIC_LAYOUT_RULES.nodeWidth + 24;
  const verticalClearance = SEMANTIC_LAYOUT_RULES.nodeHeight + 24;

  graph.nodes.forEach((left, index) => {
    graph.nodes.slice(index + 1).forEach((right) => {
      const leftPosition = layout.positions[left.id];
      const rightPosition = layout.positions[right.id];
      const overlaps = Math.abs(leftPosition.x - rightPosition.x) < horizontalClearance
        && Math.abs(leftPosition.y - rightPosition.y) < verticalClearance;
      assert.equal(overlaps, false, `${graph.id}: nodes '${left.id}' and '${right.id}' overlap`);
    });
  });
}

function assertSemanticDirections(graph, layout) {
  graph.edges.forEach((edge) => {
    const flow = semanticFlow(edge);
    if (flow && layout.components[flow.source] !== layout.components[flow.target]) {
      assert(
        layout.positions[flow.target].x > layout.positions[flow.source].x,
        `${graph.id}: '${edge.id}' does not flow toward its semantic target`
      );
    }

    if (edge.type === "attacks" || edge.type === "contradicts") {
      const separation = layout.positions[edge.from].y - layout.positions[edge.to].y;
      assert(
        separation >= SEMANTIC_LAYOUT_RULES.attackGap - 0.5,
        `${graph.id}: attacker '${edge.from}' is not clearly below '${edge.to}'`
      );
    }
  });
}

function checkLayout(graph) {
  const layout = computeSemanticLayout(graph);
  const repeatedLayout = computeSemanticLayout(graph);
  const expectedNodeIds = graph.nodes.map((node) => node.id).sort();

  assert.deepEqual(layout, repeatedLayout, `${graph.id}: layout is not deterministic`);
  assert.deepEqual(Object.keys(layout.positions).sort(), expectedNodeIds, `${graph.id}: layout omitted a node`);
  Object.entries(layout.positions).forEach(([id, position]) => {
    assert(Number.isFinite(position.x) && Number.isFinite(position.y), `${graph.id}: '${id}' has an invalid position`);
  });
  assertNoOverlaps(graph, layout);
  assertSemanticDirections(graph, layout);

  return { layout, bounds: graphBounds(layout) };
}

const views = canonicalGraph.views.map((view) => selectView(canonicalGraph, view));
const cases = [...views, { ...canonicalGraph, id: "full-canonical-graph" }];

console.log("Argument layout checks");
console.log("view                              nodes edges layers bounds");
cases.forEach((graph) => {
  const { layout, bounds } = checkLayout(graph);
  console.log(
    `${graph.id.padEnd(33)} ${String(graph.nodes.length).padStart(5)} ${String(graph.edges.length).padStart(5)} ${String(layout.layerCount).padStart(6)} ${String(Math.round(bounds.width)).padStart(4)}×${Math.round(bounds.height)}`
  );
});

console.log(`Validated ${views.length} named views and the full canonical graph with one shared layout.`);
