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
  const [sessionId] = useState(() => crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch chat messages
  const { data: messagesData } = useQuery({
    queryKey: ["/api/chat", sessionId],
    queryFn: () => apiRequest("GET", `/api/chat/${sessionId}`),
    enabled: isOpen,
  });

  const messages: ChatMessage[] = (messagesData as any)?.messages || [];

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (data: InsertChatMessage) => {
      return apiRequest("POST", "/api/chat", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", sessionId] });
      setMessage("");
    },
    onError: (error) => {
      console.error("Error sending message:", error);
    },
  });

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
          onClick={() => setIsOpen(!isOpen)}
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
            className="fixed bottom-24 right-6 w-80 h-96 bg-dark-secondary border border-dark-tertiary/30 rounded-2xl shadow-2xl z-40 flex flex-col overflow-hidden"
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className="bg-primary px-4 py-3 flex items-center justify-between text-white">
              <div className="flex items-center space-x-2">
                <Bot className="w-5 h-5" />
                <span className="font-semibold">Chat com IA</span>
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
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center text-gray-400 py-8">
                    <Bot className="w-12 h-12 mx-auto mb-3 text-primary" />
                    <p className="text-sm">
                      Olá! Sou a IA da AutomaDev. Como posso ajudar você hoje?
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
                          ? "bg-primary text-white ml-auto"
                          : "bg-dark-tertiary text-gray-200"
                      }`}
                      data-testid={`chat-message-${msg.isUser === "true" ? "user" : "ai"}`}
                    >
                      <div className="flex items-start space-x-2">
                        {msg.isUser === "false" && (
                          <Bot className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        )}
                        {msg.isUser === "true" && (
                          <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                        )}
                        <p className="text-sm leading-relaxed">{msg.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}

                {sendMessageMutation.isPending && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <div className="bg-dark-tertiary text-gray-200 px-3 py-2 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <Bot className="w-4 h-4 text-primary" />
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="border-t border-dark-tertiary/30 p-4">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 bg-dark border-dark-tertiary/30 text-white placeholder-gray-500 focus:border-primary"
                  disabled={sendMessageMutation.isPending}
                  data-testid="chat-input"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={!message.trim() || sendMessageMutation.isPending}
                  className="bg-primary hover:bg-primary-dark text-white px-3"
                  data-testid="chat-send-button"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}