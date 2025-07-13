import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MeetingAnalysis } from "@shared/schema";

interface ProcessingCenterProps {
  transcript: string;
  topic: string;
  attendees: string;
  knownInfo: string;
  isProcessing: boolean;
  setIsProcessing: (value: boolean) => void;
  setAnalysis: (value: MeetingAnalysis | null) => void;
}

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

  const analyzeMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/analyze', {
        transcript,
        topic,
        attendees,
        knownInfo,
        mode: "standard",
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis);
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
    analyzeMutation.mutate();
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-6">
      {/* MAGI System Display */}
      <div className="relative">
        <div className="text-center mb-8">
          <div className="text-sm text-cyber-cyan mb-2 font-mono tracking-wider">MAGI SYSTEM</div>
          <div className="text-3xl font-bold cyber-glow animate-pulse">TOKYO-3</div>
          <div className="text-sm text-cyber-orange font-mono">NERV</div>
        </div>
        
        {/* Hexagonal MAGI Layout */}
        <div className="relative w-96 h-96 mx-auto">
          {/* Top Hexagon - Balthazar */}
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-32 magi-panel hex-clip flex items-center justify-center">
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-mono mb-1">MAGI</div>
              <div className="text-sm font-bold text-cyber-teal">BALTHAZAR-2</div>
              <div className="text-xs text-cyber-orange mt-1">承認</div>
            </div>
          </div>
          
          {/* Bottom Left Hexagon - Melchior */}
          <div className="absolute bottom-0 left-8 w-32 h-32 magi-panel hex-clip flex items-center justify-center">
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-mono mb-1">MAGI</div>
              <div className="text-sm font-bold text-cyber-teal">MELCHIOR-1</div>
              <div className="text-xs text-cyber-red mt-1">否定</div>
            </div>
          </div>
          
          {/* Bottom Right Hexagon - Casper */}
          <div className="absolute bottom-0 right-8 w-32 h-32 magi-panel hex-clip flex items-center justify-center">
            <div className="text-center relative z-10">
              <div className="text-xs text-cyber-cyan font-mono mb-1">MAGI</div>
              <div className="text-sm font-bold text-cyber-teal">CASPER-3</div>
              <div className="text-xs text-cyber-cyan mt-1">承認</div>
            </div>
          </div>
          
          {/* Connection Lines */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 384 384">
            <path d="M192 80 L120 260 L264 260 Z" fill="none" stroke="#FF4500" strokeWidth="2" opacity="0.6"/>
            <circle cx="192" cy="200" r="80" fill="none" stroke="#00FFFF" strokeWidth="1" opacity="0.3"/>
          </svg>
          
          {/* Central Status Display */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
            <div className="text-xs text-cyber-cyan font-mono mb-1">STATUS</div>
            <div className="text-sm font-bold text-cyber-orange">
              {isProcessing ? "PROCESSING" : "STANDBY"}
            </div>
          </div>
        </div>
      </div>
      
      {/* Main Recovery Button */}
      <div className="w-full max-w-md">
        <div className="auth-panel p-6 mb-4">
          <div className="text-center mb-4">
            <div className="text-sm text-cyber-cyan font-mono mb-2">NERV ONLY</div>
            <div className="text-xs text-cyber-orange font-mono">認証が必要です</div>
          </div>
          
          <Button
            onClick={handleRecovery}
            disabled={isProcessing || analyzeMutation.isPending}
            className="w-full nerv-unlock text-black px-8 py-4 rounded-lg font-bold text-xl transition-all animate-pulse-glow"
          >
            <div className="flex items-center justify-center space-x-2">
              <span>{isProcessing ? "PROCESSING..." : "SLIDE TO UNLOCK"}</span>
              <span className="text-2xl">▶</span>
            </div>
          </Button>
        </div>
        
        {/* Status Display */}
        <div className="text-center text-sm text-cyber-cyan font-mono">
          <div className="mb-2">
            {isProcessing 
              ? "RESULT OF THE DELIBERATION" 
              : "FINGERPRINT AUTHENTICATION"
            }
          </div>
          <div className="text-xs">
            {isProcessing 
              ? "MOTION: SELF-DESTRUCTION" 
              : "SYSTEM STATUS: STANDBY"
            }
          </div>
        </div>
      </div>
    </div>
  );
}
