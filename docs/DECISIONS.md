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

# Data: 2026-07-10

## Decisão

Os `EngineEvent` representam intenções de interação com o TANGLE.

Cada evento possui uma responsabilidade única e é interpretado exclusivamente pela `TangleEngine`.

Nesta fase do projeto, apenas o evento `timelineChange` possui comportamento implementado.

Os restantes eventos serão implementados de forma incremental, à medida que as respetivas responsabilidades forem documentadas.

## Motivo

A implementação da Engine será orientada por eventos.

Documentar previamente a responsabilidade de cada evento evita ambiguidades e garante que cada comportamento é implementado de forma consistente com a arquitetura do projeto.

## Consequência

Novos comportamentos da `TangleEngine` apenas poderão ser implementados após a definição da responsabilidade do respetivo `EngineEvent`.

---------------------------------------------------------------------
# Data: 2026-07-10

## Decisão

O evento `focus` representa a seleção de um `Node` pelo utilizador.

A `TangleEngine` passa a controlar qual o `Node` atualmente focado.

Apenas um `Node` pode estar focado em simultâneo.

## Motivo

O foco é um dos comportamentos fundamentais da navegação no TANGLE.

Centralizar esta responsabilidade na `TangleEngine` garante consistência durante a exploração do conhecimento.

## Consequência

A `TangleEngine` passará a manter uma referência ao `Node` atualmente focado.

Os restantes comportamentos relacionados com foco serão implementados de forma incremental.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

A `TangleEngine` codificava a ordem da Timeline num `switch`, apesar de a
narrativa já pertencer ao Graph. Isso obrigaria a alterar a Engine para mudar
um percurso narrativo.

## Decisão

A Engine inicializa na primeira etapa de `graph.narrativeTimeline` e avança
para a etapa seguinte dessa sequência ao receber `timelineChange`. A narrativa
do Graph deve conter pelo menos uma etapa; uma narrativa vazia é inválida.

## Justificação

A progressão é comportamento da Engine, mas a ordem é conhecimento do Graph.
Esta separação permite reutilizar a mesma Engine com narrativas diferentes.

## Consequência

Ao chegar à última etapa, a Engine preserva o estado e o histórico atuais.
Uma configuração sem narrativa falha na inicialização, antes de iniciar uma
experiência inconsistente.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

O domínio e os conteúdos Markdown estavam definidos, mas ainda não existia uma
instância do Graph que os ligasse de forma navegável.

## Decisão

O Graph inicial será uma definição de dados em `src/graph/tangleGraph.ts`.
Cada ficheiro de `docs/content` corresponde a um Node do seu Cluster. As
Connections iniciais representam apenas as interligações descritas em
`PROJECT.md`; a jornada linear usa os Nodes introdutórios dos seis pilares e a
exploratória disponibiliza todos os Nodes.

## Justificação

Centralizar o mapeamento torna o conhecimento auditável, evita texto duplicado
e permite acrescentar conteúdo por extensão de dados, sem alterar a Engine ou
a interface.

## Consequência

O Graph passa a ser uma fonte concreta de conhecimento. Novas relações só
devem ser acrescentadas quando a respetiva influência for documentada.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

Os Nodes já são proprietários do conteúdo, mas `content: string[]` não
descrevia se cada valor era texto, caminho ou outro recurso. Os conteúdos
existentes do TANGLE estão em ficheiros Markdown separados da interface.

## Decisão

`Node.content` passa a conter `ContentReference`. Nesta fase, cada referência
possui `path`, relativo à raiz do projeto, e `format: "markdown"`.

## Justificação

O domínio identifica o conteúdo sem o carregar, interpretar ou decidir como
apresentá-lo. Assim, o Graph mantém-se como fonte de verdade e o Content
Renderer continua responsável por transformar Markdown em interface.

## Consequência

O carregamento de ficheiros e a conversão Markdown pertencem a uma futura
camada de infraestrutura/conteúdo. Novos formatos poderão ser acrescentados
por extensão ao tipo de referência, sem alterar Nodes existentes.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

O `Graph` declarava uma timeline como `string[]`, enquanto a `TangleEngine`
já utiliza `Timeline` para o histórico das etapas efetivamente percorridas.
Ambas as responsabilidades recebiam o mesmo nome, embora uma seja
conhecimento narrativo e a outra estado de execução.

## Decisão

O Graph passa a expor `narrativeTimeline`, uma sequência imutável de
`GlobalState` que define a narrativa disponível para a experiência. A
`Timeline` da Engine permanece o histórico mutável da execução.

## Justificação

A sequência narrativa pertence ao conhecimento reutilizável do TANGLE; o
histórico pertence à sessão em curso. Separar os contratos preserva a fonte de
verdade do Graph e impede que a Engine altere a narrativa ao processar eventos.

## Consequência

Consumidores que precisam da ordem narrativa consultam
`graph.narrativeTimeline`. Consumidores que precisam do percurso já realizado
consultam `engine.timeline`. Nenhuma camada de apresentação decide ou altera
qualquer uma das duas sequências.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

A Engine precisa de testes executáveis para validar regras de comportamento
independentemente de qualquer interface. O projeto ainda não possui uma
ferramenta de testes configurada.

## Decisão

Os testes unitários da Engine utilizarão o executor nativo `node:test`. O
TypeScript de produção será compilado temporariamente para `.test-dist` antes
da execução, sem adicionar dependências externas.

## Justificação

O executor já está disponível no ambiente Node utilizado pelo projeto e cobre
o isolamento necessário para as regras da Engine. A compilação temporária
testa o código que será efetivamente executado sem introduzir uma biblioteca
de testes na arquitetura.

## Consequência

O comando `npm test` passa a compilar e executar os testes unitários. O
diretório `.test-dist` é um artefacto descartável e não pertence ao repositório.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

A decisão existente define que o evento `focus` seleciona um `Node`, mas o
contrato `EngineEvent` ainda não transportava a identidade do Node nem definia
como a Engine deveria tratar um pedido inválido.

## Decisão

O evento `focus` passa a ser representado por `{ type: "focus", nodeId }`.

A `TangleEngine` resolve o `nodeId` exclusivamente no `Graph`. Apenas Nodes
existentes e cujo `functionalState` não seja `locked` podem receber foco. Um
pedido para um Node inexistente ou bloqueado não altera o foco atual.

## Justificação

O identificador mantém a interface livre de referências diretas ao domínio e
preserva o `Graph` como fonte de verdade para o conhecimento. Ignorar pedidos
inválidos torna a Engine previsível sem introduzir estados ou efeitos visuais
na camada de comportamento.

## Consequência

A Engine expõe o Node focado como estado de leitura. A Presentation poderá
reagir a esse estado sem alterar o Graph. Os restantes eventos mantêm o
contrato atual até que a respetiva responsabilidade seja documentada.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

Os estados globais, os estados dos Nodes e os atributos de `Connection`
existiam como listas documentais ou valores `string`, sem um contrato único e
verificável pelo TypeScript. A especificação exige que uma Connection expresse
direção, intensidade, prioridade e significado.

## Decisão

Fica definida, provisoriamente, a seguinte taxonomia:

- `GlobalState`: `initialization`, `introduction`, `exploration`, `focus`,
  `reflection` e `conclusion`;
- `FunctionalState`: `locked`, `unlocked`, `active`, `inactive` e `completed`;
- `VisualState`: `visible`, `hidden`, `highlighted`, `selected`, `focused` e
  `fading`;
- `ConnectionDirection`: `directed` ou `bidirectional`;
- `ConnectionIntensity` e `ConnectionPriority`: números normalizados entre
  `0` e `1`;
- `ConnectionMeaning`: descrição textual obrigatória da influência.

`TimelineStage` reutiliza `GlobalState`. Uma Connection bidirecional continua
a declarar `sourceNodeId` e `targetNodeId`; ambos identificam os extremos da
mesma relação, sem inverter ou duplicar a Connection.

## Justificação

Os tipos fechados protegem as invariantes do domínio sem colocar regras de
apresentação na Engine. A escala normalizada permite que futuras camadas de
apresentação interpretem intensidade e prioridade de forma consistente, sem
impor uma tecnologia visual.

## Consequência

Nodes e Connections deixam de aceitar valores arbitrários para estes campos.
A validação de limites numéricos em dados externos será introduzida quando
existir uma camada de carregamento de conteúdo; nesta fase, o contrato é
documental e de tipo.

---------------------------------------------------------------------
