import { MeetingAnalysis } from "@shared/schema";
import { SaveMeetingDialog } from "./MemoryBank";
import HighlightReel from "./HighlightReel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Play, FileText } from "lucide-react";

interface OutputPanelProps {
  analysis: MeetingAnalysis | null;
  transcript?: string;
  topic?: string;
  attendees?: string;
  knownInfo?: string;
  shinraiMode?: string;
}

export default function OutputPanel({ 
  analysis, 
  transcript = "", 
  topic = "", 
  attendees = "", 
  knownInfo = "", 
  shinraiMode = "" 
}: OutputPanelProps) {
  return (
    <div className="space-y-4">
      <div className="magi-panel rounded-lg p-6">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 cyber-glow tracking-wide font-doto">RECOVERY OUTPUT</h2>
          <div className="text-xs text-cyber-cyan mb-4 font-tourney">SHINRAI LYMNIA-3 • ONLINE</div>
        
          {/* Save to Memory Bank Button */}
          {analysis && (
            <div className="flex justify-center mb-6">
              <SaveMeetingDialog
                analysis={analysis}
                transcript={transcript}
                topic={topic}
                attendees={attendees}
                knownInfo={knownInfo}
                shinraiMode={shinraiMode}
                onSave={() => {}}
              />
            </div>
          )}

          {/* Tabbed Interface */}
          <Tabs defaultValue="analysis" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-cyber-bg border border-cyber-orange">
              <TabsTrigger 
                value="analysis" 
                className="text-cyber-cyan data-[state=active]:bg-cyber-orange data-[state=active]:text-cyber-dark-panel"
              >
                <FileText className="w-4 h-4 mr-2" />
                ANALYSIS
              </TabsTrigger>
              <TabsTrigger 
                value="highlights" 
                className="text-cyber-cyan data-[state=active]:bg-cyber-orange data-[state=active]:text-cyber-dark-panel"
              >
                <Play className="w-4 h-4 mr-2" />
                HIGHLIGHTS
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analysis" className="mt-6">
              <div className="space-y-6">
                {/* Summary Section */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-cyber-cyan">🧠</span>
                    <h3 className="text-lg font-bold text-cyber-cyan font-tourney">SUMMARY</h3>
                  </div>
                  <div className="bg-cyber-bg p-4 rounded border border-cyber-border text-sm">
                    <div className="text-cyber-teal">
                      {analysis?.summary || "Awaiting input for analysis..."}
                    </div>
                  </div>
                </div>
                
                {/* Key Decisions */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-cyber-orange">📌</span>
                    <h3 className="text-lg font-bold text-cyber-orange font-tourney">KEY DECISIONS</h3>
                  </div>
                  <div className="bg-cyber-bg p-4 rounded border border-cyber-border text-sm">
                    <ul className="space-y-2 text-cyber-teal">
                      {analysis?.keyDecisions?.length ? (
                        analysis.keyDecisions.map((decision, index) => (
                          <li key={index}>• {decision}</li>
                        ))
                      ) : (
                        <li>• No decisions extracted yet</li>
                      )}
                    </ul>
                  </div>
                </div>
                
                {/* Action Items */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-cyber-teal">✅</span>
                    <h3 className="text-lg font-bold text-cyber-teal font-tourney">ACTION ITEMS</h3>
                  </div>
                  <div className="bg-cyber-bg p-4 rounded border border-cyber-border text-sm">
                    <div className="space-y-2 text-cyber-teal">
                      {analysis?.actionItems?.length ? (
                        analysis.actionItems.map((item, index) => (
                          <div key={index}>
                            • {item.task}
                            {item.assignee && (
                              <span className="text-cyber-cyan"> ({item.assignee})</span>
                            )}
                          </div>
                        ))
                      ) : (
                        <div>No action items extracted yet</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Unanswered Questions */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-yellow-400">❓</span>
                    <h3 className="text-lg font-bold text-yellow-400 font-tourney">UNANSWERED QUESTIONS</h3>
                  </div>
                  <div className="bg-cyber-bg p-4 rounded border border-cyber-border text-sm">
                    <div className="space-y-2 text-cyber-teal">
                      {analysis?.unansweredQuestions?.length ? (
                        analysis.unansweredQuestions.map((question, index) => (
                          <div key={index}>• {question}</div>
                        ))
                      ) : (
                        <div>No questions identified yet</div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Follow-ups */}
                <div className="mb-6">
                  <div className="flex items-center space-x-2 mb-3">
                    <span className="text-cyber-cyan">🔁</span>
                    <h3 className="text-lg font-bold text-cyber-cyan font-tourney">FOLLOW-UPS</h3>
                  </div>
                  <div className="bg-cyber-bg p-4 rounded border border-cyber-border text-sm">
                    <div className="space-y-2 text-cyber-teal">
                      {analysis?.followUps?.length ? (
                        analysis.followUps.map((followUp, index) => (
                          <div key={index}>• {followUp}</div>
                        ))
                      ) : (
                        <div>No follow-ups suggested yet</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="highlights" className="mt-6">
              <HighlightReel analysis={analysis} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}