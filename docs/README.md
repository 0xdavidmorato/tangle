# TANGLE

Interactive knowledge visualization platform.

Toda a documentação oficial encontra-se em:

docs/PROJECT.md

Antes de alterar qualquer parte do sistema consulte:

- PROJECT.md
- ARCHITECTURE.md
- DECISIONS.md
- DOMAIN.md
- ENGINE_RULES.md
- ASSESSMENT_RULES.md

A documentação é a fonte de verdade do projeto.

## Execução local

`npm run dev`

## Validação antes de publicar

`npm test` verifica as regras de domínio e `npm run typecheck` confirma os
contratos TypeScript. Para validar a experiência no browser — teclado, foco,
movimento pausado, progresso, tabelas, acessibilidade e ecrã pequeno — execute:

`npm run test:e2e`

Na primeira execução, instale o browser de teste com
`npx playwright install chromium`.

## Versão publicada

https://0xdavidmorato.github.io/tangle/

O deploy é executado automaticamente por GitHub Actions após cada push para
`main`.
