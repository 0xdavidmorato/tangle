# Avaliação e Certificado Pedagógico

## Objetivo

O TANGLE terá avaliações de escolha múltipla para consolidar o conhecimento
após a leitura dos conteúdos. A avaliação faz parte da experiência de
aprendizagem: não substitui os conteúdos, não cria navegação por páginas e não
altera o Graph de conhecimento.

O certificado resultante é pedagógico. É emitido localmente no navegador, sem
login, servidor ou mecanismo de validação externa.

---

## Âmbito da avaliação

Cada Node de conteúdo terá um quiz associado, disponível depois da leitura do
respetivo Markdown. Os hubs visuais dos pilares não terão quiz, pois não são
Nodes de conteúdo do Graph.

Atualmente, o âmbito inclui todos os conteúdos dos seis pilares e o conteúdo
de Interligações.

---

## Estrutura dos quizzes

- Cada quiz terá, por norma, três perguntas de escolha múltipla.
- Um conteúdo especialmente extenso ou complexo poderá ter perguntas
  adicionais, desde que contribuam para avaliar uma ideia importante que as
  três perguntas base não cobrem.
- Cada pergunta terá uma única resposta correta.
- As opções, a resposta correta e a explicação pertencem aos dados de
  avaliação, nunca aos componentes visuais.
- As perguntas devem avaliar compreensão e aplicação do conteúdo, e não apenas
  a memorização literal de frases.

---

## Nota e aprovação

A nota de cada quiz é calculada pela fórmula:

`(respostas corretas / número de perguntas) × 10`

A apresentação da nota usa uma casa decimal.

A nota mínima de aprovação é **5 valores**, numa escala de 0 a 10. Num quiz
normal de três perguntas, duas respostas corretas resultam em 6,7 valores e
garantem aprovação.

Depois de submeter um quiz, o participante vê:

- a nota obtida;
- as respostas escolhidas;
- as respostas corretas;
- uma explicação breve para cada pergunta;
- o estado de aprovado ou por rever.

---

## Repetição e progresso

Os quizzes podem ser repetidos livremente, sem limite de tentativas.

O progresso de cada Node deve indicar, pelo menos:

- conteúdo lido;
- quiz realizado;
- melhor nota obtida;
- estado de aprovação.

A aprovação é preservada quando o participante repete um quiz. A tentativa
mais recente pode ser apresentada como feedback, mas o desbloqueio do
certificado é determinado pela melhor nota registada em cada Node.

Os resultados são persistidos localmente no dispositivo para que o progresso
sobreviva ao encerramento da página, sem introduzir contas ou serviços
externos. Dados locais inválidos ou corrompidos são ignorados e iniciam uma
nova sessão de avaliação.

---

## Certificado pedagógico

O certificado é desbloqueado quando todos os quizzes obrigatórios estiverem
aprovados.

Deve permitir ao participante indicar o seu nome no momento da emissão e
apresentar, no mínimo:

- nome do participante;
- data de emissão;
- identificação da formação TANGLE;
- confirmação de conclusão das avaliações;
- resultado global calculado a partir das melhores notas por Node.

O certificado pode ser descarregado em PDF, mas não é um documento verificável
externamente. Não terá autenticação, assinatura digital, código de validação ou
registo num servidor.

---

## Princípios de implementação

- O banco de perguntas é independente dos componentes e é associado ao ID do
  Node de conteúdo.
- A Engine continua responsável pelo comportamento do Graph; a avaliação e o
  progresso pedagógico serão estado complementar da experiência.
- A UI mostra perguntas, resultados e certificado, mas não decide quais são as
  respostas corretas.
- Novos Nodes de conteúdo só poderão ser considerados obrigatórios para o
  certificado quando tiverem quiz definido.
- A ausência de backend é intencional nesta fase: o certificado comprova a
  conclusão pedagógica local, não uma credencial oficial.

---

## Fora do âmbito desta fase

- contas de utilizador;
- resultados guardados num servidor;
- validação pública de certificados;
- assinatura digital;
- monitorização de tentativas;
- bloqueio de repetição de quizzes.
