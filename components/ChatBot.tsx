"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Simple markdown parser for basic formatting
const formatMarkdown = (text: string) => {
  return text
    // Bold text
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Links
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">$1</a>')
    // Line breaks
    .replace(/\n/g, '<br />');
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Welcome to Mafi Restaurant! I'm here to help with reservations, menu details, meeting halls, or any questions. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);



  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const historyPayload = messages
        .filter(m => m.id > 1) // Skip the first welcome message to save tokens
        .map(m => ({
          role: m.isBot ? "model" : "user",
          text: m.text
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: inputMessage,
          history: historyPayload
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error("Failed to fetch AI response");
      }

      let data: { reply?: string; sources?: Array<{ id: string; section: string }> } = {};
      try {
        data = await response.json();
      } catch {
        data = {};
      }
      const botResponseRaw = typeof data.reply === "string" ? data.reply : "";
      const safeReply =
        botResponseRaw.trim() ||
        "I don't have that information right now. Please contact us if the issue persists.";

      const botMessage: Message = {
        id: messages.length + 2,
        text: safeReply,
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: unknown) {
      console.error("Error sending message to API:", error);
      const errorMessage: Message = {
        id: messages.length + 2,
        text: (error as Error)?.name === 'AbortError'
          ? "Request timed out. Please try again."
          : "Sorry, I'm having trouble connecting right now. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-2xl z-50 bg-primary hover:bg-primary-glow transition-all duration-300 transform hover:scale-105 group"
        size="icon"
      >
        {isOpen ? (
          <X className="h-7 w-7 transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <MessageCircle className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
        )}
      </Button>

      {/* Chat Window & Backdrop */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm cursor-pointer animate-fade-in"
            onClick={() => setIsOpen(false)}
          />

          {/* Chat Window */}
          <div className="fixed bottom-28 right-6 w-96 max-w-[calc(100vw-3rem)] h-[550px] max-h-[calc(100vh-8rem)] bg-background/95 backdrop-blur-xl border border-primary/20 rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.3)] z-50 flex flex-col animate-slide-in-right overflow-hidden transition-all duration-300">
            <div className="p-4 border-b border-primary/20 bg-background/90 backdrop-blur-md rounded-t-3xl shadow-sm">
              <div className="flex items-center gap-4">
                <div className="relative flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center border border-primary/30 shadow-inner">
                    <MessageCircle className="h-5 w-5 text-primary" />
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-background rounded-full animate-pulse"></span>
                </div>
                <div className="flex flex-col">
                  <h3 className="font-serif font-bold text-foreground text-xl leading-none">Mafi AI</h3>
                  <p className="text-primary text-[10px] font-semibold uppercase tracking-widest mt-1">Concierge</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-5 overflow-y-auto space-y-6 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex w-full animate-fade-in ${message.isBot ? "justify-start" : "justify-end"}`}
                >
                  <div className={`flex flex-col relative max-w-[85%] ${message.isBot ? "items-start" : "items-end"}`}>
                    <div
                      className={`px-4 py-3 shadow-sm relative ${message.isBot
                        ? message.id === 1
                          ? "bg-background-subtle border border-primary/20 text-foreground rounded-2xl rounded-tl-sm"
                          : "bg-background border border-primary/10 text-foreground rounded-2xl rounded-tl-sm"
                        : "bg-primary text-primary-foreground shadow-gold rounded-2xl rounded-tr-sm"
                        }`}
                    >
                      <div className={`text-sm leading-relaxed break-words whitespace-pre-wrap ${message.isBot && message.id === 1 ? "font-serif text-[15px]" : ""}`}
                        dangerouslySetInnerHTML={{
                          __html: message.isBot ? formatMarkdown(message.text) : message.text
                        }}
                      />
                      <div className={`text-[9px] mt-1.5 opacity-70 flex ${message.isBot ? "justify-start" : "justify-end"}`}>
                        {formatTime(message.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="bg-background rounded-2xl p-4 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-primary rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-primary/10 bg-background/95 backdrop-blur-md rounded-b-3xl">
              <div className="flex items-center gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-background-accent border-0 focus-visible:ring-1 focus-visible:ring-primary/50 text-foreground px-4 py-5 rounded-xl transition-all duration-300 shadow-inner"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  variant="gold"
                  size="icon"
                  className="h-10 w-10 shrink-0 rounded-xl shadow-gold hover:shadow-glow transition-all duration-300 transform hover:-translate-y-1"
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="h-4 w-4 ml-0.5" />
                </Button>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChatBot;
