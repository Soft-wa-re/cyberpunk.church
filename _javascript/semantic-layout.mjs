const FLOW_DIRECTION = Object.freeze({
  supports: "forward",
  entails: "forward",
  explains: "forward",
  attacks: "forward",
  contradicts: "forward",
  assumes: "reverse",
  "depends-on": "reverse",
  "alternative-to": "undirected"
});

const RELATION_WEIGHT = Object.freeze({
  supports: 3,
  entails: 4,
  explains: 2.4,
  attacks: 3.2,
  contradicts: 3.2,
  assumes: 1.6,
  "depends-on": 1.6,
  "alternative-to": 1.2
});

const TYPE_STAGE = Object.freeze({
  evidence: 0,
  assumption: 0,
  objection: 0,
  hypothesis: 0.4,
  claim: 0.55,
  question: 0.75,
  conclusion: 1
});

const TYPE_LANE = Object.freeze({
  evidence: -1,
  assumption: -0.7,
  question: -0.1,
  claim: 0,
  conclusion: 0.15,
  hypothesis: 0.3,
  objection: 1.4
});

export const SEMANTIC_LAYOUT_RULES = Object.freeze({
  layerGap: 250,
  nodeGap: 126,
  nodeWidth: 176,
  nodeHeight: 74,
  attackOffset: 150,
  attackGap: 92,
  alternativeOffset: 92,
  relaxationPasses: 12,
  challengePasses: 48
});

export function semanticFlow(edge) {
  const direction = FLOW_DIRECTION[edge.type];
  if (direction === "forward") return { source: edge.from, target: edge.to };
  if (direction === "reverse") return { source: edge.to, target: edge.from };
  return null;
}

function stronglyConnectedComponents(nodeIds, adjacency) {
  let nextIndex = 0;
  const stack = [];
  const onStack = new Set();
  const indexById = new Map();
  const lowLinkById = new Map();
  const components = [];

  const visit = (id) => {
    indexById.set(id, nextIndex);
    lowLinkById.set(id, nextIndex);
    nextIndex += 1;
    stack.push(id);
    onStack.add(id);

    adjacency.get(id).forEach((neighbor) => {
      if (!indexById.has(neighbor)) {
        visit(neighbor);
        lowLinkById.set(id, Math.min(lowLinkById.get(id), lowLinkById.get(neighbor)));
      } else if (onStack.has(neighbor)) {
        lowLinkById.set(id, Math.min(lowLinkById.get(id), indexById.get(neighbor)));
      }
    });

    if (lowLinkById.get(id) !== indexById.get(id)) return;

    const component = [];
    let member;
    do {
      member = stack.pop();
      onStack.delete(member);
      component.push(member);
    } while (member !== id);
    components.push(component.sort());
  };

  nodeIds.forEach((id) => {
    if (!indexById.has(id)) visit(id);
  });

  return components.sort((left, right) => left[0].localeCompare(right[0]));
}

function insertSorted(queue, value, keyFor) {
  const key = keyFor(value);
  const index = queue.findIndex((candidate) => keyFor(candidate).localeCompare(key) > 0);
  if (index === -1) queue.push(value);
  else queue.splice(index, 0, value);
}

function buildRanks(nodes, edges) {
  const nodeIds = nodes.map((node) => node.id).sort();
  const nodeIdSet = new Set(nodeIds);
  const adjacency = new Map(nodeIds.map((id) => [id, []]));

  edges.forEach((edge) => {
    const flow = semanticFlow(edge);
    if (!flow || !nodeIdSet.has(flow.source) || !nodeIdSet.has(flow.target) || flow.source === flow.target) return;
    adjacency.get(flow.source).push(flow.target);
  });
  adjacency.forEach((neighbors, id) => adjacency.set(id, [...new Set(neighbors)].sort()));

  const components = stronglyConnectedComponents(nodeIds, adjacency);
  const componentByNode = new Map();
  components.forEach((component, index) => component.forEach((id) => componentByNode.set(id, index)));

  const outgoing = components.map(() => new Set());
  const incomingCount = components.map(() => 0);
  nodeIds.forEach((source) => {
    adjacency.get(source).forEach((target) => {
      const sourceComponent = componentByNode.get(source);
      const targetComponent = componentByNode.get(target);
      if (sourceComponent === targetComponent || outgoing[sourceComponent].has(targetComponent)) return;
      outgoing[sourceComponent].add(targetComponent);
      incomingCount[targetComponent] += 1;
    });
  });

  const componentKey = (index) => components[index][0];
  const queue = [];
  incomingCount.forEach((count, index) => {
    if (count === 0) insertSorted(queue, index, componentKey);
  });

  const topologicalOrder = [];
  while (queue.length) {
    const component = queue.shift();
    topologicalOrder.push(component);
    [...outgoing[component]].sort((left, right) => componentKey(left).localeCompare(componentKey(right))).forEach((target) => {
      incomingCount[target] -= 1;
      if (incomingCount[target] === 0) insertSorted(queue, target, componentKey);
    });
  }

  const earliest = components.map(() => 0);
  topologicalOrder.forEach((component) => {
    outgoing[component].forEach((target) => {
      earliest[target] = Math.max(earliest[target], earliest[component] + 1);
    });
  });

  const maximumRank = Math.max(0, ...earliest);
  const latest = components.map(() => maximumRank);
  [...topologicalOrder].reverse().forEach((component) => {
    if (!outgoing[component].size) return;
    latest[component] = Math.min(...[...outgoing[component]].map((target) => latest[target] - 1));
  });

  const nodeById = new Map(nodes.map((node) => [node.id, node]));
  const componentRanks = components.map((component, index) => {
    const preference = component.reduce((sum, id) => sum + (TYPE_STAGE[nodeById.get(id).type] ?? 0.5), 0) / component.length;
    return earliest[index] + Math.round((latest[index] - earliest[index]) * preference);
  });

  // Type preferences distribute nodes through available slack. This pass restores
  // every hard semantic direction after those soft choices.
  topologicalOrder.forEach((component) => {
    outgoing[component].forEach((target) => {
      componentRanks[target] = Math.max(componentRanks[target], componentRanks[component] + 1);
    });
  });

  const occupiedRanks = [...new Set(componentRanks)].sort((left, right) => left - right);
  const compressedRank = new Map(occupiedRanks.map((rank, index) => [rank, index]));
  const rankByNode = new Map();
  components.forEach((component, index) => {
    component.forEach((id) => rankByNode.set(id, compressedRank.get(componentRanks[index])));
  });

  return { rankByNode, componentByNode };
}

function relationOffset(edge, nodeId) {
  if (edge.type === "attacks" || edge.type === "contradicts") {
    return nodeId === edge.from ? SEMANTIC_LAYOUT_RULES.attackOffset : -SEMANTIC_LAYOUT_RULES.attackOffset;
  }

  if (edge.type === "alternative-to") {
    const [upper] = [edge.from, edge.to].sort();
    return nodeId === upper ? -SEMANTIC_LAYOUT_RULES.alternativeOffset : SEMANTIC_LAYOUT_RULES.alternativeOffset;
  }

  return 0;
}

function buildRelationships(nodes, edges) {
  const nodeIds = new Set(nodes.map((node) => node.id));
  const relationships = new Map(nodes.map((node) => [node.id, []]));

  edges.forEach((edge) => {
    if (!nodeIds.has(edge.from) || !nodeIds.has(edge.to) || edge.from === edge.to) return;
    const weight = RELATION_WEIGHT[edge.type] ?? 1;
    relationships.get(edge.from).push({
      other: edge.to,
      offset: relationOffset(edge, edge.from),
      weight
    });
    relationships.get(edge.to).push({
      other: edge.from,
      offset: relationOffset(edge, edge.to),
      weight
    });
  });

  relationships.forEach((items) => items.sort((left, right) => left.other.localeCompare(right.other)));
  return relationships;
}

function placeLayer(layer, desiredY, positions) {
  const ordered = [...layer].sort((left, right) => {
    const difference = desiredY.get(left.id) - desiredY.get(right.id);
    if (Math.abs(difference) > 0.0001) return difference;
    const laneDifference = (TYPE_LANE[left.type] ?? 0) - (TYPE_LANE[right.type] ?? 0);
    return laneDifference || left.id.localeCompare(right.id);
  });

  const placed = [];
  ordered.forEach((node, index) => {
    const desired = desiredY.get(node.id);
    const previous = placed[index - 1];
    placed.push(index === 0 ? desired : Math.max(desired, previous + SEMANTIC_LAYOUT_RULES.nodeGap));
  });

  const shift = placed.reduce((sum, value, index) => sum + desiredY.get(ordered[index].id) - value, 0) / placed.length;
  ordered.forEach((node, index) => {
    positions.get(node.id).y = placed[index] + shift;
  });
}

export function computeSemanticLayout(graph) {
  const nodes = [...(graph.nodes || [])];
  const edges = [...(graph.edges || [])];
  if (!nodes.length) return { positions: {}, ranks: {}, layerCount: 0 };

  const { rankByNode, componentByNode } = buildRanks(nodes, edges);
  const relationships = buildRelationships(nodes, edges);
  const layers = new Map();
  nodes.forEach((node) => {
    const rank = rankByNode.get(node.id);
    if (!layers.has(rank)) layers.set(rank, []);
    layers.get(rank).push(node);
  });

  const positions = new Map();
  [...layers.entries()].sort(([left], [right]) => left - right).forEach(([rank, layer]) => {
    const ordered = [...layer].sort((left, right) => {
      const laneDifference = (TYPE_LANE[left.type] ?? 0) - (TYPE_LANE[right.type] ?? 0);
      return laneDifference || left.id.localeCompare(right.id);
    });
    ordered.forEach((node, index) => {
      positions.set(node.id, {
        x: rank * SEMANTIC_LAYOUT_RULES.layerGap,
        y: (index - ((ordered.length - 1) / 2)) * SEMANTIC_LAYOUT_RULES.nodeGap
      });
    });
  });

  for (let pass = 0; pass < SEMANTIC_LAYOUT_RULES.relaxationPasses; pass += 1) {
    [...layers.entries()].sort(([left], [right]) => left - right).forEach(([, layer]) => {
      const desiredY = new Map();
      layer.forEach((node) => {
        let total = positions.get(node.id).y * 0.8;
        let weight = 0.8;
        const laneAnchor = (TYPE_LANE[node.type] ?? 0) * SEMANTIC_LAYOUT_RULES.nodeGap;
        total += laneAnchor * 0.45;
        weight += 0.45;

        relationships.get(node.id).forEach((relationship) => {
          const otherPosition = positions.get(relationship.other);
          total += (otherPosition.y + relationship.offset) * relationship.weight;
          weight += relationship.weight;
        });
        desiredY.set(node.id, total / weight);
      });
      placeLayer(layer, desiredY, positions);
    });
  }

  const challengeEdges = edges
    .filter((edge) => edge.type === "attacks" || edge.type === "contradicts")
    .sort((left, right) => left.id.localeCompare(right.id));
  for (let pass = 0; pass < SEMANTIC_LAYOUT_RULES.challengePasses; pass += 1) {
    challengeEdges.forEach((edge) => {
      const source = positions.get(edge.from);
      const target = positions.get(edge.to);
      if (!source || !target) return;

      const correction = SEMANTIC_LAYOUT_RULES.attackGap - (source.y - target.y);
      if (correction <= 0) return;
      source.y += correction / 2;
      target.y -= correction / 2;
    });

    layers.forEach((layer) => {
      const desiredY = new Map(layer.map((node) => [node.id, positions.get(node.id).y]));
      placeLayer(layer, desiredY, positions);
    });
  }

  const verticalCenter = nodes.reduce((sum, node) => sum + positions.get(node.id).y, 0) / nodes.length;
  const normalizedPositions = {};
  const ranks = {};
  nodes.forEach((node) => {
    const position = positions.get(node.id);
    normalizedPositions[node.id] = { x: position.x, y: position.y - verticalCenter };
    ranks[node.id] = rankByNode.get(node.id);
  });

  return {
    positions: normalizedPositions,
    ranks,
    components: Object.fromEntries(nodes.map((node) => [node.id, componentByNode.get(node.id)])),
    layerCount: layers.size
  };
}
