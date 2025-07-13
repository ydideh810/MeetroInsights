import { MeetingAnalysis } from "@shared/schema";

interface OutputPanelProps {
  analysis: MeetingAnalysis | null;
}

export default function OutputPanel({ analysis }: OutputPanelProps) {
  return (
    <div className="space-y-4">
      <div className="magi-panel rounded-lg p-6">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 cyber-glow tracking-wide font-doto">RECOVERY OUTPUT</h2>
          <div className="text-xs text-cyber-cyan mb-4 font-tektur">MAGI CASPER-3 • ONLINE</div>
        
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
      </div>
    </div>
  );
}
