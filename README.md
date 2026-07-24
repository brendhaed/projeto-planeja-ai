# 🚀 Planeja AI — Educador Financeiro Inteligente
Um assistente financeiro inteligente desenvolvido para ajudar estudantes do ensino médio, jovens aprendizes e estagiários a organizarem seu dinheiro de forma simples, descontraída e acessível.

## 🎯Sobre o projeto:
O Planeja AI resolve os problemas dos jovens ao administrar a mesada ou o primeiro salário de estágio/jovem aprendiz, oferecendo diagnósticos financeiros claros, sugestões práticas e métricas de viabilidade, além de permitir uma conversa interativa com um mentor financeiro virtual via Inteligência Artificial (Google Gemini).

## 🛠️ Tecnologias Utilizadas:
* **Front-end:** [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/)
* **Build Tool:** [Vite](https://vitejs.dev/)
* **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/)
* **Ícones:** [Lucide React](https://lucide.dev/)
* **Inteligência Artificial:** [Google Gemini API](https://ai.google.dev/) (Modelo `gemini-2.5-flash` / `gemini-1.5-flash`)
* **Hospedagem:** [Vercel](https://vercel.com/)

## Melhorias:
- 📜 Histórico de Simulações: Armazenamento das simulações passadas para que o jovem acompanhe sua evolução ao longo do tempo 
- 💬 Chat Interativo com o Mentor: Canal de diálogo direto com o Gemini (mantendo o histórico da conversa) para tirar dúvidas específicas sobre o planejamento.
- ⚡ Experiência do Usuário (UX): Telas com estados de carregamento (loadings) amigáveis e tratamento de erros claro.

## ⚙️ Como Executar a Aplicação Localmente

### Pré-requisitos
* Node.js (versão 18 ou superior)
* Gerenciador de pacotes (`npm`,`yarn`ou `pnpm`)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/brendhaed/projeto-planeja-ai.git
   cd projeto-planeja-ai
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env.local` na raiz do projeto e adicione sua chave da API do Gemini:
   ```env
   VITE_GEMINI_API_KEY=sua_chave_aqui
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em `http://localhost:5173`.

## 🧪 Como Testar o Fluxo Principal

1. **Gere um Planejamento:**
   * Na página inicial, insira seus dados financeiros (renda/salário, despesas e o objetivo que deseja alcançar).
   * Clique em gerar o diagnóstico.
2. **Analise os Resultados:**
   * Veja os insights gerados pela IA, a análise de viabilidade e as dicas práticas.
3. **Conversar com o Mentor (Chat):**
   * Role até a seção de chat e envie uma dúvida (ex: *"Como posso economizar nas minhas saídas no fim de semana?"*).
   * Verifique se o mentor responde de forma contextualizada mantendo o tom jovem e empático.
4. **Consulte o Histórico:**
   * Navegue até a aba **Histórico** e confirme se sua simulação foi salva com sucesso.


## 🧠 O que Aprendi Durante o Desafio:
- Integração com LLMs (IA Generativa): Como consumir a API do Gemini via client-side/fetch, estruturar prompts de sistema eficazes com persona/regras claras e tratar retornos em JSON.

- Gestão de Estado e Persistência: Implementação de navegação entre histórico e conversas mantendo os dados persistidos no navegador do usuário via localStorage.

- TypeScript em Produção: Identificação e resolução de erros estritos de tipagem (noUnusedLocals, validação de tipos em JSON) durante pipelines de CI/CD na Vercel.

- Resiliência de UI/UX: Estruturação de fluxos de exceção, tratando desde falhas de requisição de rede até formatação de respostas da IA para evitar erros em tela.

## 🔗 Links Úteis
* **Repositório:** [github.com/brendhaed/projeto-planeja-ai](https://github.com/brendhaed/projeto-planeja-ai)
