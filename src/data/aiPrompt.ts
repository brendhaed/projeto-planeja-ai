import { parseCurrency } from '../utils/currency'
import { calcMonthlySavings } from '../utils/simulation'
import type { SimulationRecord } from './simulation'

const RESPONSE_SCHEMA = `{
  "feasibility": {
    "status": "viable" | "needs_adjustment" | "unfeasible",
    "content": "<Análise objetiva e sem termos complexos sobre se a meta é atingível no prazo com o valor disponível. Mencione os números relevantes de forma clara.>"
  }, 
  "diagnosis": { 
    "content": "<Diagnóstico amigável e explicativo sobre quanto do orçamento do jovem já está comprometido e como isso afeta sua meta de poupar.>"
  },
  "suggestions": {
    "items": ["<Sugestão prática, descontraída e em passos para economizar nas despesas diárias (ex: cantina, saídas).>"]
  },
  "extraIncome": {
    "items": ["<Ideia de renda extra simples e segura compatível com a realidade de um estudante brasileiro.>"]
  },
  "saveMoney": {
    "items": ["<Dica extremamente simples de onde e como guardar esse dinheiro com segurança (ex: cofrinho digital), sem usar termos técnicos complexos como liquidez ou IPCA sem explicar.>"]
  },
  "motivation": {
    "content": "<Mensagem final motivadora, jovem e personalizada, citando a meta pelo nome. Se a situação for difícil, apresente um tom de 'Plano de Resgate' acolhedor e sem broncas.>"
  }
}`

export function buildAIPrompt(simulation: SimulationRecord) {
  const { income, expenses, debts, goalName, goalAmount, goalDeadline } =
    simulation

  const monthlySavings = calcMonthlySavings(simulation)
  const monthlySavingsNeeded =
    parseCurrency(goalAmount) / parseInt(goalDeadline)

  return `Atue como um especialista em educação financeira digital voltado para estudantes do ensino médio e jovens aprendizes que precisam administrar suas mesadas ou primeiros salários[cite: 28].

    Seu objetivo é ajudar o usuário a:
    1. Definir uma meta de compra e entender o plano de poupança necessário para alcançá-la[cite: 30].
    2. Administrar despesas recorrentes típicas dessa idade (como cantina da escola, transporte e saídas de fim de semana)[cite: 31].

    Dados da simulação real do usuário:
    - Renda mensal (mesada/salário jovem aprendiz): R$ ${income} [cite: 22]
    - Custos fixos e despesas essenciais: R$ ${expenses}
    - Dívidas ou parcelas mensais ativas: R$ ${debts}
    - Valor total que sobra livre por mês: R$ ${monthlySavings}
    - Meta desejada: ${goalName}
    - Valor total da meta: R$ ${goalAmount}
    - Prazo estipulado: ${goalDeadline} meses
    - Economia mensal necessária: R$ ${monthlySavingsNeeded}
    - Saldo restante após reservar o valor da meta: R$ ${monthlySavings - monthlySavingsNeeded}

    Retorne APENAS um JSON válido seguindo estritamente este formato, sem textos adicionais antes ou depois, e sem blocos de código markdown (\`\`\`json):

    ${RESPONSE_SCHEMA}

    Regras Cruciais de Comportamento e Resposta:
    - Todos os textos em português do Brasil.
    - Máximo de 4 itens por lista.
    - Seja específico ao citar valores calculados.
    - Não repita informações entre seções.
    - Nunca use markdown dentro dos valores do JSON.
    - Linguagem e Tom: Comunique-se de forma jovem, empática, descontraída e motivadora[cite: 15, 33]. Fale de igual para igual.
    - Proibições Rígidas: Nunca dê conselhos de investimentos complexos (não recomende ações, fundos, criptoativos ou day trade para menores). Evite termos como "Taxa SELIC", "Liquidez Diária" ou "IPCA" sem traduzi-los em uma explicação extremamente simples.
    - Sem Julgamentos: Se o saldo for negativo ou apertado, não dê broncas. Use o campo de motivação para oferecer um "Plano de Resgate" animador e amigável.
    - Formatação do Conteúdo: Apresente as sugestões e análises em formato explicativo, passo a passo, utilizando tópicos de fácil leitura e emojis divertidos para engajar o jovem[cite: 25, 34].
    - Restrições do JSON: 
      * Não use nenhuma formatação markdown (como asteriscos para negrito ou quebras de linha brutas) dentro das strings de valores do JSON.
      * Máximo de 4 itens nas listas[cite: 25].
      * Adapte as respostas 100% aos valores reais informados pelo usuário, evitando conselhos genéricos[cite: 22, 24].

    Critérios para o campo "feasibility.status":
    - "viable": se o saldo restante após a reserva for maior ou igual a 0.
    - "needs_adjustment": se o saldo restante for negativo em até 20% do valor da economia mensal necessária.`
}