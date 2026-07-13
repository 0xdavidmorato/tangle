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
});

test("focus preserves the current node for locked or unknown nodes", () => {
  const engine = new TangleEngine(graph);
  engine.dispatch({ type: "focus", nodeId: "available-node" });

  engine.dispatch({ type: "focus", nodeId: "locked-node" });
  assert.equal(engine.focusedNode, graph.nodes[0]);

  engine.dispatch({ type: "focus", nodeId: "unknown-node" });
  assert.equal(engine.focusedNode, graph.nodes[0]);
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
