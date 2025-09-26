import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions, Container } from "@tsparticles/engine";
import { useTheme } from "next-themes";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { theme } = useTheme();

  // Initialize particles engine once
  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // Particles engine loaded successfully
  };

  const options: ISourceOptions = useMemo(
    () => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      const isMobile = window.innerWidth < 768;
      
      return {
        background: {
          color: {
            value: "transparent",
          },
        },
        fpsLimit: 60,
        interactivity: {
          detectsOn: "window",
          events: {
            onClick: {
              enable: !reducedMotion,
              mode: "push",
            },
            onHover: {
              enable: !reducedMotion,
              mode: "repulse",
            },
            resize: {
              enable: true,
            },
          },
          modes: {
            push: {
              quantity: 2,
            },
            repulse: {
              distance: 100,
              duration: 0.4,
            },
          },
        },
        particles: {
          color: {
            value: ["#ffffff", "#00ff88", "#0099ff", "#ffaa00"],
          },
          links: {
            color: theme === "dark" ? "#ffffff" : "#000000",
            distance: 200,
            enable: true,
            opacity: 0.3,
            width: 1,
          },
          move: {
            direction: "none",
            enable: !reducedMotion,
            outModes: {
              default: "bounce",
            },
            random: true,
            speed: reducedMotion ? 0.5 : 1,
            straight: false,
          },
          number: {
            density: {
              enable: true,
              area: 1000,
            },
            value: isMobile ? 30 : 60,
          },
          opacity: {
            value: { min: 0.3, max: 0.8 },
            animation: {
              enable: !reducedMotion,
              speed: 1,
              sync: false,
            },
          },
          shape: {
            type: ["circle", "triangle"],
          },
          size: {
            value: { min: 2, max: 6 },
            animation: {
              enable: !reducedMotion,
              speed: 2,
              sync: false,
            },
          },
          rotate: {
            value: 0,
            animation: {
              enable: !reducedMotion,
              speed: 10,
              sync: false,
            },
          },
        },
        detectRetina: true,
        pauseOnBlur: true,
        pauseOnOutsideViewport: true,
      };
    },
    [theme],
  );

  if (init) {
    return (
      <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true" role="presentation">
        <Particles
          id="tsparticles"
          particlesLoaded={particlesLoaded}
          options={options}
        />
      </div>
    );
  }

  return null;
};

export default ParticlesBackground;