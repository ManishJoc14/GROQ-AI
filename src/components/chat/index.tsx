"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { Send, Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

interface Message {
  role: "user" | "assistant";
  content: string;
}

const ChatComponent = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [greeting, setGreeting] = useState<string>("Good day");
  const [userName, setUserName] = useState<string>("User");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    const name = localStorage.getItem('username');
    if (name) {
      setUserName(name);
    } else {
      const name = prompt("What should I call you?") || "User";
      setUserName(name);
      localStorage.setItem('username', name);
    }
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "inherit";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();
      const assistantMessage: Message = { role: "assistant", content: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error fetching response:", error);
      const errorMessage: Message = {
        role: "assistant",
        content: "I apologize, but I encountered an error. Please try again or refresh the page."
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="max-h-screen bg-gradient-to-b from-slate-50 to-slate-100 flex flex-col items-center justify-center p-2">
      {/* Header with greeting */}
      <div className="flex items-center gap-3 my-2 animate-fade-in">
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white shadow-lg shadow-orange-200">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2L14.9587 9.95863L22.9174 12L14.9587 14.0414L12 22L9.04136 14.0414L1.08273 12L9.04136 9.95863L12 2Z" fill="currentColor" />
          </svg>
        </div>
        <h1 className="text-xl md:text-2xl font-semibold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          {greeting}, {userName}
        </h1>
      </div>
      <div className="w-full max-w-4xl flex flex-col h-[90vh]">

        {/* Chat area */}
        <Card className="flex-1 flex flex-col overflow-hidden border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardContent className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 animate-fade-in">
                <div className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-orange-100 to-rose-100 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#FF7F50" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">How can I help you today?</h3>
                <p className="text-gray-500 max-w-sm">
                  Ask me anything and I&apos;ll do my best to assist you with your questions.
                </p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "flex items-start gap-3 animate-slide-in",
                    msg.role === "user" ? "flex-row-reverse" : ""
                  )}
                >
                  <Avatar className={cn(
                    "h-8 w-8 rounded-full flex items-center justify-center text-white text-sm",
                    msg.role === "user"
                      ? "bg-gradient-to-br from-blue-500 to-indigo-600"
                      : "bg-gradient-to-br from-orange-400 to-rose-500"
                  )}>
                    {msg.role === "user" ? userName[0].toUpperCase() : "A"}
                  </Avatar>

                  <div className={cn(
                    "max-w-[80%] rounded-2xl px-4 py-3 shadow-sm",
                    msg.role === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "bg-white border border-gray-100"
                  )}>
                    <div className={cn(
                      "prose prose-sm max-w-none",
                      msg.role === "user" ? "prose-invert" : ""
                    )}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {msg.content}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))
            )}
            {loading && (
              <div className="flex items-start gap-3 animate-slide-in">
                <Avatar className="h-8 w-8 rounded-full bg-gradient-to-br from-orange-400 to-rose-500 flex items-center justify-center text-white text-sm">
                  A
                </Avatar>
                <div className="bg-white border border-gray-100 rounded-2xl px-4 py-3 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-orange-300 animate-bounce [animation-delay:-0.3s]"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-300 animate-bounce [animation-delay:-0.15s]"></div>
                    <div className="w-2 h-2 rounded-full bg-orange-300 animate-bounce"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <CardFooter className="px-3 border-t bg-white">
            <div className="relative w-full flex items-end gap-2">
              <Textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={messages.length === 0 ? "How can I help you today?" : "Continue the conversation..."}
                className="min-h-[52px] resize-none  rounded-xl border-gray-200 focus:border-orange-300 focus:ring focus:ring-orange-100 transition-all"
                rows={1}
              />
              <Button
                onClick={handleSubmit}
                disabled={!input.trim() || loading}
                size="icon"
                className="absolute bottom-2 right-2 h-9 w-9 rounded-lg bg-gradient-to-r from-orange-400 to-rose-500 hover:from-orange-500 hover:to-rose-600 text-white shadow-md shadow-orange-100 transition-all"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatComponent;
