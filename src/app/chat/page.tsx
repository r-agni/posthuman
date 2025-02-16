"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, Bot } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

export default function ChatBox() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: userInput }]);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          input: userInput,
          history: messages
            .map(
              (msg) => `${msg.role === "user" ? "You" : "Me"}: ${msg.content}`
            )
            .join("\n"),
        }),
      });

      const data = await response.json();
      setMessages((prev) => [...prev, { role: "ai", content: data.response }]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      setMessages((prev) => [
        ...prev,
        {
          role: "ai",
          content: "Sorry, I encountered an error. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatEndRef]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="flex flex-col w-full h-[600px] p-4 bg-gray-50 rounded-lg shadow-lg">
      <div className="bg-white p-4 rounded-t-lg shadow-sm border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">
          Hey I'm Jeffrey!
        </h2>
      </div>

      {/* Chat Window */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex items-start mb-4 ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "ai" && (
              <div className="w-8 h-8 rounded-full bg-[#93c57c] flex items-center justify-center mr-2">
                <Bot className="w-5 h-5 text-white" />
              </div>
            )}
            <div
              className={`p-3 rounded-full max-w-[70%] ${
                msg.role === "user"
                  ? "bg-[#93c57c] text-white"
                  : "bg-white text-gray-800 border border-gray-200"
              }`}
            >
              <p className="text-sm">{msg.content}</p>
            </div>
            {msg.role === "user" && (
              <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center ml-2">
                <User className="w-5 h-5 text-gray-600" />
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div className="flex items-center text-gray-500 text-sm">
            <div className="w-8 h-8 rounded-full bg-[#93c57c] flex items-center justify-center mr-2">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-3">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="mt-4 flex items-center bg-white p-2 rounded-b-lg shadow-sm border border-gray-200">
        <input
          ref={inputRef}
          type="text"
          className="flex-1 p-2 text-sm border-none outline-none bg-transparent text-gray-800"
          placeholder="Type your message..."
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          className="ml-2 p-2 bg-[#93c57c] text-white rounded-full hover:bg-[#7fbf6e] transition-colors focus:outline-none focus:ring-2 focus:ring-green-300"
          onClick={handleSend}
        >
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
