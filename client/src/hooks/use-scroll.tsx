import { useState, useEffect } from 'react';

interface ScrollPosition {
  x: number;
  y: number;
}

interface ScrollDirection {
  direction: 'up' | 'down';
  isScrolling: boolean;
}

export function useScroll() {
  const [scrollPosition, setScrollPosition] = useState<ScrollPosition>({ x: 0, y: 0 });
  const [scrollDirection, setScrollDirection] = useState<ScrollDirection>({
    direction: 'down',
    isScrolling: false,
  });

  useEffect(() => {
    let lastScrollY = window.scrollY;
    let scrollTimer: NodeJS.Timeout;

    const updateScrollPosition = () => {
      const currentScrollY = window.scrollY;
      const currentScrollX = window.scrollX;

      setScrollPosition({ x: currentScrollX, y: currentScrollY });
      
      setScrollDirection({
        direction: currentScrollY > lastScrollY ? 'down' : 'up',
        isScrolling: true,
      });

      lastScrollY = currentScrollY;

      clearTimeout(scrollTimer);
      scrollTimer = setTimeout(() => {
        setScrollDirection(prev => ({ ...prev, isScrolling: false }));
      }, 150);
    };

    window.addEventListener('scroll', updateScrollPosition, { passive: true });

    return () => {
      window.removeEventListener('scroll', updateScrollPosition);
      clearTimeout(scrollTimer);
    };
  }, []);

  return { scrollPosition, scrollDirection };
}

export function useParallax(speed: number = 0.5) {
  const { scrollPosition } = useScroll();
  const [offset, setOffset] = useState(0);

  useEffect(() => {
    setOffset(scrollPosition.y * speed);
  }, [scrollPosition.y, speed]);

  return offset;
}

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateScrollProgress = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const currentProgress = (window.scrollY / totalHeight) * 100;
      setProgress(Math.min(Math.max(currentProgress, 0), 100));
    };

    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();

    return () => window.removeEventListener('scroll', updateScrollProgress);
  }, []);

  return progress;
}