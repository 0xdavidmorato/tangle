# Experiência de utilização

Este documento descreve a experiência do TANGLE sem depender de componentes ou
frameworks. PROJECT.md permanece a especificação oficial.

## Entrada

O utilizador entra diretamente no universo TANGLE. A rede completa ocupa o
espaço principal e o conceito central comunica “Tudo está ligado”.

Não existe navegação por páginas. O utilizador recebe uma instrução curta para
selecionar um Node e pode começar a explorar imediatamente.

O núcleo TANGLE é também a primeira ação da narrativa: selecioná-lo revela os
pilares principais. Selecionar um pilar revela os seus conceitos de conteúdo;
selecionar um conceito abre o respetivo foco e contexto relacional. A legenda
lateral e a navegação orgânica oferecem os mesmos atalhos sem criar uma
navegação por páginas. Esta última organiza os atalhos em quatro etapas:
visão geral, tema, relações e aprofundamento.

Interligações não ocupa lugar na constelação dos pilares. É apresentado como
um cartão explicativo próprio, pois o seu objetivo é interpretar as relações
entre os seis pilares e não competir visualmente com eles.

## Rede em repouso

- Quando os conteúdos são revelados, todos os Nodes permanecem presentes.
- Connections documentadas são distinguíveis da organização visual por Cluster.
- O núcleo irradia filamentos para os Clusters; os Clusters organizam os seus
  Nodes sem transformar pertença em influência.
- Os Nodes de conteúdo abrem-se para o exterior de cada pilar, preservando uma
  leitura clara do centro para a periferia.
- Cada pilar possui um hub visual próprio. O nome do pilar ocupa a zona interior
  e todos os conteúdos ficam na periferia, evitando sobreposição.
- Todos os Nodes possuem um símbolo visual; o texto permanece disponível para
  identificação inequívoca.
- Uma malha ambiental discreta acrescenta profundidade sem representar
  conhecimento.
- Movimento e luz sugerem atividade sem impedir leitura ou interação.
- A interface identifica a etapa atual e a dimensão do universo sem competir
  com a rede.
- A composição usa vários planos visuais: uma névoa de fundo, filamentos
  distantes, a estrutura navegável e pontos de energia. Estes planos devem
  produzir uma rede espacial e viva, nunca a aparência de um fluxograma radial.
- A cor e o brilho são hierárquicos: o contexto é sereno, as relações possuem
  pulso próprio e o foco é a fonte de contraste mais intensa.

## Foco

Ao selecionar um Node:

- a Engine valida a intenção;
- o Node recebe atenção primária;
- Connections incidentes e Nodes relacionados recebem atenção secundária;
- os restantes Nodes perdem ênfase, mas continuam visíveis;
- a rede adapta a composição suavemente;
- o conteúdo do Node surge num plano sobreposto.

Fechar o conteúdo envia blur à Engine e devolve a rede ao equilíbrio anterior.

## Conteúdo

O painel apresenta o Markdown pertencente ao Node. O utilizador pode percorrer
o texto sem abandonar o universo visual. Marcar o conceito como explorado envia
complete à Engine.

O cabeçalho do painel identifica o conteúdo pelo seu título contextual, como
`Definição de Boas Pessoas`. O título curto de origem no Markdown não é
repetido visualmente; os seus subtítulos continuam a estruturar a leitura.

Tabelas Markdown são apresentadas com cabeçalhos e colunas legíveis. Quando o
painel não tem largura suficiente, a tabela mantém a sua estrutura e pode ser
percorrida horizontalmente sem quebrar o conteúdo.

O painel nunca cria conhecimento nem decide progressão.

Depois da leitura, cada conteúdo disponibiliza um acesso explícito ao seu
teste de conhecimento. O teste é apresentado no mesmo painel e permite
responder, submeter, consultar a nota, rever as respostas corretas e repetir
livremente. Voltar à leitura não fecha o contexto nem altera o foco na rede.
As leituras concluídas e os melhores resultados são mantidos localmente no
dispositivo e reaparecem quando o utilizador regressa à experiência.

O cabeçalho apresenta a progressão dos quizzes até ao certificado. Quando todos
os quizzes estão aprovados, o participante pode introduzir o seu nome e
descarregar o certificado pedagógico em PDF, sem sair da experiência.

## Formas de exploração

### Percurso guiado

O primeiro Node da Journey é indicado na rede. Apenas esse Node pode receber
foco. Depois de concluído, a indicação avança para o Node seguinte.

### Exploração livre

Qualquer Node pertencente à Journey exploratória pode receber foco. A ordem de
conclusão é definida pelo utilizador.

## Resposta visual

- primary: conceito em foco e Connections que explicam o seu contexto;
- related: Nodes ligados ao conceito em foco;
- context: restante universo, sempre presente;
- journey current: próximo Node do percurso linear;
- completed: Node já explorado na sessão.

## Progresso pedagógico

- Um ponto discreto indica que o conteúdo foi lido, mas o quiz ainda não foi
  aprovado.
- Um selo verde com visto indica quiz aprovado.
- Cada pilar apresenta a contagem de quizzes aprovados sobre o total dos seus
  conteúdos, tanto no hub da rede como na navegação lateral.
- Interligações apresenta a sua própria contagem no cartão dedicado.

Estes indicadores representam o progresso persistido localmente e não alteram
as relações, a Journey ou os estados semânticos do Graph.

Quando existe progresso guardado, o cabeçalho disponibiliza o controlo
`Reiniciar progresso`. A confirmação explica que apenas as leituras e os
resultados dos quizzes deste browser serão apagados. Após confirmação, os
indicadores e contadores regressam imediatamente a zero.

Esses papéis são semânticos. Cor, escala, brilho ou movimento podem evoluir sem
alterar Engine ou Graph.

O movimento de profundidade responde suavemente à posição do olhar. Essa
resposta é exclusivamente visual e nunca altera foco, Journey ou conteúdo.

O núcleo pulsa num ritmo orgânico e emite ondas. Luzes percorrem os filamentos
até aos Nodes e circulam pelas Connections, comunicando que a rede está ativa.

Cada pilar respira através de um halo subtil e possui uma constelação periférica
de micro-nós. Essa densidade é atmosférica e nunca deve ser confundida com Nodes
ou Connections de conhecimento.

O enquadramento inclui margem para que rótulos, halos e Nodes extremos
permaneçam integralmente visíveis.

O enquadramento privilegia uma ocupação larga e assimétrica. A rede deve
preencher a cena e reservar áreas de respiração para os controlos e o conteúdo,
sem converter esses elementos em barras de navegação ou menus de páginas.
Quando um controlo auxiliar partilha espaço com um Node revelado, o Node mantém
prioridade visual e de interação; a navegação continua disponível fora da área
ocupada pela rede.

## Acessibilidade

- Nodes são alcançáveis por teclado e ativados por Enter ou Espaço.
- A sobreposição de controlos auxiliares nunca pode impedir a ativação de um
  Node revelado.
- Elementos interativos possuem nomes acessíveis.
- O conteúdo permanece texto HTML semântico depois de transformado do Markdown.
- Um controlo visível permite pausar e reativar todo o movimento da experiência.
- Pausar movimento afeta apenas animações decorativas; nunca deve impedir
  cliques, transições funcionais, abertura de conteúdo ou leitura.
- Ao abrir conteúdo ou certificado, o foco entra no respetivo diálogo, permanece
  nele durante a navegação por Tab e regressa ao controlo de origem ao fechar.
- Escape fecha os diálogos de conteúdo e certificado.
- A preferência do sistema para reduzir movimento inicia a experiência com as
  animações pausadas.
- Contraste e foco visível devem ser preservados em todos os refinamentos.

## Ecrãs pequenos

A rede mantém-se como contexto de fundo. Quando existe foco, o conteúdo ocupa a
área útil principal. Fechar o conteúdo devolve a exploração da rede.
