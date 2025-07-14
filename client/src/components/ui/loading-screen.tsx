import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

interface LoadingScreenProps {
  variant?: "magi" | "neural" | "data" | "quantum";
  message?: string;
  progress?: number;
  className?: string;
}

export default function LoadingScreen({ 
  variant = "magi", 
  message = "INITIALIZING MAGI SYSTEM...",
  progress,
  className 
}: LoadingScreenProps) {
  const [dots, setDots] = useState("");
  const [scanLine, setScanLine] = useState(0);
  const [glitchText, setGlitchText] = useState(message);

  useEffect(() => {
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanLine(prev => (prev + 1) % 100);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (variant === "quantum") {
      const interval = setInterval(() => {
        const glitchChars = "!@#$%^&*()_+-=[]{}|;:,.<>?";
        const shouldGlitch = Math.random() < 0.1;
        
        if (shouldGlitch) {
          const randomChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
          const randomIndex = Math.floor(Math.random() * message.length);
          setGlitchText(message.substring(0, randomIndex) + randomChar + message.substring(randomIndex + 1));
          
          setTimeout(() => setGlitchText(message), 100);
        }
      }, 200);
      return () => clearInterval(interval);
    }
  }, [variant, message]);

  const renderMAGILoader = () => (
    <div className="relative w-96 h-96 mx-auto">
      {/* Rotating hexagon */}
      <div className="absolute inset-0 animate-spin-slow">
        <div className="w-32 h-32 mx-auto mt-32 hex-clip bg-gradient-to-br from-cyber-orange to-cyber-red opacity-20 animate-pulse"></div>
      </div>
      
      {/* MAGI cores */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 hex-clip bg-cyber-orange animate-pulse-glow"></div>
      <div className="absolute bottom-8 left-16 w-16 h-16 hex-clip bg-cyber-cyan animate-pulse-glow animation-delay-1000"></div>
      <div className="absolute bottom-8 right-16 w-16 h-16 hex-clip bg-cyber-red animate-pulse-glow animation-delay-2000"></div>
      
      {/* Connection lines */}
      <svg className="absolute inset-0 w-full h-full">
        <path 
          d="M192 80 L120 260 L264 260 Z" 
          fill="none" 
          stroke="url(#gradient)" 
          strokeWidth="2"
          className="animate-pulse"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00BFFF" />
            <stop offset="50%" stopColor="#FF4500" />
            <stop offset="100%" stopColor="#FF0000" />
          </linearGradient>
        </defs>
      </svg>
      
      {/* Central processing indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyber-orange rounded-full animate-ping"></div>
    </div>
  );

  const renderNeuralLoader = () => (
    <div className="relative w-80 h-80 mx-auto">
      {/* Neural network nodes */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute w-4 h-4 bg-cyber-cyan rounded-full animate-pulse"
          style={{
            top: `${50 + 30 * Math.sin(i * 30 * Math.PI / 180)}%`,
            left: `${50 + 30 * Math.cos(i * 30 * Math.PI / 180)}%`,
            animationDelay: `${i * 100}ms`
          }}
        />
      ))}
      
      {/* Neural connections */}
      <svg className="absolute inset-0 w-full h-full">
        {[...Array(12)].map((_, i) => (
          <line
            key={i}
            x1="50%"
            y1="50%"
            x2={`${50 + 30 * Math.cos(i * 30 * Math.PI / 180)}%`}
            y2={`${50 + 30 * Math.sin(i * 30 * Math.PI / 180)}%`}
            stroke="#00BFFF"
            strokeWidth="1"
            opacity="0.6"
            className="animate-pulse"
            style={{ animationDelay: `${i * 100}ms` }}
          />
        ))}
      </svg>
      
      {/* Central processing core */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyber-orange rounded-full animate-pulse-glow"></div>
    </div>
  );

  const renderDataLoader = () => (
    <div className="relative w-full max-w-md mx-auto">
      {/* Data streams */}
      <div className="space-y-2">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="flex items-center space-x-2 animate-slide-in"
            style={{ animationDelay: `${i * 200}ms` }}
          >
            <div className="w-2 h-2 bg-cyber-cyan rounded-full animate-pulse"></div>
            <div className="flex-1 h-1 bg-cyber-panel rounded overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-orange animate-data-flow"
                style={{ animationDelay: `${i * 100}ms` }}
              ></div>
            </div>
            <div className="text-xs text-cyber-cyan font-mono">
              {Math.random() > 0.5 ? "OK" : "..."}
            </div>
          </div>
        ))}
      </div>
      
      {/* Scan line effect */}
      <div 
        className="absolute left-0 w-full h-0.5 bg-cyber-orange shadow-glow transition-all duration-100"
        style={{ top: `${scanLine}%` }}
      ></div>
    </div>
  );

  const renderQuantumLoader = () => (
    <div className="relative w-64 h-64 mx-auto">
      {/* Quantum particles */}
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="absolute w-2 h-2 bg-cyber-cyan rounded-full animate-quantum-float"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            animationDelay: `${i * 50}ms`,
            animationDuration: `${2000 + Math.random() * 1000}ms`
          }}
        />
      ))}
      
      {/* Quantum field */}
      <div className="absolute inset-0 border-2 border-cyber-orange rounded-full animate-quantum-pulse"></div>
      <div className="absolute inset-4 border-2 border-cyber-cyan rounded-full animate-quantum-pulse animation-delay-500"></div>
      <div className="absolute inset-8 border-2 border-cyber-red rounded-full animate-quantum-pulse animation-delay-1000"></div>
      
      {/* Central quantum core */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-cyber-orange rounded-full animate-quantum-spin"></div>
    </div>
  );

  const renderLoader = () => {
    switch (variant) {
      case "magi":
        return renderMAGILoader();
      case "neural":
        return renderNeuralLoader();
      case "data":
        return renderDataLoader();
      case "quantum":
        return renderQuantumLoader();
      default:
        return renderMAGILoader();
    }
  };

  return (
    <div className={cn(
      "fixed inset-0 bg-cyber-bg/95 backdrop-blur-sm flex flex-col items-center justify-center z-50",
      className
    )}>
      {renderLoader()}
      
      {/* Loading text */}
      <div className="mt-8 text-center">
        <div className="text-cyber-orange font-mono text-lg mb-2">
          {variant === "quantum" ? glitchText : message}
          <span className="animate-pulse">{dots}</span>
        </div>
        
        {progress !== undefined && (
          <div className="w-80 h-2 bg-cyber-panel rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-orange transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <div className="text-cyber-cyan text-sm mt-2 font-mono">
          {variant === "magi" && "SYNCHRONIZING MAGI CORES..."}
          {variant === "neural" && "ESTABLISHING NEURAL PATHWAYS..."}
          {variant === "data" && "PROCESSING DATA STREAMS..."}
          {variant === "quantum" && "QUANTUM FIELD STABILIZATION..."}
        </div>
      </div>
    </div>
  );
}