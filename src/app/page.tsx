'use client';

import { useChat } from "@ai-sdk/react";
import { useState, useRef, useEffect } from "react";
import CarDetail from "~/components/ui/CarDetail";

export default function HomePage() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [selectedQuestion, setSelectedQuestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const suggestionQuestions = [
    "Quais carros estão disponíveis em São Paulo?",
    "Gostaria de ver um BYD Dolphin",
    "Estou procurando um carro em Porto Alegre",
    "Quais modelos de carros estão em torno de R$100.000?"
  ];

  const handleSuggestionClick = (question: string) => {
    setSelectedQuestion(question);
    handleInputChange({ target: { value: question } } as React.ChangeEvent<HTMLInputElement>);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-white">
      <div className="p-4 bg-yellow-100">
        <h3 className="mb-2 text-lg font-semibold">Perguntas sugeridas:</h3>
        <div className="flex flex-wrap gap-2">
          {suggestionQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(question)}
              className="px-3 py-1 text-sm border rounded-full bg-yellow-200 hover:bg-yellow-300 transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Faça uma pergunta sobre nossos carros!
            </div>
          ) : (
            messages.map((m: any) => (
              <div
                key={m.id}
                className={`p-4 rounded-lg whitespace-pre-wrap ${m.role === "user" ? "bg-yellow-100 ml-12" : "bg-gray-100 mr-12"
                  }`}
              >
                <div className="font-bold mb-1">{m.role === "user" ? "Você" : "Assistente"}</div>
                <div>{m.content}</div>

                <div>
                  {m.toolInvocations?.map((toolInvocation: any) => {
                    const { toolName, toolCallId, state } = toolInvocation;

                    if (state === 'result') {
                      if (toolName === 'getCarInfo') {
                        const { result } = toolInvocation;

                        if (result && Array.isArray(result) && result.length > 0) {
                          const mainCar = result[0];
                          const recommendedCars = result.slice(1);

                          return (
                            <div key={toolCallId} className="mt-4">
                              <CarDetail
                                mainCar={mainCar}
                                recommendedCars={recommendedCars}
                              />
                            </div>
                          );
                        }
                      }
                    } else {
                      return (
                        <div key={toolCallId}>
                          {toolName === 'getCarInfo' ? (
                            <div className="mt-2 italic text-sm text-yellow-600">
                              Buscando informações dos carros...
                            </div>
                          ) : null}
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="sticky bottom-0 p-4 border-t bg-white">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            value={input}
            placeholder="Digite sua pergunta sobre carros..."
            onChange={handleInputChange}
          />
          <button
            type="submit"
            className="px-6 py-3 font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
