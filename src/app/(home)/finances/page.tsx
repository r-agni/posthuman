"use client";

import { useState, useEffect, useRef } from "react";
import { Send, User, UserIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Message {
  role: "user" | "ai";
  content: string;
}

const LOCAL_STORAGE_KEY = "chatHistory";
const OPENAI_API_KEY =
  "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";

export default function ChatBox() {
  const [userInput, setUserInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const savedMessages = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    }
  }, [messages]);

  const handleSend = async () => {
    if (!userInput.trim()) return;

    const newUserMessage: Message = { role: "user", content: userInput };
    setMessages((prev) => [...prev, newUserMessage]);
    setUserInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENAI_API_KEY}`, // Use the OpenAI API key for authorization
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo", // Specify the model you want to use
            messages: [
              { role: "user", content: userInput },
              ...messages.map((msg) => ({
                role: msg.role,
                content: msg.content,
              })),
            ],
          }),
        }
      );

      const data = await response.json();
      const newAiMessage: Message = {
        role: "ai",
        content: data.choices[0].message.content,
      }; // Adjusted to match OpenAI response structure
      setMessages((prev) => [...prev, newAiMessage]);
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
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <Card className="h-[90vh] flex flex-col bg-gray-50 rounded-xl overflow-hidden">
      <div className="p-6 bg-white border-b border-gray-200 rounded-t-xl">
        <div className="max-w-7xl mx-auto flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-[#93c57c] flex items-center justify-center">
            <UserIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900">
              Send Crypto with Open AI
            </h1>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        <div className="max-w-7xl mx-auto">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex items-end mb-4 space-x-2 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="w-8 h-8 rounded-full bg-[#93c57c] flex items-center justify-center">
                  <UserIcon className="w-5 h-5 text-white" />
                </div>
              )}
              <div
                className={`px-4 py-3 rounded-2xl max-w-[70%] shadow-sm ${
                  msg.role === "user"
                    ? "bg-[#93c57c] text-white rounded-br-none"
                    : "bg-white text-gray-800 border border-gray-300 rounded-bl-none"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
              {msg.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-600" />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className="flex items-start space-x-2">
              <div className="w-8 h-8 rounded-full bg-[#93c57c] flex items-center justify-center">
                <UserIcon className="w-5 h-5 text-white" />
              </div>
              <div className="px-4 py-3 bg-white border border-gray-300 rounded-2xl">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-[#93c57c] rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-[#93c57c] rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-[#93c57c] rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>
      <div className="border-t border-gray-200 bg-white rounded-b-xl">
        <div className="max-w-7xl mx-auto p-4">
          <div className="flex items-center space-x-4 bg-gray-50 border-gray-200 border rounded-xl px-4 py-2 shadow-sm focus-within:shadow-md">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 p-2 text-sm border-none outline-none bg-transparent text-gray-800 placeholder-gray-400"
              placeholder="Type your message..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              className={`p-2 rounded-full ${
                userInput.trim()
                  ? "bg-[#93c57c] text-white hover:bg-[#7fbf6e]"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
              onClick={handleSend}
              disabled={!userInput.trim()}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 text-center">
            <button
              className="text-sm text-gray-500 hover:underline"
              onClick={() => {
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                setMessages([]);
              }}
            >
              Clear Chat History
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
}
