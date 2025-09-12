import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage, InsertChatMessage } from "@shared/schema";

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [sessionId] = useState(() => {
    // Get or create session ID with persistence
    let id = sessionStorage.getItem('chat-session-id');
    if (!id) {
      id = crypto.randomUUID();
      sessionStorage.setItem('chat-session-id', id);
    }
    return id;
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [isTyping, setIsTyping] = useState(false);

  // Fetch chat messages
  const { data: messagesData, isLoading: messagesLoading, error } = useQuery({
    queryKey: [`/api/chat/${sessionId}`],
    queryFn: async () => {
      console.log("=== MAKING API REQUEST ===");
      console.log("URL:", `/api/chat/${sessionId}`);
      const response = await apiRequest("GET", `/api/chat/${sessionId}`);
      const data = await response.json();
      console.log("API Response JSON:", data);
      return data;
    },
    enabled: isOpen && !!sessionId,
    refetchInterval: 3000, // Refetch every 3 seconds to get new AI responses
  });

  const messages: ChatMessage[] = (messagesData as any)?.messages || [];

  console.log("=== CHAT WIDGET STATE ===");
  console.log("Session ID:", sessionId);
  console.log("Chat is open:", isOpen);
  console.log("Query enabled:", isOpen && !!sessionId);
  console.log("Messages data:", messagesData);
  console.log("Messages array:", messages);
  console.log("Query error:", error);
  console.log("Total messages found:", messages.length);

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: InsertChatMessage) => {
      setIsTyping(true);
      const result = await apiRequest("POST", "/api/chat", data);
      // Simulate AI thinking delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      return result;
    },
    onSuccess: () => {
      setIsTyping(false);
      queryClient.invalidateQueries({ queryKey: [`/api/chat/${sessionId}`] });
      setMessage("");
    },
    onError: (error) => {
      setIsTyping(false);
      console.error("Error sending message:", error);
    },
  });

  // Auto scroll to bottom
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, isOpen, isTyping]);

  // Format timestamp
  const formatTime = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;

    sendMessageMutation.mutate({
      sessionId,
      message: message.trim(),
      isUser: "true",
    });
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <Button
          onClick={() => {
            console.log("=== TOGGLING CHAT ===");
            console.log("Current isOpen:", isOpen);
            console.log("New isOpen:", !isOpen);
            setIsOpen(!isOpen);
          }}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary-dark text-white shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center"
          data-testid="chat-toggle-button"
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageCircle className="w-6 h-6" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-24 right-6 w-80 h-96 bg-white border border-gray-200 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden md:w-80 md:h-96 sm:w-72 sm:h-80 max-sm:fixed max-sm:inset-4 max-sm:w-auto max-sm:h-auto max-sm:bottom-4 max-sm:right-4 max-sm:left-4 max-sm:top-4"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-cyan-500 px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <div>
                  <span className="font-semibold block">AutomaDev Support</span>
                  <span className="text-xs opacity-90">Estamos aqui para ajudar!</span>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 rounded-full p-1 transition-colors"
                data-testid="chat-close-button"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <div className="text-4xl mb-3">🤖</div>
                    <h3 className="font-semibold text-gray-600 mb-2">👋 Olá!</h3>
                    <p className="text-sm">
                      Como posso te ajudar hoje?
                    </p>
                  </div>
                )}

                {messages.map((msg, index) => (
                  <motion.div
                    key={msg.id}
                    className={`flex ${msg.isUser === "true" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div
                      className={`max-w-[80%] px-3 py-2 rounded-2xl ${
                        msg.isUser === "true"
                          ? "bg-gradient-to-r from-emerald-600 to-cyan-500 text-white ml-auto rounded-br-md"
                          : "bg-white text-gray-800 border border-gray-200 rounded-bl-md shadow-sm"
                      }`}
                      data-testid={`chat-message-${msg.isUser === "true" ? "user" : "ai"}`}
                    >
                      <div className="space-y-1">
                        {msg.isUser === "false" && (
                          <div className="flex items-center space-x-1 mb-1">
                            <span className="text-sm">🤖</span>
                          </div>
                        )}
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                        <span className={`text-xs block mt-1 ${
                          msg.isUser === "true" ? "text-white/70" : "text-gray-500"
                        }`}>
                          {formatTime(msg.timestamp)}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-white text-gray-800 border border-gray-200 px-3 py-2 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">🤖</span>
                        <span className="text-sm text-gray-600 italic">Digitando</span>
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                          <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-500 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 rounded-full px-4"
                  disabled={sendMessageMutation.isPending || isTyping}
                  maxLength={500}
                  data-testid="chat-input"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!message.trim() || sendMessageMutation.isPending || isTyping}
                  className="bg-gradient-to-r from-emerald-600 to-cyan-500 hover:from-emerald-700 hover:to-cyan-600 text-white px-4 rounded-full shadow-sm transition-all duration-200 hover:shadow-md"
                  data-testid="chat-send-button"
                >
                  {sendMessageMutation.isPending || isTyping ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}