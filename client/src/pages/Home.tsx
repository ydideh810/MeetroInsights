import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import UploadPanel from "@/components/UploadPanel";
import ProcessingCenter from "@/components/ProcessingCenter";
import OutputPanel from "@/components/OutputPanel";
import ExportButton from "@/components/ExportButton";
import ShinraiGuide from "@/components/ShinraiGuide";
import MemoryBank from "@/components/MemoryBank";
import AuthButton from "@/components/AuthButton";
import CreditDisplay from "@/components/CreditDisplay";

import ContextualGuidance from "@/components/ContextualGuidance";
import { ContentMode } from "@/components/ContentModeToggle";
import { MeetingAnalysis } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export default function Home() {
  const { user } = useAuth();
  const [transcript, setTranscript] = useState("");
  const [topic, setTopic] = useState("");
  const [attendees, setAttendees] = useState("");
  const [knownInfo, setKnownInfo] = useState("");
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentShinraiMode, setCurrentShinraiMode] = useState<string>("");
  const [showMemoryBank, setShowMemoryBank] = useState(false);

  const [analysisCount, setAnalysisCount] = useState(0);
  const [contentMode, setContentMode] = useState<ContentMode>("meetings");

  // Get user data for contextual guidance
  const { data: userData } = useQuery({
    queryKey: ['/api/user'],
    enabled: !!user,
  });

  // Get user meetings to check Memory Bank usage
  const { data: meetingsData } = useQuery({
    queryKey: ['/api/memory-bank/meetings'],
    enabled: !!user,
  });

  return (
    <div className="bg-cyber-bg text-cyber-orange font-mono min-h-screen">
      {/* Header */}
      <header className="border-b-2 border-cyber-orange bg-cyber-panel p-4 district-7-grid border-scan">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-4xl font-bold cyber-glow animate-flicker tracking-wider font-doto matrix-text">NEURAKEI</div>
            <div className="text-sm text-cyber-cyan">
              <div className="data-stream">SHINRAI RECOVERY SYSTEM</div>
              <div className="text-xs text-cyber-teal">DISTRICT-7 ZENTRA</div>
            </div>
          </div>
          <div className="flex items-center space-x-6">
            <Button
              onClick={() => setShowMemoryBank(!showMemoryBank)}
              className={`bg-cyber-panel border-2 border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-cyber-dark-panel transition-colors micro-hover scale-click button-glow cyber-ripple ${
                showMemoryBank ? 'bg-cyber-orange text-cyber-dark-panel' : ''
              }`}
            >
              <Database className="w-4 h-4 mr-2" />
              MEMORY BANK
            </Button>

            <ShinraiGuide />
            <CreditDisplay />
            <AuthButton analysis={analysis} />
            <div className="text-right text-xs text-cyber-cyan font-mono">
              <div>DIRECT LINK: <span className="text-cyber-orange">OPENROUTER-01</span></div>
              <div>ACCESS: <span className="text-cyber-orange animate-pulse">SUPERUSER</span></div>
              <div>STATUS: <span className="text-cyber-teal">ONLINE</span></div>
              <div className="mt-1 text-[10px] text-cyber-teal opacity-75">
                SYS: ONLINE | MEM: 45% | CPU: 23%
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Interface */}
      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen stagger-fade">
        <UploadPanel
          transcript={transcript}
          setTranscript={setTranscript}
          topic={topic}
          setTopic={setTopic}
          attendees={attendees}
          setAttendees={setAttendees}
          knownInfo={knownInfo}
          setKnownInfo={setKnownInfo}
          setIsProcessing={setIsProcessing}
          setAnalysis={setAnalysis}
          contentMode={contentMode}
          setContentMode={setContentMode}
        />
        
        <ProcessingCenter
          transcript={transcript}
          topic={topic}
          attendees={attendees}
          knownInfo={knownInfo}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setAnalysis={(analysis, mode) => {
            setAnalysis(analysis);
            setCurrentShinraiMode(mode || "synthrax");
            if (analysis) {
              setAnalysisCount(prev => prev + 1);
            }
          }}
          contentMode={contentMode}
        />
        
        {showMemoryBank ? (
          <MemoryBank />
        ) : (
          <OutputPanel 
            analysis={analysis} 
            transcript={transcript}
            topic={topic}
            attendees={attendees}
            knownInfo={knownInfo}
            shinraiMode={currentShinraiMode}
          />
        )}
      </main>



      {/* Contextual AI Guidance */}
      <ContextualGuidance
        transcript={transcript}
        hasAnalysis={!!analysis}
        isProcessing={isProcessing}
        userCredits={userData?.user?.credits || 0}
        hasUsedMemoryBank={!!meetingsData?.meetings?.length}
        analysisCount={analysisCount}
      />

    </div>
  );
}
