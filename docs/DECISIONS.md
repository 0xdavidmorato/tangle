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

O primeiro workflow de Pages falhou em npm ci porque a versão de npm fornecida
pelo runner Node 22 interpretou dependências opcionais multiplataforma de forma
diferente da versão usada para gerar o lockfile.

## Decisão

O workflow instala npm 11.6.1 antes de executar npm ci, igualando a versão do
ambiente de desenvolvimento que validou e gerou package-lock.json.

## Justificação

Fixar o resolvedor torna a instalação reproduzível entre Windows e Linux sem
adicionar dependências transitivas ao domínio do projeto nem editar
manualmente o lockfile.

## Consequência

Alterações futuras da versão npm deverão atualizar workflow e lockfile na mesma
mudança.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

Ativar GitHub Pages não publicava o TANGLE porque o repositório continha uma
aplicação Next sem exportação estática, sem prefixo para o subdiretório
/tangle e sem workflow de deploy.

## Decisão

O TANGLE usa o static export oficial do Next para gerar out/. Em GitHub
Actions, basePath e assetPrefix recebem /tangle; no desenvolvimento local
permanecem vazios.

Um workflow acionado por push para main executa instalação reproduzível,
testes, build, upload do artefacto out/ e deploy através das actions oficiais
configure-pages, upload-pages-artifact e deploy-pages.

## Justificação

GitHub Pages serve apenas ficheiros estáticos e o projeto atual não necessita
de funções dinâmicas no servidor depois do build. O prefixo condicional mantém
assets corretos em https://0xdavidmorato.github.io/tangle/ sem alterar a
experiência local.

## Consequência

Cada push para main publica automaticamente uma versão testada. Funcionalidades
futuras que dependam de runtime de servidor deverão usar infraestrutura externa
ou motivar uma revisão explícita desta decisão de alojamento.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

O SVG apresentava hydration mismatch porque servidor e navegador produziam
diferenças na última casa decimal de cálculos trigonométricos. Em alguns
ambientes, a preferência global de movimento também ocultava toda a energia,
sem deixar ao utilizador uma forma explícita de a reativar.

## Decisão

Todas as coordenadas e control points do layout são convertidos para números
canónicos com quatro casas decimais antes da renderização.

A experiência inicia com movimento ativo e oferece um controlo persistente na
sessão para pausar ou reativar animações. O modo pausado remove os trilhos e
ondas e suspende as restantes animações.

## Justificação

Valores canónicos garantem HTML idêntico no SSR e na hidratação. Um controlo
visível torna o estado do movimento compreensível e permite ao utilizador
escolher entre a atmosfera viva pretendida e uma experiência estática.

## Consequência

O renderer deixa de produzir diferenças de precisão entre servidor e cliente.
A animação não desaparece silenciosamente por configuração externa; pode ser
pausada e retomada diretamente na interface.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

As partículas de energia baseadas em SVG animateMotion apareciam inicialmente,
mas podiam deixar de animar depois da hidratação ou em combinações específicas
de navegador. A densidade periférica também permanecia abaixo da sensação
neural da referência visual.

## Decisão

O fluxo de energia passa a usar caminhos SVG sobrepostos animados por CSS com
stroke-dashoffset. Cada caminho mantém duração e fase próprias, mas já não
depende de SMIL.

Cada Cluster recebe ainda um halo respiratório e uma micro-rede atmosférica de
oito pontos e filamentos. Esses elementos são decorativos, ficam marcados como
não interativos e não são adicionados ao Graph nem tratados como Connections.

## Justificação

Animações CSS em propriedades de stroke permanecem estáveis durante hidratação
e permitem representar vários pontos luminosos ao longo do mesmo caminho. As
micro-redes aproximam a composição da densidade orgânica pretendida sem
inventar conhecimento ou relações.

## Consequência

O renderer deixa de emitir animateMotion. A preferência por movimento reduzido
continua a remover trilhos e ondas. Malha ambiental, micro-rede estrutural e
Connections de domínio mantêm estilos visualmente distintos.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

Os Nodes secundários eram posicionados com um ângulo oposto ao vetor radial do
Cluster, fazendo-os crescer em direção ao centro. Os Nodes também não possuíam
iconografia e a sensação de vida dependia apenas de brilho estático.

## Decisão

O layout radial passa a ser uma função pura da Presentation. Cada satélite é
projetado num leque centrado no vetor exterior do seu Cluster e limitado ao
viewBox. Um teste matemático verifica que a projeção de cada satélite em
relação ao centro é positiva.

A iconografia SVG pertence exclusivamente à UI. Pilares recebem variantes
visuais por posição de Cluster e conteúdos recebem variantes por posição
interna, sem adicionar significado ou texto ao domínio.

O núcleo usa um ritmo de dois batimentos e ondas de propagação. Partículas de
energia percorrem apenas filamentos estruturais e Connections existentes. Com
movimento reduzido, partículas e ondas são removidas.

## Justificação

Extrair o layout torna a composição testável e independente do SVG. A
iconografia melhora reconhecimento sem colocar componentes no Graph. Vincular
energia a relações existentes faz com que a animação comunique estrutura e
influência, em vez de ser um efeito arbitrário.

## Consequência

Alterações futuras de distribuição radial podem ser validadas sem renderizar a
Interface. Todos os Nodes possuem símbolo, os conceitos expandem-se para fora
dos pilares e o sistema transmite atividade contínua respeitando
acessibilidade.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

O renderer precisava representar a hierarquia Graph → Clusters → Nodes e
distinguir ligações estruturais de Connections de domínio. Também era
necessário garantir que novos Markdown não ficassem esquecidos fora do Graph.

## Decisão

Presentation passa a incluir os Clusters no snapshot, preservando apenas
identidade, nome e Node IDs. O renderer usa três camadas distintas:

- malha ambiental decorativa, sem significado de domínio;
- filamentos estruturais entre o núcleo, Clusters e os seus Nodes;
- Connections do Graph, com destaque e fluxo próprios.

A cobertura de conteúdo é uma invariante testada bidirecionalmente: todos os
Markdown de docs/content aparecem exatamente uma vez no Graph e todas as
referências são carregáveis e não vazias.

## Justificação

Separar as camadas evita apresentar decoração ou pertença a Cluster como se
fossem influências de domínio. Expor Clusters pela Presentation impede a UI de
consultar ou reconstruir diretamente a organização do Graph. A paridade
automática protege a escalabilidade baseada em dados.

## Consequência

Adicionar ou remover conteúdo exige atualizar o Graph na mesma alteração. O
renderer pode aumentar densidade, profundidade e movimento sem inventar
Connections. A composição visual continua substituível e independente da
Engine.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

Os Nodes referenciam Markdown, mas nenhuma camada carrega o recurso. Além
disso, o projeto precisa de um primeiro renderer executável sem permitir que a
tecnologia escolhida determine Engine, Graph ou Presentation.

## Decisão

O carregamento de conteúdo usa um ContentLoader independente da origem e um
ContentSource injetável. A implementação inicial de Infrastructure lê ficheiros
relativos à raiz configurada e rejeita caminhos que escapem dessa raiz. O
loader devolve Markdown sem o interpretar; a transformação visual pertence ao
renderer.

O primeiro renderer restaura Next.js 16 e React 19, presentes no commit inicial
do projeto. A rede será desenhada inicialmente com SVG, DOM e CSS a partir do
snapshot de Presentation. react-markdown transforma o corpo Markdown em React
sem permitir HTML bruto. Nenhuma biblioteca de grafos ou WebGL será adicionada
até existir uma necessidade que SVG não satisfaça.

## Justificação

A abstração de origem permite substituir filesystem por HTTP, CMS ou conteúdo
empacotado sem alterar domínio ou Presentation. Next e React preservam a
continuidade tecnológica do repositório. SVG fornece interação, acessibilidade,
animação e teste com uma superfície menor para a primeira experiência.

## Consequência

Código de filesystem fica confinado a Infrastructure e executa apenas no
servidor. Componentes não leem ficheiros diretamente nem duplicam texto. Um
futuro renderer WebGL poderá consumir o mesmo snapshot e os mesmos eventos sem
alterar Graph ou Engine.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

A arquitetura define Presentation como a fronteira que adapta Engine e Graph
para a Interface, mas ainda não existia um contrato concreto. Sem essa
fronteira, uma futura UI teria de interpretar foco, relações, Journey e estados
funcionais diretamente.

## Decisão

Presentation expõe um snapshot semântico e somente de leitura criado a partir
da Engine. O snapshot contém etapa, Timeline, Nodes, Connections, conteúdo,
estado funcional e progresso da Journey. A atenção visual é expressa apenas
pelos níveis primary, related e context.

O snapshot não contém posições, cores, dimensões, movimentos, câmara,
partículas ou decisões de framework.

## Justificação

Uma projeção semântica permite que qualquer tecnologia visual represente o
mesmo comportamento sem duplicar regras da Engine. Manter todos os Nodes no
snapshot preserva a regra de que o utilizador não perde a perceção da rede
completa durante o foco.

## Consequência

A Interface consome Presentation e envia intenções à Engine. Renderers podem
interpretar os níveis de atenção de formas diferentes, desde que mantenham o
contexto visível e não alterem o domínio.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

O Graph define estados iniciais nos Nodes, mas a experiência também necessita
de estado mutável por sessão. Mutar diretamente o Graph misturaria conhecimento
com histórico de execução. Journey e vários eventos estavam modelados sem
regras completas, impedindo implementações futuras previsíveis.

## Decisão

A Engine mantém uma cópia dos estados funcionais dos Nodes para a sessão e
expõe consultas sem alterar o Graph. Eventos que alteram Nodes passam a
transportar nodeId. As transições válidas, o reset, as invariantes e o ciclo de
vida das Journeys ficam definidos em docs/ENGINE_RULES.md.

Journeys lineares avançam quando o Node atual é concluído; Journeys
exploratórias acumulam conclusões sem impor ordem. Uma Journey ativa limita o
foco aos Nodes que lhe pertencem e, no modo linear, ao Node atual.

## Justificação

Separar configuração de execução preserva o Graph como fonte de verdade
reutilizável e permite criar várias sessões sobre o mesmo conhecimento. Um
contrato comportamental explícito evita que Interface, Presentation ou futuros
eventos decidam regras de progressão.

## Consequência

Configurações inválidas falham na construção da Engine. locked e completed não
são alterados sem uma regra explícita; o primeiro permanece bloqueado e o
segundo é terminal durante a sessão. Eventos de interação visual permanecem
neutros até as regras correspondentes serem documentadas.

---------------------------------------------------------------------
# Data: 2026-07-13

## Contexto

O evento `focus` já seleciona um Node, mas a Engine ainda não disponibiliza o
contexto das suas relações. Isso deixaria a futura Presentation responsável
por percorrer o Graph e decidir quais Connections respondem ao foco, apesar de
essa seleção ser comportamento da experiência. O evento `blur` já pertence ao
contrato, mas não possui comportamento definido.

## Decisão

Ao aceitar um evento `focus`, a `TangleEngine` passa a expor, além do Node
focado, as Connections incidentes nesse Node e os Nodes existentes no extremo
oposto dessas Connections. Relações direcionadas e bidirecionais pertencem ao
contexto quando o Node focado é qualquer um dos seus extremos.

O evento `blur` limpa atomicamente o Node focado e todo o contexto relacional.
Pedidos de foco inválidos continuam a preservar integralmente o contexto
atual.

## Justificação

As Connections representam influências e a especificação determina que um
conceito nunca deve aparecer isolado. Resolver o contexto na Engine impede a
duplicação dessa regra na Interface, mantém o Graph como fonte de verdade e
permite que a Presentation apenas represente o estado recebido.

## Consequência

A Engine expõe `focusedConnections` e `relatedNodes` como coleções somente de
leitura. Não altera Nodes nem Connections do Graph; apenas mantém referências
aos elementos que compõem o contexto da sessão atual. A forma visual de
destacar esse contexto continua a pertencer à Presentation.

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
