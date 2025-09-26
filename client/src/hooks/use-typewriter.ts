import { useState, useEffect } from 'react';

interface UseTypewriterOptions {
  text: string;
  speed?: number;
  delay?: number;
  showCursor?: boolean;
  cursorChar?: string;
}

export function useTypewriter({
  text,
  speed = 50,
  delay = 0,
  showCursor = false,
  cursorChar = '|'
}: UseTypewriterOptions) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const [showCursorState, setShowCursorState] = useState(showCursor);

  useEffect(() => {
    setDisplayedText('');
    setIsComplete(false);
    setShowCursorState(showCursor);

    const timeoutId = setTimeout(() => {
      let currentIndex = 0;
      
      const intervalId = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(intervalId);
          setIsComplete(true);
          
          // Hide cursor after completion if needed
          if (showCursor) {
            setTimeout(() => {
              setShowCursorState(false);
            }, 1000);
          }
        }
      }, speed);

      return () => clearInterval(intervalId);
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [text, speed, delay, showCursor]);

  // Cursor blinking effect
  useEffect(() => {
    if (!showCursorState) return;

    const cursorInterval = setInterval(() => {
      setShowCursorState(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, [showCursorState]);

  const textWithCursor = showCursor && showCursorState 
    ? displayedText + cursorChar 
    : displayedText;

  return {
    displayedText: textWithCursor,
    isComplete
  };
}