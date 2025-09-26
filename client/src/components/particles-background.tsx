import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions, Container } from "@tsparticles/engine";
import { useTheme } from "next-themes";

const ParticlesBackground = () => {
  const [init, setInit] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // Particles loaded
  };

  const options: ISourceOptions = useMemo(
    () => ({
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
            enable: true,
            mode: "push",
          },
          onHover: {
            enable: true,
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
          enable: true,
          outModes: {
            default: "bounce",
          },
          random: true,
          speed: 1,
          straight: false,
        },
        number: {
          density: {
            enable: true,
            area: 1000,
          },
          value: 60,
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
          animation: {
            enable: true,
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
            enable: true,
            speed: 2,
            sync: false,
          },
        },
        rotate: {
          value: 0,
          animation: {
            enable: true,
            speed: 10,
            sync: false,
          },
        },
      },
      detectRetina: true,
      pauseOnBlur: true,
      pauseOnOutsideViewport: true,
    }),
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