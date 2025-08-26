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
      
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: inputMessage }),
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
        className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-2xl z-50 bg-primary hover:bg-primary-glow transition-all duration-300 transform hover:scale-110 group"
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
          <div className="fixed bottom-28 right-6 w-96 h-[500px] bg-background border border-primary/30 rounded-3xl shadow-2xl z-50 flex flex-col animate-slide-in-right overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-primary/20 bg-gradient-to-r from-background-subtle to-background-accent rounded-t-3xl">
              <div className="flex items-center gap-3">
                <div>
                  <h3 className="font-bold text-primary text-lg">Mafi AI</h3>
                  <p className="text-foreground-muted text-sm">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-background-subtle/30 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  }`}
                >
                  <div className="flex gap-3 max-w-[85%]">
                    <div className="space-y-1">
                      <div
                        className={`rounded-2xl ${
                          message.isBot
                            ? message.id === 1 
                              ? "p-4 bg-gradient-to-r from-primary/10 to-primary/5 text-foreground border-2 border-primary/30 shadow-lg"
                              : "p-4 bg-background text-foreground border border-primary/20 shadow-sm"
                            : "p-3 bg-primary text-primary-foreground shadow-gold"
                        }`}
                      >
                        <div className={`text-sm leading-relaxed ${
                          message.isBot && message.id === 1 ? "font-medium" : ""
                        }`}
                        dangerouslySetInnerHTML={{ 
                          __html: message.isBot ? formatMarkdown(message.text) : message.text 
                        }}
                        />
                      </div>
                      <p
                        className={`text-xs text-foreground-muted ${
                          message.isBot ? "text-left" : "text-right"
                        }`}
                      >
                        {formatTime(message.timestamp)}
                      </p>
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
            <div className="p-6 border-t border-primary/20 bg-background">
              <div className="flex gap-3">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 bg-background-subtle border-primary/20 text-foreground-accent focus:border-primary focus:ring-primary/20 transition-all duration-300"
                  disabled={isTyping}
                />
                <Button
                  onClick={handleSendMessage}
                  variant="gold"
                  size="icon"
                  className="shadow-gold hover:shadow-glow transition-all duration-300 transform hover:scale-105"
                  disabled={!inputMessage.trim() || isTyping}
                >
                  <Send className="h-4 w-4" />
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
