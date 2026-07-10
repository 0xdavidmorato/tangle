# DECISIONS.md: decisões arquiteturais tomadas e respetiva justificação.
## Esse é um dos documentos mais valiosos.

Cada decisão deverá seguir um formato como este:
# 2026-07-09

## Decisão

Os cinco pilares serão representados como Clusters.

## Motivo

Evita tratar o projeto como um conjunto de páginas independentes.

## Consequência

Toda a navegação passa a ser baseada no Graph.
---------------------------------------------------------------------
# 2026-07-10

## Decisão

A arquitetura da TANGLE será baseada num Content Renderer.

Os ficheiros Markdown representam apenas o conteúdo.

A responsabilidade de transformar esse conteúdo em interface pertence exclusivamente ao Renderer.

## Motivo

Se o conteúdo conhecer componentes, qualquer alteração visual obriga a modificar a documentação.

Ao separar conteúdo e apresentação, a documentação permanece estável e a interface pode evoluir sem afetar os ficheiros Markdown.

## Consequência

Os ficheiros `.md` nunca referenciam Hero, Graph, Card ou qualquer outro componente.

Toda a decisão sobre como apresentar o conteúdo passa a ser responsabilidade do Renderer.

# 2026-07-10

## Decisão

Os componentes da interface não fazem parte da arquitetura da TANGLE.

Hero, Graph, Comparison, Diagram, Quote e quaisquer outros componentes são apenas elementos de apresentação.

## Motivo

Componentes existem para resolver necessidades específicas de interface.

Confundi-los com a arquitetura leva a alterações constantes durante o desenvolvimento e dificulta a evolução do projeto.

## Consequência

Adicionar, remover ou substituir um componente não altera a arquitetura do TANGLE.

A arquitetura permanece estável independentemente da evolução da interface.

# 2026-07-10

## Decisão

A seleção do componente de interface será determinada pelo Renderer com base no tipo de conteúdo.

## Motivo

O mesmo conteúdo pode necessitar de apresentações diferentes consoante o contexto.

Centralizar esta decisão no Renderer evita lógica distribuída e mantém um único ponto de responsabilidade.

## Consequência

O desenvolvimento passa a consistir em implementar ou melhorar componentes existentes, sem alterar a estrutura documental nem a arquitetura do projeto.

# 2026-07-10

## Decisão

Após o início do desenvolvimento, nenhuma decisão arquitetural poderá ser alterada sem uma revisão explícita da arquitetura.

## Motivo

Alterações arquiteturais durante a implementação provocam reestruturações, retrabalho e perda de consistência.

A arquitetura deve servir como contrato para todo o desenvolvimento.

## Consequência

Durante a implementação, todas as soluções deverão respeitar a arquitetura definida.

Novas ideias ou melhorias ficam registadas para uma futura revisão arquitetural, não sendo incorporadas automaticamente na versão em desenvolvimento.