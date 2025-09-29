import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle } from "lucide-react";
import { useWelcomeMessage } from "@/hooks/use-welcome-message";

interface WelcomeMessageProps {
  onOpenChat: () => void;
}

export default function WelcomeMessage({ onOpenChat }: WelcomeMessageProps) {
  const { showWelcome, dismissWelcome } = useWelcomeMessage();

  const handleOpenChat = () => {
    dismissWelcome();
    onOpenChat();
  };

  return (
    <AnimatePresence>
      {showWelcome && (
        <motion.div
          className="fixed bottom-6 left-6 z-50 max-w-sm"
          initial={{ opacity: 0, x: -100, scale: 0.8 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -100, scale: 0.8 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.6
          }}
        >
          <div 
            className="relative bg-gradient-to-r from-primary to-secondary-purple text-white p-4 rounded-2xl shadow-2xl cursor-pointer hover:shadow-3xl transition-all duration-300 hover:scale-105"
            onClick={handleOpenChat}
            data-testid="welcome-message"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className="bg-white/20 p-2 rounded-full">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm mb-1">
                    Quer tirar dúvidas? Fale comigo
                  </p>
                  <p className="text-xs text-white/80">
                    Clique aqui para conversar 💬
                  </p>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  dismissWelcome();
                }}
                className="hover:bg-white/20 rounded-full p-1 transition-colors ml-2"
                data-testid="welcome-message-dismiss"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {/* Pulso animado para chamar atenção */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary-purple rounded-2xl opacity-30 pointer-events-none -z-10"
              animate={{ 
                scale: [1, 1.02, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}