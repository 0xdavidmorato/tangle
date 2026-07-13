# Regras de comportamento da Engine

Este documento especifica o comportamento executável da Fundação do TANGLE.
PROJECT.md permanece a especificação oficial. Em caso de conflito, PROJECT.md
e as decisões registadas em DECISIONS.md prevalecem.

## Princípios

- O Graph contém conhecimento e configuração inicial; a Engine não o altera.
- A Engine mantém todo o estado mutável da sessão.
- A Interface envia intenções e apenas representa o estado resultante.
- Um evento inválido ou inaplicável não altera a sessão.
- Uma regra visual nunca desbloqueia, ativa ou conclui conhecimento.

## Estado da sessão

A sessão mantém:

- etapa global atual e histórico da Timeline;
- estado funcional atual de cada Node;
- Node focado e respetivo contexto relacional;
- Journey ativa, posição atual e Nodes concluídos nessa Journey.

Os estados funcionais iniciais são copiados dos Nodes do Graph quando a Engine
é criada. Consultas a Nodes desconhecidos não produzem estado.

## Regras dos estados funcionais

As únicas transições válidas são:

| Intenção | Origem permitida | Destino |
| --- | --- | --- |
| activate | unlocked, inactive | active |
| deactivate | active | inactive |
| complete | unlocked, active, inactive | completed |

locked nunca muda sem uma futura regra explícita de desbloqueio. completed é
terminal durante a sessão. Repetir uma transição já satisfeita é idempotente.

## Foco

- focus exige um nodeId existente e não bloqueado na sessão.
- Só existe um Node focado.
- O contexto contém todas as Connections incidentes e os Nodes existentes no
  extremo oposto, independentemente da direção da influência.
- blur limpa atomicamente todo o contexto.
- Foco não altera automaticamente o estado funcional do Node.

## Journey

- journeyStart exige uma journeyId existente.
- Iniciar uma Journey substitui qualquer Journey ativa e reinicia apenas o
  progresso da Journey; não apaga a Timeline nem estados funcionais anteriores.
- Uma Journey linear começa no primeiro Node e só permite focar o Node atual.
- Concluir o Node atual de uma Journey linear avança para o Node seguinte.
- Ao concluir o último Node, a Journey permanece ativa e fica marcada como
  concluída, sem inventar uma transição global da Timeline.
- Uma Journey exploratória permite focar qualquer Node que lhe pertença.
- Numa Journey exploratória, a ordem de conclusão é livre; fica concluída
  quando todos os seus Nodes forem concluídos.
- Nodes que não pertencem à Journey ativa não podem ser focados enquanto ela
  estiver ativa.
- Journeys vazias ou com referências a Nodes inexistentes são configurações
  inválidas e impedem a criação da Engine.

## Eventos

Eventos que alteram um Node transportam o seu identificador:

- { type: "focus", nodeId }
- { type: "activate", nodeId }
- { type: "deactivate", nodeId }
- { type: "complete", nodeId }

O início de Journey usa { type: "journeyStart", journeyId }.

Eventos já definidos:

- blur: limpa o foco;
- timelineChange: avança pela narrativa do Graph;
- reset: restaura integralmente o estado inicial da sessão.

mouseenter, mouseleave, scroll, zoom e cameraMove permanecem intenções sem
mutação de domínio até existirem regras de Presentation e câmara documentadas.
A Engine aceita-as como operações neutras.

## Reset

reset:

- restaura os estados funcionais iniciais;
- limpa foco e contexto;
- remove a Journey ativa e o seu progresso;
- regressa à primeira etapa da narrativa;
- reinicia o histórico da Timeline com essa primeira etapa.

O Graph nunca é reconstruído ou alterado.

## Invariantes de configuração

Ao criar a Engine:

- a narrativa possui pelo menos uma etapa;
- cada Journey possui pelo menos um Node;
- cada journey.nodeIds referencia Nodes existentes;
- identificadores de Nodes e Journeys são únicos.

Uma configuração inválida falha imediatamente, antes de iniciar a experiência.
