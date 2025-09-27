import { motion } from "framer-motion";
import "./hero-logo.css";

export default function HeroLogo() {
  return (
    <div className="logo-container">
      {/* Anéis decorativos */}
      <div className="circuit-ring circuit-ring-1"></div>
      <div className="circuit-ring circuit-ring-2"></div>
      
      {/* Círculo principal */}
      <div className="main-circle">
        {/* Container da cobra */}
        <div className="snake-container">
          <div className="snake">
            {/* Corpo principal contínuo */}
            <div className="snake-body">
              <div className="snake-main-body"></div>
            </div>
            
            {/* Cabeça realista */}
            <div className="snake-head"></div>
            
            {/* Chapéu estiloso */}
            <div className="snake-hat"></div>
            
            {/* Olhos expressivos */}
            <div className="snake-eyes">
              <div className="snake-eye eye-left"></div>
              <div className="snake-eye eye-right"></div>
            </div>
            
            {/* Língua bifurcada */}
            <div className="snake-tongue"></div>
            
            {/* Cauda suave */}
            <div className="snake-tail"></div>
            
            {/* Chocalho aprimorado */}
            <div className="snake-rattle">
              <div className="rattle-segment rattle-1"></div>
              <div className="rattle-segment rattle-2"></div>
              <div className="rattle-segment rattle-3"></div>
            </div>
          </div>
        </div>
        
        {/* Letras orbitando */}
        <div className="orbiting-letters">
          <div className="letter-orbit letter-a">A</div>
          <div className="letter-orbit letter-d">D</div>
        </div>
      </div>
      
      {/* Partículas de código */}
      <div className="code-particle particle-1">&lt;/&gt;</div>
      <div className="code-particle particle-2">{`{}`}</div>
      <div className="code-particle particle-3">def</div>
      <div className="code-particle particle-4">[]</div>
      <div className="code-particle particle-5">py</div>
      <div className="code-particle particle-6">$</div>
      
      {/* Nome da empresa */}
      <div className="company-name">
        <span className="highlight">A</span>utoma<span className="highlight">D</span>ev
      </div>
      
      {/* Slogan */}
      <div className="slogan">Don't Tread on My Code</div>
    </div>
  );
}