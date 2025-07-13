import { useState } from "react";
import UploadPanel from "@/components/UploadPanel";
import ProcessingCenter from "@/components/ProcessingCenter";
import OutputPanel from "@/components/OutputPanel";
import ExportBar from "@/components/ExportBar";
import { MeetingAnalysis } from "@shared/schema";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [topic, setTopic] = useState("");
  const [attendees, setAttendees] = useState("");
  const [knownInfo, setKnownInfo] = useState("");
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <div className="bg-cyber-bg text-cyber-orange font-mono min-h-screen">
      {/* Header */}
      <header className="border-b-2 border-cyber-orange bg-cyber-panel p-4 tokyo-3-grid">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="text-4xl font-bold cyber-glow animate-flicker tracking-wider">MEETRO</div>
            <div className="text-sm text-cyber-cyan">
              <div>MAGI RECOVERY SYSTEM</div>
              <div className="text-xs text-cyber-teal">TOKYO-3 NERV</div>
            </div>
          </div>
          <div className="text-right text-xs text-cyber-cyan font-mono">
            <div>DIRECT LINK CONNECTION: <span className="text-cyber-orange">OPENROUTER-01</span></div>
            <div>ACCESS MODE: <span className="text-cyber-orange animate-pulse">SUPERUSER</span></div>
            <div>SYSTEM STATUS: <span className="text-cyber-teal">ONLINE</span></div>
          </div>
        </div>
      </header>

      {/* Main Interface */}
      <main className="container mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen">
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
        />
        
        <ProcessingCenter
          transcript={transcript}
          topic={topic}
          attendees={attendees}
          knownInfo={knownInfo}
          isProcessing={isProcessing}
          setIsProcessing={setIsProcessing}
          setAnalysis={setAnalysis}
        />
        
        <OutputPanel analysis={analysis} />
      </main>

      {/* Export Bar */}
      <ExportBar analysis={analysis} />

      {/* Terminal Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-cyber-bg border-t border-cyber-orange p-2 text-xs text-cyber-cyan">
        <div className="container mx-auto flex justify-between">
          <span>SYSTEM: ONLINE</span>
          <span>MEMORY: 45% | CPU: 23%</span>
          <span>LAST UPDATE: {new Date().toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}
