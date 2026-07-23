interface GeminiResponse {
  candidates: {
    content: {
      parts: { text: string }[]
    }
  }[]
}

export interface InsightData {
  feasibility: {
    status: 'viable' | 'needs_adjustment' | 'unfeasible'
    content: string
  }
  diagnosis: {
    content: string
  }
  suggestions: {
    items: string[]
  }
  extraIncome: {
    items: string[]
  }
  saveMoney: {
    items: string[]
  }
  motivation: {
    content: string
  }
}

// Tipagem para as mensagens do chat
export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const API_KEY = String(import.meta.env.VITE_GEMINI_API_KEY)
const MODEL_NAME = 'gemini-flash-latest'
const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`

const callGeminiAPI = async (contents: any[]) => {
  const response = await fetch(GEMINI_API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents }),
  })

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status}`)
  }

  return (await response.json()) as GeminiResponse
}

// Função existente para buscar os insights iniciais
export const getInsight = async (prompt: string) => {
  // Passa o prompt inicial no formato que a API espera
  const contents = [{ parts: [{ text: prompt }] }]
  const response = await callGeminiAPI(contents)
  const json = response.candidates[0].content.parts[0].text
  return JSON.parse(json) as InsightData 
}
 
//  Envia o histórico completo das mensagens para o Gemini manter o contexto do diálogo
export const chat = async ({ 
  simulationId: _simulationId, 
  history 
}: { 
  simulationId: string; 
  history: ChatMessage[] 
}) => {
  // Prompt de sistema para chatbot
  const systemPrompt = `Você é o Mentor do aplicativo "Planeja AI", um especialista em educação financeira digital amigável para estudantes do ensino médio e jovens aprendizes.
  Seu objetivo é tirar as dúvidas desse jovem sobre o planejamento dele.
  Regras cruciais:
  - Fale de forma jovem, descontraída e empática (use gírias leves se fizer sentido, sem forçar a barra).
  - Nunca recomende investimentos complexos (ações, day trade, cripto). 
  - Nunca dê broncas. Se ele estiver no vermelho, apresente soluções e conforto.
  - Seja direto, dê passos práticos e fáceis de ler no celular.`

  // Mapeia o histórico de conversas para o formato aceito pelo payload da API do Gemini.

  const formattedContents = [
    {
      role: 'user', 
      parts: [{ text: systemPrompt }]
    },
    ...history.map((msg) => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }))
  ]

  const response = await callGeminiAPI(formattedContents)
  return response.candidates[0].content.parts[0].text
}

export const aiService = {
  getInsight,
  chat
}