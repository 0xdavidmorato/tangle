const assert = require("node:assert/strict");
const test = require("node:test");

const { TangleEngine } = require("../.test-dist/engine/TangleEngine.js");
const { tangleGraph } = require("../.test-dist/graph/tangleGraph.js");

const graph = {
  nodes: [
    {
      id: "available-node",
      name: "Available node",
      description: "",
      category: "concept",
      clusterId: "cluster",
      relationIds: [],
      visualState: "visible",
      functionalState: "unlocked",
      content: [
        {
          path: "docs/content/boa-empresa/visao-geral.md",
          format: "markdown",
        },
      ],
      questions: [],
      examples: [],
      linkIds: [],
    },
    {
      id: "locked-node",
      name: "Locked node",
      description: "",
      category: "concept",
      clusterId: "cluster",
      relationIds: [],
      visualState: "hidden",
      functionalState: "locked",
      content: [],
      questions: [],
      examples: [],
      linkIds: [],
    },
  ],
  connections: [
    {
      id: "available-influences-locked",
      sourceNodeId: "available-node",
      targetNodeId: "locked-node",
      direction: "directed",
      intensity: 0.75,
      priority: 1,
      meaning: "The available node influences the locked node.",
      animation: "none",
    },
  ],
  clusters: [],
  journeys: [],
  narrativeTimeline: [
    "initialization",
    "introduction",
    "exploration",
    "focus",
    "reflection",
    "conclusion",
  ],
};

test("focus selects an existing unlocked node", () => {
  const engine = new TangleEngine(graph);

  engine.dispatch({ type: "focus", nodeId: "available-node" });

  assert.equal(engine.focusedNode, graph.nodes[0]);
  assert.deepEqual(engine.focusedConnections, [graph.connections[0]]);
  assert.deepEqual(engine.relatedNodes, [graph.nodes[1]]);
});

test("focus preserves the current node for locked or unknown nodes", () => {
  const engine = new TangleEngine(graph);
  engine.dispatch({ type: "focus", nodeId: "available-node" });

  engine.dispatch({ type: "focus", nodeId: "locked-node" });
  assert.equal(engine.focusedNode, graph.nodes[0]);

  engine.dispatch({ type: "focus", nodeId: "unknown-node" });
  assert.equal(engine.focusedNode, graph.nodes[0]);
  assert.deepEqual(engine.focusedConnections, [graph.connections[0]]);
  assert.deepEqual(engine.relatedNodes, [graph.nodes[1]]);
});

test("blur clears the complete focus context", () => {
  const engine = new TangleEngine(graph);
  engine.dispatch({ type: "focus", nodeId: "available-node" });

  engine.dispatch("blur");

  assert.equal(engine.focusedNode, null);
  assert.deepEqual(engine.focusedConnections, []);
  assert.deepEqual(engine.relatedNodes, []);
});

test("the concrete graph maps every content node to Markdown", () => {
  assert.equal(tangleGraph.clusters.length, 6);
  assert.equal(tangleGraph.nodes.length, 19);
  assert.ok(tangleGraph.nodes.every((node) => node.content[0]?.format === "markdown"));
});

test("timeline progression follows the graph narrative", () => {
  const engine = new TangleEngine({ ...graph, narrativeTimeline: ["introduction", "conclusion"] });

  engine.dispatch("timelineChange");

  assert.equal(engine.currentStage, "conclusion");
  assert.deepEqual(engine.timeline.stages, ["introduction", "conclusion"]);
});

test("an empty narrative timeline is rejected", () => {
  assert.throws(() => new TangleEngine({ ...graph, narrativeTimeline: [] }));
});

test("functional state transitions are held by the session without mutating the graph", () => {
  const engine = new TangleEngine(graph);

  engine.dispatch({ type: "activate", nodeId: "available-node" });
  assert.equal(engine.getFunctionalState("available-node"), "active");

  engine.dispatch({ type: "deactivate", nodeId: "available-node" });
  assert.equal(engine.getFunctionalState("available-node"), "inactive");

  engine.dispatch({ type: "complete", nodeId: "available-node" });
  assert.equal(engine.getFunctionalState("available-node"), "completed");
  assert.equal(graph.nodes[0].functionalState, "unlocked");

  engine.dispatch({ type: "activate", nodeId: "locked-node" });
  assert.equal(engine.getFunctionalState("locked-node"), "locked");
  assert.equal(engine.getFunctionalState("unknown-node"), null);
});

test("a linear journey restricts focus and advances when its current node completes", () => {
  const linearJourney = {
    id: "linear",
    name: "Linear",
    mode: "linear",
    nodeIds: ["available-node", "locked-node"],
  };
  const journeyGraph = {
    ...graph,
    nodes: graph.nodes.map((node) => ({
      ...node,
      functionalState: "unlocked",
    })),
    journeys: [linearJourney],
  };
  const engine = new TangleEngine(journeyGraph);

  engine.dispatch({ type: "journeyStart", journeyId: "linear" });
  assert.equal(engine.activeJourney, linearJourney);
  assert.equal(engine.currentJourneyNode.id, "available-node");

  engine.dispatch({ type: "focus", nodeId: "locked-node" });
  assert.equal(engine.focusedNode, null);

  engine.dispatch({ type: "complete", nodeId: "available-node" });
  assert.deepEqual(engine.completedJourneyNodeIds, ["available-node"]);
  assert.equal(engine.currentJourneyNode.id, "locked-node");

  engine.dispatch({ type: "complete", nodeId: "locked-node" });
  assert.equal(engine.isJourneyComplete, true);
  assert.equal(engine.currentJourneyNode, null);
});

test("an exploratory journey accepts free completion order within its nodes", () => {
  const exploratoryJourney = {
    id: "exploratory",
    name: "Exploratory",
    mode: "exploratory",
    nodeIds: ["available-node", "locked-node"],
  };
  const journeyGraph = {
    ...graph,
    nodes: graph.nodes.map((node) => ({
      ...node,
      functionalState: "unlocked",
    })),
    journeys: [exploratoryJourney],
  };
  const engine = new TangleEngine(journeyGraph);

  engine.dispatch({ type: "journeyStart", journeyId: "exploratory" });
  engine.dispatch({ type: "complete", nodeId: "locked-node" });
  engine.dispatch({ type: "complete", nodeId: "available-node" });

  assert.deepEqual(engine.completedJourneyNodeIds, [
    "locked-node",
    "available-node",
  ]);
  assert.equal(engine.isJourneyComplete, true);
});

test("reset restores the complete initial session", () => {
  const engine = new TangleEngine(graph);
  engine.dispatch("timelineChange");
  engine.dispatch({ type: "focus", nodeId: "available-node" });
  engine.dispatch({ type: "complete", nodeId: "available-node" });

  engine.dispatch("reset");

  assert.equal(engine.currentStage, "initialization");
  assert.deepEqual(engine.timeline.stages, ["initialization"]);
  assert.equal(engine.focusedNode, null);
  assert.equal(engine.activeJourney, null);
  assert.equal(engine.getFunctionalState("available-node"), "unlocked");
});

test("invalid journey references and duplicate identifiers are rejected", () => {
  assert.throws(
    () =>
      new TangleEngine({
        ...graph,
        journeys: [
          {
            id: "invalid",
            name: "Invalid",
            mode: "linear",
            nodeIds: [],
          },
        ],
      }),
  );

  assert.throws(
    () =>
      new TangleEngine({
        ...graph,
        nodes: [graph.nodes[0], graph.nodes[0]],
      }),
  );
});
