import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MeetingAnalysis } from "@shared/schema";
import ShinraiGuide from "./ShinraiGuide";
import AIMentor from "./AIMentor";
import LoadingScreen from "@/components/ui/loading-screen";
import { ContentMode } from "./ContentModeToggle";
import { ExternalLink } from "lucide-react";

interface ProcessingCenterProps {
  transcript: string;
  topic: string;
  attendees: string;
  knownInfo: string;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  setAnalysis: (value: MeetingAnalysis | null, mode?: string) => void;
  contentMode: ContentMode;
}

type ShinraiMode = "synthrax" | "vantix" | "lymnia";

export default function ProcessingCenter({
  transcript,
  topic,
  attendees,
  knownInfo,
  isProcessing,
  setIsProcessing,
  setAnalysis,
  contentMode,
}: ProcessingCenterProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedMode, setSelectedMode] = useState<ShinraiMode>("synthrax");

  const analyzeMutation = useMutation({
    mutationFn: async (mode: ShinraiMode) => {
      const response = await apiRequest('POST', '/api/analyze', {
        transcript,
        topic,
        attendees,
        knownInfo,
        mode,
        contentMode,
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
    onError: (error: any) => {
      setIsProcessing(false);
      
      // Check if it's a credit-related error
      if (error.status === 402 || error.needsPayment) {
        toast({
          title: "Insufficient Credits",
          description: "You need more credits to continue analysis",
          variant: "destructive",
          action: (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => window.open("https://payhip.com/b/dAc53", "_blank")}
              className="ml-2"
            >
              Buy Credits
              <ExternalLink className="ml-1 h-3 w-3" />
            </Button>
          ),
        });
      } else {
        toast({
          title: "Analysis failed",
          description: error instanceof Error ? error.message : "Failed to analyze meeting",
          variant: "destructive",
        });
      }
      
      // Refresh user data to update credit display
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
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

  if (isProcessing) {
    return (
      <LoadingScreen 
        variant="magi" 
        message={`ACTIVATING ${selectedMode.toUpperCase()} SYSTEM`}
        className="relative"
      />
    );
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* SHINRAI System Display */}
      <div className="relative">
        <div className="text-center mb-8">
          <div className="text-sm text-cyber-cyan mb-2 font-tourney tracking-wider">TRI-CORE COGNITIVE SYSTEM</div>
          <div className="text-3xl font-bold cyber-glow animate-pulse font-doto">TOKYO-3</div>
          <div className="text-sm text-cyber-orange font-tourney">ZENTRA</div>
          <div className="mt-2 text-xs text-cyber-cyan/70 font-tourney">
            {contentMode === "meetings" && "MEETING RECOVERY PROTOCOL"}
            {contentMode === "socials" && "SOCIAL THREAD ANALYSIS"}
            {contentMode === "notes" && "COGNITIVE REORGANIZATION"}
          </div>
          <div className="mt-4 flex gap-2 justify-center">
            <ShinraiGuide />
            <AIMentor />
          </div>
        </div>
        
        {/* Hexagonal SHINRAI Layout */}
        <div className="relative w-96 h-96 mx-auto">
          {/* Top Hexagon - Vantix */}
          <button
            onClick={() => setSelectedMode("vantix")}
            className={`absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 hex-clip flex items-center justify-center cursor-pointer z-10 magi-button magi-sync-animation magi-delay-2 ${
              selectedMode === "vantix" 
                ? "magi-panel animate-pulse-glow scale-110" 
                : "bg-cyber-panel cyber-border hover:magi-panel"
            }`}
          >
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-tourney mb-1">SHINRAI</div>
              <div className={`text-sm font-bold font-tourney ${selectedMode === "vantix" ? "text-cyber-orange" : "text-cyber-teal"}`}>VANTIX-2</div>
              <div className="text-xs text-cyber-orange mt-1 font-tourney">💡 STRATEGIST</div>
            </div>
          </button>
          
          {/* Bottom Left Hexagon - Synthrax */}
          <button
            onClick={() => setSelectedMode("synthrax")}
            className={`absolute bottom-0 left-8 w-32 h-32 hex-clip flex items-center justify-center cursor-pointer z-10 magi-button magi-sync-animation magi-delay-1 ${
              selectedMode === "synthrax" 
                ? "magi-panel animate-pulse-glow scale-110" 
                : "bg-cyber-panel cyber-border hover:magi-panel"
            }`}
          >
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-tourney mb-1">SHINRAI</div>
              <div className={`text-sm font-bold font-tourney ${selectedMode === "synthrax" ? "text-cyber-orange" : "text-cyber-teal"}`}>SYNTHRAX-1</div>
              <div className="text-xs text-cyber-red mt-1 font-tourney">📊 ANALYST</div>
            </div>
          </button>
          
          {/* Bottom Right Hexagon - Lymnia */}
          <button
            onClick={() => setSelectedMode("lymnia")}
            className={`absolute bottom-0 right-8 w-32 h-32 hex-clip flex items-center justify-center cursor-pointer z-10 magi-button magi-sync-animation magi-delay-3 ${
              selectedMode === "lymnia" 
                ? "magi-panel animate-pulse-glow scale-110" 
                : "bg-cyber-panel cyber-border hover:magi-panel"
            }`}
          >
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-tourney mb-1">SHINRAI</div>
              <div className={`text-sm font-bold font-tourney ${selectedMode === "lymnia" ? "text-cyber-orange" : "text-cyber-teal"}`}>LYMNIA-3</div>
              <div className="text-xs text-cyber-cyan mt-1 font-tourney">🧬 HUMAN</div>
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
            <div className="text-xs text-cyber-cyan font-tourney mb-1">MODE</div>
            <div className="text-sm font-bold text-cyber-orange font-doto">
              {isProcessing ? "PROCESSING" : selectedMode.toUpperCase()}
            </div>
            <div className="text-xs text-cyber-teal mt-1 font-tourney">
              {selectedMode === "synthrax" && "FACTUAL ANALYSIS"}
              {selectedMode === "vantix" && "STRATEGIC FOCUS"}
              {selectedMode === "lymnia" && "HUMAN DYNAMICS"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Recovery Button */}
      <div className="w-full max-w-md">
        <div className="auth-panel p-6 mb-4">
          <div className="text-center mb-4">
            <div className="text-sm text-cyber-cyan font-tourney mb-2">ZENTRA ONLY</div>
            <div className="text-xs text-cyber-orange font-tourney">認証が必要です</div>
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
        <div className="text-center text-sm text-cyber-cyan font-tourney">
          <div className="mb-2">
            {isProcessing 
              ? "RESULT OF THE DELIBERATION" 
              : `SHINRAI ${selectedMode.toUpperCase()} SELECTED`
            }
          </div>
          <div className="text-xs">
            {isProcessing 
              ? "PROCESSING..." 
              : selectedMode === "synthrax" ? "FACTUAL ANALYSIS MODE" :
                selectedMode === "vantix" ? "STRATEGIC ANALYSIS MODE" :
                "HUMAN DYNAMICS MODE"
            }
          </div>
          {!isProcessing && (
            <div className="text-xs text-cyber-orange mt-2 animate-pulse">
              Click other SHINRAI units to switch analysis modes
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
