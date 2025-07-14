import { useState } from "react";
import UploadPanel from "@/components/UploadPanel";
import ProcessingCenter from "@/components/ProcessingCenter";
import OutputPanel from "@/components/OutputPanel";
import ExportButton from "@/components/ExportButton";
import MagiGuide from "@/components/MagiGuide";
import MemoryBank from "@/components/MemoryBank";
import { MeetingAnalysis } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Database } from "lucide-react";

export default function Home() {
  const [transcript, setTranscript] = useState("");
  const [topic, setTopic] = useState("");
  const [attendees, setAttendees] = useState("");
  const [knownInfo, setKnownInfo] = useState("");
  const [analysis, setAnalysis] = useState<MeetingAnalysis | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentMagiMode, setCurrentMagiMode] = useState<string>("");
  const [showMemoryBank, setShowMemoryBank] = useState(false);

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
          <div className="flex items-center space-x-6">
            {/* Export Options */}
            <div className="flex items-center space-x-2">
              <div className="text-xs text-cyber-cyan font-mono mr-2">EXPORT:</div>
              <ExportButton type="copy" analysis={analysis} />
              <ExportButton type="download" analysis={analysis} />
              <ExportButton type="notion" analysis={analysis} />
            </div>
            <Button
              onClick={() => setShowMemoryBank(!showMemoryBank)}
              className={`bg-cyber-panel border-2 border-cyber-orange text-cyber-cyan hover:bg-cyber-orange hover:text-black transition-colors ${
                showMemoryBank ? 'bg-cyber-orange text-black' : ''
              }`}
            >
              <Database className="w-4 h-4 mr-2" />
              MEMORY BANK
            </Button>
            <MagiGuide />
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
          setAnalysis={(analysis, mode) => {
            setAnalysis(analysis);
            setCurrentMagiMode(mode || "melchior");
          }}
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
            magiMode={currentMagiMode}
          />
        )}
      </main>


    </div>
  );
}
