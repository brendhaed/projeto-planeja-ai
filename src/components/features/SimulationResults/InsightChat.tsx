import ReactMarkdown from 'react-markdown';
import { useState, useEffect, useRef } from "react";
import { Send, RotateCcw } from "lucide-react"; 
import { aiService } from "../../../services/aiService";

interface Message {
  role: "user" | "model";
  text: string;
}

interface InsightChatProps {
  simulationId: string;
}

export function InsightChat({ simulationId }: InsightChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  // Guarda a última pergunta feita pelo usuário 
  const [lastUserQuestion, setLastUserQuestion] = useState<string>(""); 
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Carrega o histórico salvo no localStorage
  useEffect(() => {
    const savedChat = localStorage.getItem(`chat_history_${simulationId}`);
    if (savedChat) {
      try {
        const parsed = JSON.parse(savedChat);
        setMessages(parsed);
        
        // Recupera a última mensagem de usuário enviada no histórico
        const userMsgs = parsed.filter((m: Message) => m.role === "user");
        if (userMsgs.length > 0) {
          setLastUserQuestion(userMsgs[userMsgs.length - 1].text);
        }
      } catch (error) {
        console.error("Erro ao recuperar histórico do chat:", error);
        setMessages([]);
      }
    } else {
      setMessages([]);
      setLastUserQuestion("");
    }
  }, [simulationId]);
 
  // Scroll automático para a mensagem mais recente
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Função para disparar a chamada de API do chat
  const sendChatRequest = async (currentHistory: Message[]) => {
    setIsLoading(true);
    try {
      const response = await aiService.chat({
        simulationId,
        history: currentHistory,
      });

      const newMessagesList: Message[] = [...currentHistory, { role: "model", text: response }];
      
      setMessages(newMessagesList);
      localStorage.setItem(`chat_history_${simulationId}`, JSON.stringify(newMessagesList));
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
      setMessages((prev) => [
        ...prev,
        { role: "model", text: "Ops, ocorreu um erro ao gerar a resposta. Tente enviar novamente!" },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    setLastUserQuestion(userMessage); 
    const updatedMessages: Message[] = [...messages, { role: "user", text: userMessage }];
    setMessages(updatedMessages);

    await sendChatRequest(updatedMessages);
  };

  // Função para retransmitir a última pergunta
  const handleRetry = async () => {
    if (!lastUserQuestion || isLoading) return;

    // Limpa a interface
    let cleanedMessages = [...messages];
    if (
      cleanedMessages.length > 0 &&
      cleanedMessages[cleanedMessages.length - 1].text.includes("Ops, ocorreu um erro")
    ) {
      cleanedMessages.pop();
    }

    const lastMsgIsUser = cleanedMessages[cleanedMessages.length - 1]?.role === "user";
    if (!lastMsgIsUser) {
      cleanedMessages.push({ role: "user", text: lastUserQuestion });
    }

    setMessages(cleanedMessages);
    await sendChatRequest(cleanedMessages);
  };

  return (
    <div className="mt-6 border-t border-border pt-6 flex flex-col h-100">
      <span className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
        Dúvidas sobre o plano? Pergunte ao Mentor:
      </span>

      {/* Janela de mensagens do chat */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 mb-4 text-sm">
        {messages.length === 0 && (
          <p className="text-muted-foreground text-sm italic">
            Digite algo abaixo para começar a tirar suas dúvidas com o educador...
          </p>
        )}

        {messages.map((msg, index) => {
          const isUser = msg.role === "user";
          const isErrorMessage = !isUser && msg.text.includes("Ops, ocorreu um erro");
          
          return (
            <div
              key={index}
              className={`flex flex-col ${isUser ? "items-end" : "items-start"}`}
            >
              {/* Se for a mensagem de erro da IA, renderizamos um container lado-a-lado com o botão de reenvio */}
              <div className="flex items-center gap-2 max-w-[90%]">
                <div
                  className={`p-3.5 rounded-lg leading-relaxed shadow-sm ${
                    isUser
                      ? "bg-primary text-primary-foreground rounded-tr-none"
                      : "bg-muted text-foreground rounded-tl-none"
                  } ${isErrorMessage ? "border border-red-500/30 bg-red-500/5" : ""}`}
                >
                  <div className="whitespace-pre-line text-sm md:text-sm">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>

                {/* Ícone de tentar novamente (só aparece na última mensagem se for o balão de erro) */}
                {isErrorMessage && index === messages.length - 1 && (
                  <button
                    onClick={handleRetry}
                    disabled={isLoading}
                    title="Tentar enviar pergunta novamente"
                    className="p-2 rounded-full hover:bg-red-500/10 text-red-500 transition-colors disabled:opacity-50 shrink-0"
                  >
                    <RotateCcw className={`h-5 w-5 ${isLoading ? "animate-spin" : ""}`} />
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground italic">
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.3s]" />
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce [animation-delay:-0.15s]" />
            <span className="h-2 w-2 rounded-full bg-primary animate-bounce" />
            Mentor digitando...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input de envio do chat */}
      <form onSubmit={handleSendMessage} className="flex gap-2.5">
        <input
          id="chat-message"
          name="chat-message"
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Como reduzir custos? Posso atingir a meta antes?"
          className="flex-1 bg-muted rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary border border-border text-foreground placeholder:text-muted-foreground/70"
          disabled={isLoading}
        />
        <button
          type="submit"
          className="bg-primary text-primary-foreground p-3 rounded-md hover:opacity-90 disabled:opacity-50 flex items-center justify-center shrink-0 w-12 h-12"
          disabled={isLoading || !input.trim()}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}