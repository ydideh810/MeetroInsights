import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, BrainCircuit, FileText, Zap, Target, Heart } from "lucide-react";

export type ContentMode = "meetings" | "socials" | "notes";

interface ContentModeToggleProps {
  currentMode: ContentMode;
  onModeChange: (mode: ContentMode) => void;
}

export default function ContentModeToggle({ currentMode, onModeChange }: ContentModeToggleProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const modes = [
    {
      id: "meetings" as ContentMode,
      name: "MEETINGS",
      icon: <MessageSquare className="w-5 h-5" />,
      description: "Structured meeting transcripts & recordings",
      examples: ["Zoom transcripts", "Team standups", "Client calls", "Board meetings"],
      color: "bg-cyber-orange",
      textColor: "text-cyber-orange"
    },
    {
      id: "socials" as ContentMode,
      name: "SOCIALS",
      icon: <BrainCircuit className="w-5 h-5" />,
      description: "Chat logs, threads & social conversations",
      examples: ["Slack threads", "Discord chats", "Reddit discussions", "X threads", "DMs"],
      color: "bg-blue-500",
      textColor: "text-blue-400"
    },
    {
      id: "notes" as ContentMode,
      name: "NOTES",
      icon: <FileText className="w-5 h-5" />,
      description: "Brainstorms, idea dumps & raw notes",
      examples: ["Notion pages", "Google Docs", "Raw notes", "Idea dumps", "Brainstorms"],
      color: "bg-purple-500",
      textColor: "text-purple-400"
    }
  ];

  const currentModeData = modes.find(m => m.id === currentMode);

  const triCoreAnalysis = [
    {
      name: "SYNTHRAX",
      description: "Organizes content into clear themes and structure",
      icon: <Zap className="w-4 h-4" />,
      color: "text-cyber-orange"
    },
    {
      name: "VANTIX",
      description: "Prioritizes decisions and extracts action items",
      icon: <Target className="w-4 h-4" />,
      color: "text-blue-400"
    },
    {
      name: "LYMNIA",
      description: "Decodes tone and highlights emotional shifts",
      icon: <Heart className="w-4 h-4" />,
      color: "text-purple-400"
    }
  ];

  return (
    <div className="space-y-4">
      {/* Mode Toggle Bar */}
      <div className="flex justify-center">
        <div className="bg-cyber-panel border-2 border-cyber-border rounded-lg p-1 flex">
          {modes.map((mode) => (
            <Button
              key={mode.id}
              onClick={() => onModeChange(mode.id)}
              variant="ghost"
              className={`
                px-6 py-3 mx-1 rounded-md transition-all duration-300 flex items-center gap-2
                ${currentMode === mode.id 
                  ? `${mode.color} text-black font-bold shadow-lg cyber-glow` 
                  : `text-cyber-cyan hover:${mode.textColor} hover:bg-cyber-dark-panel`
                }
              `}
            >
              {mode.icon}
              <span className="font-tourney tracking-wider">{mode.name}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Current Mode Description */}
      <Card className="bg-cyber-panel border-cyber-border">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${currentModeData?.color}`}>
                {currentModeData?.icon}
              </div>
              <div>
                <CardTitle className="text-lg font-tourney text-cyber-cyan">
                  {currentModeData?.name} MODE
                </CardTitle>
                <CardDescription className="text-cyber-cyan/70">
                  {currentModeData?.description}
                </CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-cyber-cyan hover:text-cyber-orange"
            >
              {isExpanded ? "COLLAPSE" : "EXPAND"}
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="pt-0 space-y-4">
            {/* Examples */}
            <div>
              <h4 className="text-sm font-tourney text-cyber-orange mb-2">SUPPORTED CONTENT:</h4>
              <div className="flex flex-wrap gap-2">
                {currentModeData?.examples.map((example, index) => (
                  <Badge key={index} variant="outline" className="text-cyber-cyan border-cyber-border">
                    {example}
                  </Badge>
                ))}
              </div>
            </div>

            {/* TRI-CORE Analysis */}
            <div>
              <h4 className="text-sm font-tourney text-cyber-orange mb-3">TRI-CORE ANALYSIS:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {triCoreAnalysis.map((core) => (
                  <Card key={core.name} className="bg-cyber-dark-panel border-cyber-border">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <div className={core.color}>
                          {core.icon}
                        </div>
                        <span className={`font-tourney text-sm ${core.color}`}>
                          {core.name}
                        </span>
                      </div>
                      <p className="text-xs text-cyber-cyan/70">
                        {core.description}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Mode-Specific Instructions */}
            <div>
              <h4 className="text-sm font-tourney text-cyber-orange mb-2">OPTIMIZATION TIPS:</h4>
              <div className="text-sm text-cyber-cyan/70 space-y-1">
                {currentMode === "meetings" && (
                  <>
                    <p>• Include speaker names for better participant analysis</p>
                    <p>• Add timestamps for chronological insights</p>
                    <p>• Provide meeting context in the topic field</p>
                  </>
                )}
                {currentMode === "socials" && (
                  <>
                    <p>• Include usernames/handles for social dynamics</p>
                    <p>• Paste full conversation threads for context</p>
                    <p>• Add platform context (e.g., "Slack #general")</p>
                  </>
                )}
                {currentMode === "notes" && (
                  <>
                    <p>• Include headers and bullet points for structure</p>
                    <p>• Add source context (e.g., "Brainstorm session")</p>
                    <p>• Include any existing tags or categories</p>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
}