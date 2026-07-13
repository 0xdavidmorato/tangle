import type { Cluster, Connection, Graph, Node } from ".";

const clusterDefinitions = [
  ["boa-empresa", "Boa Empresa"],
  ["bom-negocio", "Bom Negócio"],
  ["bom-funcionario", "Bom Funcionário"],
  ["bom-ordenado", "Bom Ordenado"],
  ["boas-praticas", "Boas Práticas"],
  ["interligacoes", "Interligações"],
] as const;

const contentNodes = [
  ["boa-empresa.visao-geral", "boa-empresa", "Visão Geral", "visao-geral"],
  ["boa-empresa.caracteristicas", "boa-empresa", "Características", "caracteristicas"],
  ["boa-empresa.impacto", "boa-empresa", "Impacto", "impacto"],
  ["bom-negocio.definicao", "bom-negocio", "Definição", "definicao"],
  ["bom-negocio.caracteristicas", "bom-negocio", "Características", "caracteristicas"],
  ["bom-negocio.viabilidade", "bom-negocio", "Viabilidade", "viabilidade"],
  ["bom-negocio.gestao", "bom-negocio", "Gestão", "gestao"],
  ["bom-negocio.caso-pratico", "bom-negocio", "Caso Prático", "caso-pratico"],
  ["bom-funcionario.definicao", "bom-funcionario", "Definição", "definicao"],
  ["bom-funcionario.caracteristicas", "bom-funcionario", "Características", "caracteristicas"],
  ["bom-funcionario.beneficios-para-empresa", "bom-funcionario", "Benefícios para a Empresa", "beneficios-para-empresa"],
  ["bom-ordenado.definicao", "bom-ordenado", "Definição", "definicao"],
  ["bom-ordenado.importancia", "bom-ordenado", "Importância", "importancia"],
  ["bom-ordenado.fatores", "bom-ordenado", "Fatores", "fatores"],
  ["bom-ordenado.equilibrio", "bom-ordenado", "Equilíbrio", "equilibrio"],
  ["boas-praticas.definicao", "boas-praticas", "Definição", "definicao"],
  ["boas-praticas.beneficios", "boas-praticas", "Benefícios", "beneficios"],
  ["boas-praticas.aplicacao", "boas-praticas", "Aplicação", "aplicacao"],
  ["interligacoes.introducao", "interligacoes", "Tudo está ligado", "introducao"],
] as const;

const connections: Connection[] = [
  { id: "empresa-negocio", sourceNodeId: "boa-empresa.visao-geral", targetNodeId: "bom-negocio.definicao", direction: "bidirectional", intensity: 1, priority: 1, meaning: "Uma boa empresa sustenta um bom negócio e é reforçada por ele.", animation: "none" },
  { id: "funcionario-ordenado", sourceNodeId: "bom-funcionario.definicao", targetNodeId: "bom-ordenado.definicao", direction: "bidirectional", intensity: 1, priority: 1, meaning: "A valorização salarial influencia o colaborador e o valor que cria.", animation: "none" },
  { id: "praticas-empresa", sourceNodeId: "boas-praticas.definicao", targetNodeId: "boa-empresa.visao-geral", direction: "bidirectional", intensity: 0.9, priority: 0.9, meaning: "Boas práticas fortalecem a empresa e a sua cultura.", animation: "none" },
  { id: "funcionario-negocio", sourceNodeId: "bom-funcionario.definicao", targetNodeId: "bom-negocio.definicao", direction: "bidirectional", intensity: 0.9, priority: 0.9, meaning: "Os colaboradores e o negócio influenciam-se mutuamente.", animation: "none" },
  { id: "praticas-ordenado", sourceNodeId: "boas-praticas.definicao", targetNodeId: "bom-ordenado.definicao", direction: "bidirectional", intensity: 0.8, priority: 0.8, meaning: "Boas práticas apoiam uma remuneração justa e sustentável.", animation: "none" },
];

const relationIdsByNode = new Map<string, string[]>();
for (const connection of connections) {
  for (const nodeId of [connection.sourceNodeId, connection.targetNodeId]) {
    relationIdsByNode.set(nodeId, [...(relationIdsByNode.get(nodeId) ?? []), connection.id]);
  }
}

const nodes: Node[] = contentNodes.map(([id, clusterId, name, fileName]) => ({
  id,
  name,
  description: name,
  category: "concept",
  clusterId,
  relationIds: relationIdsByNode.get(id) ?? [],
  visualState: "visible",
  functionalState: "unlocked",
  content: [{ path: `docs/content/${clusterId}/${fileName}.md`, format: "markdown" }],
  questions: [],
  examples: [],
  linkIds: [],
}));

const clusters: Cluster[] = clusterDefinitions.map(([id, name]) => ({
  id,
  name,
  description: name,
  nodeIds: nodes.filter((node) => node.clusterId === id).map((node) => node.id),
}));

export const tangleGraph: Graph = {
  nodes,
  connections,
  clusters,
  journeys: [
    { id: "core-narrative", name: "Narrativa Principal", mode: "linear", nodeIds: ["boa-empresa.visao-geral", "bom-negocio.definicao", "bom-funcionario.definicao", "bom-ordenado.definicao", "boas-praticas.definicao", "interligacoes.introducao"] },
    { id: "free-exploration", name: "Exploração Livre", mode: "exploratory", nodeIds: nodes.map((node) => node.id) },
  ],
  narrativeTimeline: ["initialization", "introduction", "exploration", "focus", "reflection", "conclusion"],
};
