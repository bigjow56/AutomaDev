import { useEffect, useState } from "react";

export function useWelcomeMessage() {
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Verifica se a mensagem já foi mostrada nesta sessão
    const hasShownWelcome = sessionStorage.getItem('welcome-message-shown');
    
    if (!hasShownWelcome) {
      // Mostra a mensagem após 1 segundo para dar tempo da página carregar
      const timer = setTimeout(() => {
        setShowWelcome(true);
        sessionStorage.setItem('welcome-message-shown', 'true');
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, []);

  const dismissWelcome = () => {
    setShowWelcome(false);
  };

  return {
    showWelcome,
    dismissWelcome,
  };
}