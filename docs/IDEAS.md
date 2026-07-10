# IDEAS.md: ideias futuras que ainda não foram aprovadas

## Tudo o que ainda não foi aprovado.

Por exemplo:

IA para orientar a exploração.
Sistema de conquistas.
Modo multiplayer.
Narração por voz.
Exportação para apresentações.

Enquanto uma ideia estiver aqui, não faz parte do projeto.


# Quando iniciares o novo chat, eu recomendaria começar simplesmente com algo como:

> "Vamos iniciar o desenvolvimento do TANGLE. Este projeto é orientado pela documentação anexa. O `PROJECT.md` é a fonte de verdade. A arquitetura, o domínio e as decisões já estão documentados e são considerados definitivos.
Antes de propor qualquer código, lê toda a documentação e respeita a arquitetura definida. As decisões deverão obrigatóriamente ser documentadas no `DECISIONS.md`"

Durante este chat, não deverão ser propostas alterações arquiteturais nem novos padrões de UI, salvo pedido explícito.

O objetivo é implementar fielmente a documentação existente.

Sempre que houver dúvida, a documentação prevalece sobre sugestões.

Depois anexa, pelo menos:

* `PROJECT.md` (obrigatório)
* `ARCHITECTURE.md`
* `DOMAIN.md`
* `UX.md`

Se esses documentos fizerem referência às imagens, anexa também:

* `mapa-mental-tangle.jpg`
* `tangle-visual-concept-v1.png`

Os restantes (`DECISIONS.md`, `CHANGELOG.md`, `IDEAS.md`, etc.) podem ser anexados conforme forem ganhando conteúdo.

Uma sugestão adicional: no início do novo chat, estabelece uma regra explícita, por exemplo:

> **Regras de trabalho**
>
> 1. A documentação é a fonte de verdade.
> 2. Não alterar a arquitetura sem justificar primeiro a decisão.
> 3. Não criar código antes de validar a solução arquitetural.
> 4. Em caso de dúvida, perguntar em vez de assumir.
> 5. Manter consistência com o modelo de domínio.

Isso cria um contrato de trabalho claro desde o início e reduz o risco de mudanças de direção durante o desenvolvimento.

Desejo que este novo arranque do TANGLE seja muito mais organizado e previsível do que a primeira tentativa.
