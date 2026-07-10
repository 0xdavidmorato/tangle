# DECISIONS.md: decisões arquiteturais tomadas e respetiva justificação.
## Esse é um dos documentos mais valiosos.

Cada decisão deverá seguir um formato como este:
# Data: 2026-07-09
## Decisão
Texto
## Motivo
Texto
## Consequência
Texto
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

# Data: 2026-07-10

## Decisão

A Timeline passa a representar formalmente a progressão funcional da experiência do utilizador dentro do TANGLE.

Foram definidos os seguintes estados:

- initialization
- introduction
- exploration
- focus
- reflection
- conclusion

A `TangleEngine` será a única responsável por gerir a evolução entre estes estados através de `EngineEvent`.

## Motivo

O projeto necessita de um ciclo de vida bem definido para que a Engine possa controlar a experiência de navegação de forma previsível.

Documentar esta decisão antes da implementação garante que o comportamento da Engine será orientado pela documentação, conforme estabelecido no projeto.

## Consequência

A implementação da `TangleEngine` deverá respeitar esta sequência de estados.

As regras específicas de transição entre estados serão implementadas posteriormente, mantendo esta decisão como referência.

---------------------------------------------------------------------

# Data: 2026-07-10

## Decisão

A `TangleEngine` avança automaticamente para a próxima etapa da Timeline sempre que recebe o evento `timelineChange`.

A ordem das transições segue a sequência definida pela Timeline:

- initialization
- introduction
- exploration
- focus
- reflection
- conclusion

O evento não transporta informação sobre o destino da transição. Cabe exclusivamente à `TangleEngine` determinar a próxima etapa.

## Motivo

A Timeline representa um fluxo linear previamente definido.

Centralizar esta responsabilidade na `TangleEngine` evita duplicação de lógica e garante um comportamento consistente em toda a aplicação.

## Consequência

O `EngineEvent` permanece simples.

A `TangleEngine` passa a ser responsável por conhecer e aplicar a sequência de estados da Timeline.

---------------------------------------------------------------------
# Data: 2026-07-10

## Decisão

A `Timeline` passa a representar o histórico das etapas percorridas pela `TangleEngine` durante a execução.

Cada transição adiciona a nova `TimelineStage` ao histórico, preservando todas as etapas anteriormente percorridas.

A propriedade `currentStage` permanece responsável por representar a etapa atual da execução.

## Motivo

A etapa atual e o histórico possuem responsabilidades distintas.

A `currentStage` permite à `TangleEngine` conhecer rapidamente o estado atual, enquanto a `Timeline` mantém um registo cronológico da evolução da experiência.

Esta separação elimina ambiguidades e evita que a `Timeline` seja utilizada para determinar o estado atual.

## Consequência

A `TangleEngine` deverá atualizar simultaneamente a `currentStage` e a `Timeline` sempre que ocorrer uma transição.

A `Timeline` passará a conter todas as etapas percorridas desde a inicialização da Engine, preservando a ordem em que ocorreram.

---------------------------------------------------------------------