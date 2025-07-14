import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MeetingAnalysis } from "@shared/schema";
import MagiGuide from "./MagiGuide";

interface ProcessingCenterProps {
  transcript: string;
  topic: string;
  attendees: string;
  knownInfo: string;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  setAnalysis: (value: MeetingAnalysis | null, mode?: string) => void;
}

type MagiMode = "melchior" | "balthasar" | "casper";

export default function ProcessingCenter({
  transcript,
  topic,
  attendees,
  knownInfo,
  isProcessing,
  setIsProcessing,
  setAnalysis,
}: ProcessingCenterProps) {
  const { toast } = useToast();
  const [selectedMode, setSelectedMode] = useState<MagiMode>("melchior");

  const analyzeMutation = useMutation({
    mutationFn: async (mode: MagiMode) => {
      const response = await apiRequest('POST', '/api/analyze', {
        transcript,
        topic,
        attendees,
        knownInfo,
        mode,
      });
      return response.json();
    },
    onSuccess: (data, variables) => {
      setAnalysis(data.analysis, variables);
      setIsProcessing(false);
      toast({
        title: "Analysis complete",
        description: "Meeting insights extracted successfully",
      });
    },
    onError: (error) => {
      setIsProcessing(false);
      toast({
        title: "Analysis failed",
        description: error instanceof Error ? error.message : "Failed to analyze meeting",
        variant: "destructive",
      });
    },
  });

  const handleRecovery = () => {
    if (!transcript.trim()) {
      toast({
        title: "No content to analyze",
        description: "Please provide a transcript or upload a file",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    analyzeMutation.mutate(selectedMode);
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* MAGI System Display */}
      <div className="relative">
        <div className="text-center mb-8">
          <div className="text-sm text-cyber-cyan mb-2 font-tektur tracking-wider">MAGI SYSTEM</div>
          <div className="text-3xl font-bold cyber-glow animate-pulse font-doto">TOKYO-3</div>
          <div className="text-sm text-cyber-orange font-tektur">NERV</div>
          <div className="mt-4">
            <MagiGuide />
          </div>
        </div>
        
        {/* Hexagonal MAGI Layout */}
        <div className="relative w-96 h-96 mx-auto">
          {/* Top Hexagon - Balthasar */}
          <button
            onClick={() => setSelectedMode("balthasar")}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 hex-clip flex items-center justify-center cursor-pointer z-10 magi-button magi-sync-animation magi-delay-2 ${
              selectedMode === "balthasar" 
                ? "magi-panel animate-pulse-glow scale-110" 
                : "bg-cyber-panel cyber-border hover:magi-panel"
            }`}
          >
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-tektur mb-1">MAGI</div>
              <div className={`text-sm font-bold font-tourney ${selectedMode === "balthasar" ? "text-cyber-orange" : "text-cyber-teal"}`}>BALTHASAR-2</div>
              <div className="text-xs text-cyber-orange mt-1 font-tektur">💡 STRATEGIST</div>
            </div>
          </button>
          
          {/* Bottom Left Hexagon - Melchior */}
          <button
            onClick={() => setSelectedMode("melchior")}
            className={`absolute bottom-0 left-8 w-32 h-32 hex-clip flex items-center justify-center cursor-pointer z-10 magi-button magi-sync-animation magi-delay-1 ${
              selectedMode === "melchior" 
                ? "magi-panel animate-pulse-glow scale-110" 
                : "bg-cyber-panel cyber-border hover:magi-panel"
            }`}
          >
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-tektur mb-1">MAGI</div>
              <div className={`text-sm font-bold font-tourney ${selectedMode === "melchior" ? "text-cyber-orange" : "text-cyber-teal"}`}>MELCHIOR-1</div>
              <div className="text-xs text-cyber-red mt-1 font-tektur">📊 ANALYST</div>
            </div>
          </button>
          
          {/* Bottom Right Hexagon - Casper */}
          <button
            onClick={() => setSelectedMode("casper")}
            className={`absolute bottom-0 right-8 w-32 h-32 hex-clip flex items-center justify-center cursor-pointer z-10 magi-button magi-sync-animation magi-delay-3 ${
              selectedMode === "casper" 
                ? "magi-panel animate-pulse-glow scale-110" 
                : "bg-cyber-panel cyber-border hover:magi-panel"
            }`}
          >
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-tektur mb-1">MAGI</div>
              <div className={`text-sm font-bold font-tourney ${selectedMode === "casper" ? "text-cyber-orange" : "text-cyber-teal"}`}>CASPER-3</div>
              <div className="text-xs text-cyber-cyan mt-1 font-tektur">🧬 HUMAN</div>
            </div>
          </button>
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 384 384" style={{ zIndex: 1 }}>
            <path 
              d="M192 80 L120 260 L264 260 Z" 
              fill="none" 
              stroke="#FF4500" 
              strokeWidth="2" 
              opacity={selectedMode ? "0.8" : "0.6"}
              className={selectedMode ? "animate-pulse" : ""}
            />
            <circle 
              cx="192" 
              cy="200" 
              r="80" 
              fill="none" 
              stroke="#00FFFF" 
              strokeWidth="1" 
              opacity={selectedMode ? "0.5" : "0.3"}
              className={selectedMode ? "animate-pulse" : ""}
            />
          </svg>
          
          {/* Central Status Display */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-5">
            <div className="text-xs text-cyber-cyan font-tektur mb-1">MODE</div>
            <div className="text-sm font-bold text-cyber-orange font-doto">
              {isProcessing ? "PROCESSING" : selectedMode.toUpperCase()}
            </div>
            <div className="text-xs text-cyber-teal mt-1 font-tektur">
              {selectedMode === "melchior" && "FACTUAL ANALYSIS"}
              {selectedMode === "balthasar" && "STRATEGIC FOCUS"}
              {selectedMode === "casper" && "HUMAN DYNAMICS"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Recovery Button */}
      <div className="w-full max-w-md">
        <div className="auth-panel p-6 mb-4">
          <div className="text-center mb-4">
            <div className="text-sm text-cyber-cyan font-tektur mb-2">NERV ONLY</div>
            <div className="text-xs text-cyber-orange font-tektur">認証が必要です</div>
          </div>
          
          <Button
            onClick={handleRecovery}
            disabled={isProcessing || analyzeMutation.isPending}
            className="w-full nerv-unlock text-black px-8 py-4 rounded-lg font-bold text-xl transition-all animate-pulse-glow"
          >
            <div className="flex items-center justify-center space-x-2 font-doto">
              <span>{isProcessing ? "PROCESSING..." : `ANALYZE WITH ${selectedMode.toUpperCase()}`}</span>
              <span className="text-2xl">▶</span>
            </div>
          </Button>
        </div>
        
        {/* Status Display */}
        <div className="text-center text-sm text-cyber-cyan font-tektur">
          <div className="mb-2">
            {isProcessing 
              ? "RESULT OF THE DELIBERATION" 
              : `MAGI ${selectedMode.toUpperCase()} SELECTED`
            }
          </div>
          <div className="text-xs">
            {isProcessing 
              ? "PROCESSING..." 
              : selectedMode === "melchior" ? "FACTUAL ANALYSIS MODE" :
                selectedMode === "balthasar" ? "STRATEGIC ANALYSIS MODE" :
                "HUMAN DYNAMICS MODE"
            }
          </div>
          {!isProcessing && (
            <div className="text-xs text-cyber-orange mt-2 animate-pulse">
              Click other MAGI units to switch analysis modes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
