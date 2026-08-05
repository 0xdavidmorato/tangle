import type { NodeQuiz } from "./Quiz";

interface QuestionSeed {
  readonly prompt: string;
  readonly options: readonly string[];
  readonly correct: number;
  readonly explanation: string;
}

function quiz(nodeId: string, seeds: readonly QuestionSeed[]): NodeQuiz {
  return {
    nodeId,
    questions: seeds.map((seed, questionIndex) => ({
      id: `${nodeId}.${questionIndex + 1}`,
      prompt: seed.prompt,
      options: seed.options.map((label, optionIndex) => ({
        id: `option-${optionIndex + 1}`,
        label,
      })),
      correctOptionId: `option-${seed.correct + 1}`,
      explanation: seed.explanation,
    })),
  };
}

const seedsByNodeId: Readonly<Record<string, readonly QuestionSeed[]>> = {
  "boa-empresa.visao-geral": [
    { prompt: "Porque precisa uma empresa de lucro suficiente?", options: ["Para sustentar operações e investir", "Para ignorar clientes", "Para evitar inovação", "Para reduzir salários"], correct: 0, explanation: "O lucro assegura continuidade e permite investir em pessoas, equipamentos, inovação e crescimento." },
    { prompt: "Qual é a visão equilibrada de uma boa empresa?", options: ["Só lucro imediato", "Resultados, pessoas e sociedade", "Apenas benefícios", "Apenas redução de custos"], correct: 1, explanation: "A empresa procura equilíbrio entre resultados financeiros, bem-estar das pessoas e valor social." },
    { prompt: "Qual é um objetivo básico apresentado?", options: ["Eliminar formação", "Satisfação dos clientes", "Evitar condições de trabalho", "Reduzir qualidade"], correct: 1, explanation: "A satisfação dos clientes é um dos objetivos básicos de uma empresa sustentável." },
  ],
  "boa-empresa.caracteristicas": [
    { prompt: "O que caracteriza uma gestão eficiente?", options: ["Decisões responsáveis e exemplo", "Desconhecimento do trabalho", "Falta de motivação", "Decisões sem informação"], correct: 0, explanation: "Gestores eficientes conhecem a atividade, motivam a equipa e tomam decisões responsáveis." },
    { prompt: "Qual destas é uma característica de boa empresa?", options: ["Má reputação", "Cultura organizacional positiva", "Ausência de capacitação", "Produtos sem qualidade"], correct: 1, explanation: "Uma cultura positiva sustenta as relações e o desempenho da organização." },
    { prompt: "Porque é importante o equilíbrio numa empresa?", options: ["Para conciliar resultados e pessoas", "Para eliminar responsabilidade social", "Para diminuir qualidade", "Para dispensar planeamento"], correct: 0, explanation: "O equilíbrio permite conciliar sustentabilidade financeira, pessoas e qualidade." },
  ],
  "boa-empresa.impacto": [
    { prompt: "Qual é o primeiro efeito do ciclo positivo apresentado?", options: ["Funcionários motivados prestam melhor serviço", "Fornecedores deixam de confiar", "Clientes reclamam mais", "Processos pioram"], correct: 0, explanation: "A motivação dos funcionários melhora o serviço e inicia um ciclo de valor." },
    { prompt: "Quem beneficia de parcerias sólidas e previsibilidade?", options: ["Clientes", "Fornecedores", "Apenas sócios", "Concorrentes"], correct: 1, explanation: "Fornecedores beneficiam de confiança, parcerias sólidas e previsibilidade." },
    { prompt: "Para que serve o reinvestimento dos resultados?", options: ["Melhorar processos, inovação e condições", "Interromper o ciclo", "Reduzir serviço", "Ignorar pessoas"], correct: 0, explanation: "O reinvestimento reforça processos, inovação e condições de trabalho." },
  ],
  "boa-empresa.parcerias": [
    { prompt: "Qual é a base de uma parceria estratégica?", options: ["Confiança e benefício mútuo", "Lucro imediato unilateral", "Ocultar problemas", "Comunicação rara"], correct: 0, explanation: "Uma parceria sólida assenta na confiança, transparência e benefício mútuo." },
    { prompt: "O que deve fazer um fornecedor perante um atraso previsível?", options: ["Comunicar e propor alternativas", "Esperar sem avisar", "Culpar o cliente", "Cancelar a relação"], correct: 0, explanation: "A comunicação antecipada permite minimizar impactos e encontrar soluções." },
    { prompt: "Qual é o objetivo perante um problema na parceria?", options: ["Encontrar culpados", "Resolver em conjunto e aprender", "Evitar contacto", "Beneficiar só uma parte"], correct: 1, explanation: "O foco é resolver a situação conjuntamente e prevenir novas ocorrências." },
  ],
  "boa-empresa.bons-socios": [
    { prompt: "O que bons sócios devem partilhar?", options: ["Uma visão comum", "Objetivos incompatíveis", "Competição interna", "Informação escondida"], correct: 0, explanation: "Uma visão comum orienta decisões e mantém a sociedade alinhada." },
    { prompt: "Qual atitude fortalece uma sociedade?", options: ["Procurar soluções", "Competir entre sócios", "Quebrar promessas", "Decidir sem transparência"], correct: 0, explanation: "Bons sócios procuram soluções em vez de culpados." },
    { prompt: "O que deve prevalecer numa decisão de sócios?", options: ["Interesse da empresa", "Ego individual", "Objetivo pessoal oculto", "Conflito"], correct: 0, explanation: "Os interesses da empresa devem estar acima dos interesses individuais." },
  ],
  "bom-negocio.definicao": [
    { prompt: "O que define um bom negócio?", options: ["Criar valor sustentável", "Gerar lucro a qualquer custo", "Prejudicar fornecedores", "Pensar só no presente"], correct: 0, explanation: "Um bom negócio cria valor sustentável para todas as partes envolvidas." },
    { prompt: "O lucro é apresentado como?", options: ["Único indicador", "Consequência de equilíbrio", "Algo dispensável", "Objetivo sem relações"], correct: 1, explanation: "O lucro é indispensável, mas resulta de uma organização equilibrada e responsável." },
    { prompt: "O que acontece se uma parte é constantemente prejudicada?", options: ["O negócio fica mais vulnerável", "A sustentabilidade aumenta", "A confiança cresce", "Nada muda"], correct: 0, explanation: "Prejudicar uma parte reduz estabilidade e aumenta problemas futuros." },
  ],
  "bom-negocio.caracteristicas": [
    { prompt: "O que mede a rentabilidade?", options: ["Capacidade de gerar resultados", "Número de reclamações", "Tamanho da equipa", "Idade da empresa"], correct: 0, explanation: "Rentabilidade indica a capacidade de gerar resultados que sustentem o negócio." },
    { prompt: "O que reforça a satisfação do cliente?", options: ["Qualidade e cumprimento de prazos", "Comunicação ausente", "Baixa qualidade", "Promessas incumpridas"], correct: 0, explanation: "Qualidade, confiança e cumprimento de prazos fortalecem a satisfação." },
    { prompt: "Porque é necessária capacidade de adaptação?", options: ["Para responder a mudanças", "Para recusar inovação", "Para manter erros", "Para ignorar clientes"], correct: 0, explanation: "Adaptar-se permite identificar oportunidades e responder a alterações." },
  ],
  "bom-negocio.viabilidade": [
    { prompt: "Qual questão avalia a procura?", options: ["Quem são os clientes?", "Qual cor usar?", "Quem é o concorrente favorito?", "Que lucro já existe?"], correct: 0, explanation: "Identificar clientes e o problema resolvido é essencial para avaliar procura." },
    { prompt: "Porque são importantes boas margens?", options: ["Permitem investir e enfrentar custos", "Eliminam clientes", "Dispensam qualidade", "Impedem crescimento"], correct: 0, explanation: "Margens saudáveis permitem investir, inovar e absorver aumentos de custos." },
    { prompt: "Qual é uma barreira à entrada?", options: ["Certificação obrigatória", "Falta de procura", "Cliente satisfeito", "Boa comunicação"], correct: 0, explanation: "Certificações, licenças e investimento inicial podem dificultar a entrada." },
  ],
  "bom-negocio.gestao": [
    { prompt: "Um setor atrativo garante sucesso?", options: ["Não, exige boa gestão", "Sim, sempre", "Só exige publicidade", "Só exige lucro"], correct: 0, explanation: "O setor cria oportunidades; a gestão transforma-as em resultados." },
    { prompt: "Setor atrativo com má gestão gera?", options: ["Elevado risco de fracasso", "Sucesso certo", "Qualidade automática", "Clientes fiéis"], correct: 0, explanation: "Um mercado favorável não compensa decisões e gestão deficientes." },
    { prompt: "O que transforma oportunidade em valor?", options: ["Pessoas, processos e decisões", "Sorte apenas", "Poucos concorrentes apenas", "Nome do setor"], correct: 0, explanation: "São as pessoas, os processos e as decisões que aproveitam oportunidades." },
  ],
  "bom-negocio.caso-pratico": [
    { prompt: "Que empresa cumpre pagamentos a fornecedores?", options: ["Empresa A", "Empresa B", "Ambas falham", "Nenhuma"], correct: 0, explanation: "A Empresa A mantém boas relações e cumpre pagamentos." },
    { prompt: "Que prática prejudica a Empresa B?", options: ["Materiais de baixa qualidade", "Formação contínua", "Prazos cumpridos", "Clientes recomendam"], correct: 0, explanation: "A Empresa B reduz qualidade para cortar custos, gerando reclamações." },
    { prompt: "O que distingue o resultado sustentável da Empresa A?", options: ["Qualidade, pessoas e relações", "Redução extrema de custos", "Atrasos frequentes", "Falta de confiança"], correct: 0, explanation: "A Empresa A combina qualidade, equipas qualificadas e relações de confiança." },
  ],
  "bom-funcionario.definicao": [
    { prompt: "Ser bom funcionário implica?", options: ["Zelo, responsabilidade e compromisso", "Só presença", "Apenas técnica", "Competição desleal"], correct: 0, explanation: "O bom colaborador atua com zelo, profissionalismo, responsabilidade e compromisso." },
    { prompt: "Além de técnica, o que distingue um bom colaborador?", options: ["Atitude e comportamento", "Salário apenas", "Cargo", "Antiguidade"], correct: 0, explanation: "A atitude e o comportamento diário são tão importantes quanto competências técnicas." },
    { prompt: "Qual é uma característica geral?", options: ["Proatividade", "Desinteresse", "Falta de ética", "Isolamento"], correct: 0, explanation: "Proatividade, ética, trabalho em equipa e competência técnica são características centrais." },
  ],
  "bom-funcionario.caracteristicas": [
    { prompt: "Que comportamento mostra responsabilidade?", options: ["Cumprir compromissos", "Evitar tarefas", "Ocultar erros", "Ignorar prazos"], correct: 0, explanation: "Responsabilidade traduz-se em cumprir compromissos e assumir as próprias ações." },
    { prompt: "Porque é importante trabalhar em equipa?", options: ["Melhora colaboração e resultados", "Elimina comunicação", "Dispensa respeito", "Cria isolamento"], correct: 0, explanation: "A cooperação permite resolver problemas e alcançar objetivos comuns." },
    { prompt: "O que significa agir com ética profissional?", options: ["Agir com honestidade e respeito", "Beneficiar-se indevidamente", "Quebrar confiança", "Ignorar regras"], correct: 0, explanation: "A ética sustenta confiança e um ambiente profissional saudável." },
  ],
  "bom-funcionario.beneficios-para-empresa": [
    { prompt: "Que benefício traz um bom funcionário?", options: ["Maior produtividade", "Mais desperdício", "Menos qualidade", "Pior ambiente"], correct: 0, explanation: "Colaboradores comprometidos aumentam produtividade e eficiência." },
    { prompt: "Como bons funcionários afetam clientes?", options: ["Melhoram satisfação", "Aumentam reclamações", "Eliminam serviço", "Impedem comunicação"], correct: 0, explanation: "Melhor serviço e qualidade contribuem para clientes mais satisfeitos." },
    { prompt: "Qual efeito reduz a necessidade de supervisão?", options: ["Autonomia responsável", "Erros repetidos", "Falta de compromisso", "Ausência de formação"], correct: 0, explanation: "Profissionais responsáveis trabalham com autonomia e exigem menos supervisão." },
  ],
  "bom-ordenado.definicao": [
    { prompt: "Um bom ordenado é apenas salário alto?", options: ["Não, deve permitir viver com dignidade", "Sim, sempre", "Só depende do cargo", "Não depende da vida"], correct: 0, explanation: "A remuneração deve permitir satisfazer necessidades e planear o futuro." },
    { prompt: "Qual fator influencia um bom ordenado?", options: ["Custo de vida", "Cor preferida", "Idade da empresa", "Número de concorrentes"], correct: 0, explanation: "Custo de vida, experiência, localização e responsabilidades influenciam a remuneração." },
    { prompt: "Que equilíbrio deve existir?", options: ["Remuneração e valor criado", "Lucro e desperdício", "Salário e silêncio", "Cargo e favoritismo"], correct: 0, explanation: "O ordenado deve refletir o valor criado de forma justa e sustentável." },
  ],
  "bom-ordenado.importancia": [
    { prompt: "Como uma remuneração justa afeta motivação?", options: ["Reforça reconhecimento", "Reduz compromisso", "Impede desenvolvimento", "Não influencia"], correct: 0, explanation: "Sentir-se valorizado aumenta motivação e compromisso." },
    { prompt: "Que efeito tem na retenção de talento?", options: ["Reduz saídas", "Aumenta rotatividade", "Elimina formação", "Reduz qualidade"], correct: 0, explanation: "Uma remuneração adequada ajuda a reter profissionais qualificados." },
    { prompt: "Porque deve ser sustentável para a empresa?", options: ["Para manter investimento e continuidade", "Para ignorar resultados", "Para criar instabilidade", "Para evitar crescimento"], correct: 0, explanation: "A remuneração precisa de respeitar a capacidade económica da empresa." },
  ],
  "bom-ordenado.fatores": [
    { prompt: "Qual fator pode aumentar a remuneração?", options: ["Experiência relevante", "Falta de competências", "Menor criação de valor", "Ausência de procura"], correct: 0, explanation: "Experiência e competências tendem a aumentar o valor reconhecido no mercado." },
    { prompt: "O que influencia diferenças regionais?", options: ["Custo de vida local", "Cor do escritório", "Nome da função", "Estação do ano"], correct: 0, explanation: "A localização geográfica e o custo de vida influenciam a remuneração." },
    { prompt: "Qual pode ser um benefício além do salário?", options: ["Seguro de saúde", "Ocultar informação", "Reduzir férias", "Eliminar formação"], correct: 0, explanation: "Políticas internas podem incluir seguro de saúde, formação ou horários flexíveis." },
  ],
  "bom-ordenado.equilibrio": [
    { prompt: "O que caracteriza o equilíbrio salarial?", options: ["Justiça para trabalhador e sustentabilidade", "Salário sem valor criado", "Lucro sem pessoas", "Benefício de uma parte"], correct: 0, explanation: "O equilíbrio beneficia trabalhador e empresa numa relação duradoura." },
    { prompt: "O que mantém a empresa capaz de inovar?", options: ["Remuneração sustentável", "Promessas inviáveis", "Custos sem controlo", "Desvalorização"], correct: 0, explanation: "Uma remuneração sustentável preserva capacidade de investir e inovar." },
    { prompt: "Qual prática pode reforçar esse equilíbrio?", options: ["Participação nos resultados", "Eliminar progressão", "Evitar formação", "Reduzir condições"], correct: 0, explanation: "Prémios e participação nos resultados podem ligar valor criado e remuneração." },
  ],
  "boas-praticas.definicao": [
    { prompt: "Boas práticas são apenas procedimentos?", options: ["Não, são cultura diária", "Sim, sem valores", "Apenas documentos", "Apenas regras externas"], correct: 0, explanation: "Boas práticas dependem de comportamentos consistentes, não apenas de procedimentos." },
    { prompt: "Quem beneficia de boas práticas?", options: ["Colaboradores, clientes e fornecedores", "Só gestores", "Só concorrentes", "Ninguém"], correct: 0, explanation: "Elas criam valor para todas as partes relacionadas com a empresa." },
    { prompt: "Como devem ser encaradas?", options: ["Como compromisso diário", "Como obrigação ocasional", "Como custo inútil", "Como exceção"], correct: 0, explanation: "A consistência diária transforma boas práticas em cultura." },
  ],
  "boas-praticas.beneficios": [
    { prompt: "Qual benefício reduz falhas?", options: ["Redução de erros", "Mais desperdício", "Menos planeamento", "Pior comunicação"], correct: 0, explanation: "Processos bem aplicados reduzem erros e desperdícios." },
    { prompt: "Como boas práticas afetam reputação?", options: ["Aumentam confiança", "Criam desconfiança", "Eliminam qualidade", "Impedem clientes"], correct: 0, explanation: "Consistência e responsabilidade fortalecem reputação e confiança." },
    { prompt: "Que resultado apoia crescimento sustentável?", options: ["Melhoria contínua", "Repetir erros", "Ignorar clientes", "Evitar colaboração"], correct: 0, explanation: "A melhoria contínua torna o crescimento mais sólido e sustentável." },
  ],
  "boas-praticas.aplicacao": [
    { prompt: "Onde se aplicam boas práticas?", options: ["Comunicação e planeamento", "Só finanças", "Só marketing", "Apenas liderança"], correct: 0, explanation: "Elas aplicam-se transversalmente, incluindo comunicação, qualidade e segurança." },
    { prompt: "Qual prática apoia o atendimento ao cliente?", options: ["Comunicação clara e respeito", "Ignorar pedidos", "Prometer sem cumprir", "Evitar soluções"], correct: 0, explanation: "Atendimento de qualidade exige comunicação, respeito e resposta responsável." },
    { prompt: "Como deve ser resolvido um problema?", options: ["Identificar causa e melhorar", "Ocultar o problema", "Culpar sem analisar", "Repetir o erro"], correct: 0, explanation: "Resolver problemas inclui analisar causas e prevenir repetição." },
  ],
  "boas-pessoas.definicao": [
    { prompt: "O que define boas pessoas?", options: ["Valores e atitudes positivas", "Competência técnica apenas", "Cargo elevado", "Lucro individual"], correct: 0, explanation: "Boas pessoas demonstram valores positivos nas relações diárias." },
    { prompt: "Porque estão no centro das relações?", options: ["As atitudes influenciam confiança", "Não afetam ninguém", "Substituem processos", "Eliminam responsabilidade"], correct: 0, explanation: "As escolhas individuais influenciam diretamente a qualidade das relações." },
    { prompt: "O que mostra uma escolha diária positiva?", options: ["Cumprir uma promessa", "Ignorar alguém", "Evitar responsabilidade", "Desrespeitar"], correct: 0, explanation: "Pequenos gestos, como cumprir promessas, constroem confiança." },
  ],
  "boas-pessoas.caracteristicas": [
    { prompt: "O que significa empatia?", options: ["Compreender perspetivas alheias", "Impor sempre a própria visão", "Ignorar sentimentos", "Evitar diálogo"], correct: 0, explanation: "Empatia é procurar compreender a experiência e perspetiva de outra pessoa." },
    { prompt: "Que valor sustenta confiança?", options: ["Honestidade", "Ocultação", "Manipulação", "Indiferença"], correct: 0, explanation: "Honestidade torna as relações mais claras e confiáveis." },
    { prompt: "Como se demonstra responsabilidade?", options: ["Assumir e reparar decisões", "Transferir sempre culpa", "Negar erros", "Evitar compromissos"], correct: 0, explanation: "Responsabilidade inclui reconhecer impacto e reparar quando necessário." },
  ],
  "boas-pessoas.impacto": [
    { prompt: "Que efeito criam boas atitudes?", options: ["Relações de confiança", "Isolamento", "Conflito constante", "Menos cooperação"], correct: 0, explanation: "Atitudes positivas fortalecem confiança e colaboração." },
    { prompt: "Como influenciam o ambiente de trabalho?", options: ["Tornam-no mais saudável", "Aumentam desrespeito", "Eliminam diálogo", "Criam medo"], correct: 0, explanation: "Respeito e cooperação ajudam a criar ambientes saudáveis." },
    { prompt: "Porque um bom exemplo se multiplica?", options: ["Inspira escolhas positivas", "Impede aprendizagem", "Só afeta uma pessoa", "Não tem impacto"], correct: 0, explanation: "O impacto pode inspirar outras pessoas a repetir comportamentos positivos." },
  ],
  "interligacoes.introducao": [
    { prompt: "Quantos pilares fundamentais o conteúdo apresenta?", options: ["Seis", "Quatro", "Cinco", "Sete"], correct: 0, explanation: "O TANGLE apresenta seis pilares fundamentais ligados entre si." },
    { prompt: "O que acontece quando melhora a formação das equipas?", options: ["Aumenta a competência", "Reduz qualidade", "Elimina clientes", "Impede investimento"], correct: 0, explanation: "Melhor formação aumenta competência, que melhora o serviço e os resultados." },
    { prompt: "Qual é a ideia central do TANGLE?", options: ["Tudo está ligado", "Cada área é isolada", "Só o lucro importa", "Não há consequências"], correct: 0, explanation: "Decisões, pessoas, processos e resultados influenciam-se continuamente." },
  ],
};

export const tangleQuizzes: readonly NodeQuiz[] = Object.entries(seedsByNodeId).map(
  ([nodeId, seeds]) => quiz(nodeId, seeds),
);

export function getQuizForNode(nodeId: string) {
  return tangleQuizzes.find((quizDefinition) => quizDefinition.nodeId === nodeId) ?? null;
}
