# Domínio

## Objetivo

O domínio representa todos os conceitos fundamentais do TANGLE.

Cada modelo possui uma responsabilidade única e independente da implementação da interface.

O domínio não conhece React, componentes visuais, animações ou detalhes tecnológicos.

---

## Graph

Representa toda a rede de conhecimento.

É o elemento principal do domínio.

Um Graph é composto por Clusters, Nodes e Edges.

---

## Cluster

Representa um grande domínio de conhecimento.

No TANGLE, cada pilar corresponde a um Cluster.

Exemplos:

- Boa Empresa
- Bom Funcionário
- Bom Ordenado
- Bom Negócio
- Boas Práticas
- Interligações

Um Cluster agrupa Nodes relacionados.

---

## Node

Representa uma unidade individual de conhecimento.

Normalmente corresponde a um ficheiro Markdown.

Exemplos:

- definicao.md
- caracteristicas.md
- beneficios.md

Um Node pertence sempre a um único Cluster.

O conteúdo de um Node é composto por referências a recursos, nunca por
componentes. Atualmente cada `ContentReference` aponta, por caminho relativo,
para um ficheiro Markdown.

---

## Edge

Representa uma ligação entre dois Nodes.

As ligações permitem construir relações de conhecimento e percursos de aprendizagem.

Uma `Connection` identifica os dois extremos através de `sourceNodeId` e
`targetNodeId` e possui os seguintes atributos de domínio:

- `direction`: `directed` ou `bidirectional`;
- `intensity`: força normalizada da influência, entre `0` e `1`;
- `priority`: relevância normalizada da relação, entre `0` e `1`;
- `meaning`: descrição textual obrigatória da influência.

Uma relação bidirecional é representada por uma única Connection. As Edges são
direcionadas apenas quando a sua `direction` é `directed`.

---

## Estados

O estado global da experiência é um de `initialization`, `introduction`,
`exploration`, `focus`, `reflection` ou `conclusion`.

Cada Node possui dois estados independentes:

- funcional: `locked`, `unlocked`, `active`, `inactive` ou `completed`;
- visual: `visible`, `hidden`, `highlighted`, `selected`, `focused` ou
  `fading`.

O estado funcional pertence ao comportamento do domínio. O estado visual é
apenas uma informação de apresentação e não altera o domínio.

O Graph possui ainda uma `narrativeTimeline` imutável, que define a sequência
narrativa disponível. Esta não deve ser confundida com a `Timeline` da Engine,
que regista apenas as etapas percorridas na execução atual.

O Graph inicial mapeia os ficheiros de `docs/content` para Nodes; os Markdown
continuam a ser a fonte do texto e não são copiados para código.

---

## Journey

Representa um percurso de aprendizagem.

Uma Journey define a sequência de Nodes percorridos pelo utilizador.

Pode ser linear ou adaptativa.

---

## State

Representa o estado lógico atual da aplicação.

Exemplos:

- Node atual;
- Journey ativa;
- histórico de navegação;
- progresso.

---

## VisualState

Representa apenas informação necessária para apresentação.

Exemplos:

- Node selecionado;
- animações;
- elementos destacados;
- estados de expansão.

VisualState nunca altera o domínio.

---

## Relações

Graph

├── Clusters

│     └── Nodes

│             └── Edges

│

└── Journeys

State referencia elementos do domínio.

VisualState referencia apenas elementos apresentados ao utilizador.

---

## Regras do Domínio

- Todo Node pertence a um Cluster.
- Todo Edge liga dois Nodes.
- O Graph representa apenas conhecimento.
- O domínio nunca depende da interface.
- O domínio nunca depende da tecnologia utilizada.
- O estado visual nunca altera o estado do domínio.
