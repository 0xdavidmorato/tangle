# Arquitetura

## Objetivo

A arquitetura do TANGLE foi concebida para separar completamente o domínio, o motor da aplicação e a interface gráfica.

O objetivo é garantir que a evolução da interface nunca obrigue a alterar as regras do sistema, permitindo que o domínio permaneça independente da tecnologia utilizada.

A arquitetura segue uma organização em camadas, onde cada camada possui responsabilidades bem definidas e comunica apenas com a camada imediatamente inferior.

---

## Camadas

### Application

É o ponto de entrada da aplicação.

Coordena o ciclo de vida do TANGLE e inicializa todos os serviços necessários.

Responsabilidades:

- iniciar a aplicação;
- carregar a configuração inicial;
- criar a Engine;
- iniciar a interface.

---

### Engine

Representa o núcleo do sistema.

A Engine contém toda a lógica necessária para navegar pelo conhecimento representado pelo Graph.

Nenhuma regra de negócio deve existir fora desta camada.

Responsabilidades:

- gerir a navegação;
- controlar o estado atual;
- resolver transições;
- responder às ações do utilizador;
- comunicar alterações para a interface.

---

### Graph

Representa todo o conhecimento do TANGLE.

Não contém lógica de interface nem código específico de qualquer framework.

É composto pelos modelos do domínio e pelas relações entre eles.

Responsabilidades:

- representar os Clusters;
- representar os Nodes;
- representar as ligações;
- representar os percursos possíveis.

---

### Presentation

É responsável por transformar o estado atual da Engine numa representação visual.

Não contém regras de negócio.

Responsabilidades:

- preparar dados para a UI;
- selecionar componentes;
- controlar estados visuais;
- adaptar o domínio para apresentação.

---

### UI

É a camada responsável pela interação com o utilizador.

Toda a interface gráfica pertence exclusivamente a esta camada.

Responsabilidades:

- renderizar componentes;
- capturar ações do utilizador;
- apresentar animações;
- apresentar transições.

---

## Fluxo

Application

↓

Engine

↓

Graph

↓

Presentation

↓

UI

As ações do utilizador percorrem o caminho inverso.

UI

↓

Presentation

↓

Engine

↓

Graph

---

## Dependências

Cada camada apenas pode conhecer a camada imediatamente inferior.

Application → Engine

Engine → Graph

Presentation → Engine

UI → Presentation

Nenhuma camada pode ignorar esta regra.

---

## Regras Arquiteturais

- O domínio nunca conhece a interface.
- A interface nunca altera diretamente o domínio.
- Toda a navegação passa pela Engine.
- O Graph representa apenas conhecimento.
- A Presentation adapta informação, nunca implementa regras.
- Componentes visuais nunca pertencem ao domínio.
- Markdown representa conteúdo, nunca comportamento.
- A arquitetura permanece independente da tecnologia utilizada.