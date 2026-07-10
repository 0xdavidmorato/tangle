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

---

## Edge

Representa uma ligação entre dois Nodes.

As ligações permitem construir relações de conhecimento e percursos de aprendizagem.

As Edges são direcionadas.

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