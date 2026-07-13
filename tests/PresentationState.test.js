const assert = require("node:assert/strict");
const test = require("node:test");

const { TangleEngine } = require("../.test-dist/engine/TangleEngine.js");
const { tangleGraph } = require("../.test-dist/graph/tangleGraph.js");
const {
  createPresentationState,
} = require("../.test-dist/presentation/createPresentationState.js");
const {
  createRadialLayout,
  networkCenter,
} = require("../.test-dist/presentation/RadialLayout.js");

test("presentation projects focus and relations without hiding graph context", () => {
  const engine = new TangleEngine(tangleGraph);
  engine.dispatch({ type: "focus", nodeId: "boa-empresa.visao-geral" });

  const state = createPresentationState(engine);
  const focusedNode = state.nodes.find(
    (node) => node.id === "boa-empresa.visao-geral",
  );
  const relatedNode = state.nodes.find(
    (node) => node.id === "bom-negocio.definicao",
  );
  const contextNode = state.nodes.find(
    (node) => node.id === "bom-ordenado.importancia",
  );
  const focusedConnection = state.connections.find(
    (connection) => connection.id === "empresa-negocio",
  );

  assert.equal(focusedNode.emphasis, "primary");
  assert.equal(relatedNode.emphasis, "related");
  assert.equal(contextNode.emphasis, "context");
  assert.equal(focusedConnection.emphasis, "primary");
  assert.equal(state.nodes.length, tangleGraph.nodes.length);
  assert.equal(state.clusters.length, tangleGraph.clusters.length);
});

test("presentation reflects session state and journey progress", () => {
  const engine = new TangleEngine(tangleGraph);
  engine.dispatch({ type: "journeyStart", journeyId: "core-narrative" });
  engine.dispatch({
    type: "complete",
    nodeId: "boa-empresa.visao-geral",
  });

  const state = createPresentationState(engine);
  const completedNode = state.nodes.find(
    (node) => node.id === "boa-empresa.visao-geral",
  );

  assert.equal(completedNode.functionalState, "completed");
  assert.equal(state.journey.id, "core-narrative");
  assert.equal(state.journey.currentNodeId, "bom-negocio.definicao");
  assert.equal(
    state.nodes.find((node) => node.id === "bom-negocio.definicao")
      .isJourneyCurrent,
    true,
  );
  assert.deepEqual(state.journey.completedNodeIds, [
    "boa-empresa.visao-geral",
  ]);
  assert.equal(
    tangleGraph.nodes.find(
      (node) => node.id === "boa-empresa.visao-geral",
    ).functionalState,
    "unlocked",
  );
});

test("radial layout projects every satellite away from the network center", () => {
  const engine = new TangleEngine(tangleGraph);
  const state = createPresentationState(engine);
  const layout = createRadialLayout(state.nodes, state.clusters);

  for (const cluster of state.clusters) {
    const root = layout.find((node) => node.id === cluster.nodeIds[0]);
    assert.ok(root);

    for (const nodeId of cluster.nodeIds.slice(1)) {
      const satellite = layout.find((node) => node.id === nodeId);
      assert.ok(satellite);
      const outwardX = root.x - networkCenter.x;
      const outwardY = root.y - networkCenter.y;
      const satelliteX = satellite.x - root.x;
      const satelliteY = satellite.y - root.y;
      const outwardProjection =
        outwardX * satelliteX + outwardY * satelliteY;

      assert.ok(
        outwardProjection > 0,
        `${satellite.id} must be outside its cluster root`,
      );
    }
  }
});
