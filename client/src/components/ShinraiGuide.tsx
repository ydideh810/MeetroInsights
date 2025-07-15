import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export default function ShinraiGuide() {
  const [isOpen, setIsOpen] = useState(false);

  const magiModes = [
    {
      name: "SYNTHRAX-1",
      subtitle: "The Analyst",
      icon: "🧠",
      color: "text-cyber-red",
      bgColor: "bg-red-900/20",
      borderColor: "border-red-500",
      description: "Represents the logical, analytical side of decision-making",
      approach: "Focus on facts, clarity, and structured output",
      bestFor: "Technical meetings, sprint planning, engineering syncs",
      output: [
        "Extracts concrete decisions and action items",
        "Provides factual summaries without speculation",
        "Structures information in logical bullet points",
        "Identifies technical details and requirements"
      ],
      metaphor: "Named after synthetic reasoning algorithms, Synthrax embodies pure logical reasoning - the scientist's approach to understanding meetings through data and facts."
    },
    {
      name: "VANTIX-2",
      subtitle: "The Strategist",
      icon: "💡",
      color: "text-cyber-orange",
      bgColor: "bg-orange-900/20",
      borderColor: "border-orange-500",
      description: "Represents strategic thinking and forward planning",
      approach: "Focus on priorities, execution, and foresight",
      bestFor: "Leadership meetings, project updates, strategic planning",
      output: [
        "Identifies high-impact items and opportunities",
        "Assesses risks and strategic implications",
        "Prioritizes action items by importance",
        "Suggests tactical follow-up steps"
      ],
      metaphor: "Named after strategic vantage points, Vantix represents strategic value - the executive's perspective on turning meetings into actionable business outcomes."
    },
    {
      name: "LYMNIA-3",
      subtitle: "The Human Layer",
      icon: "🧬",
      color: "text-cyber-cyan",
      bgColor: "bg-cyan-900/20",
      borderColor: "border-cyan-500",
      description: "Represents emotional intelligence and interpersonal dynamics",
      approach: "Focus on emotion, tone, and unspoken dynamics",
      bestFor: "Client meetings, team retrospectives, conflict resolution",
      output: [
        "Surfaces team sentiment and concerns",
        "Identifies interpersonal tensions or agreements",
        "Captures meaningful quotes and atmosphere",
        "Highlights unresolved questions and relationship issues"
      ],
      metaphor: "Named after lymphatic systems that heal and connect, Lymnia focuses on the human element - understanding the emotional and relational aspects that pure logic might miss."
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          className="bg-cyber-panel border-cyber-border text-cyber-cyan hover:bg-cyber-dark-panel hover:border-cyber-orange transition-colors"
        >
          <span className="text-sm font-tourney">📖 SHINRAI GUIDE</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-cyber-bg border-cyber-border">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-cyber-orange font-doto cyber-glow">
            SHINRAI SYSTEM GUIDE
          </DialogTitle>
          <DialogDescription className="text-sm text-cyber-cyan font-tourney">
            TOKYO-3 • ZENTRA • MEETING ANALYSIS PROTOCOLS
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 mt-6">
          {/* System Overview */}
          <Card className="bg-cyber-panel border-cyber-border">
            <CardHeader>
              <CardTitle className="text-cyber-orange font-tourney">System Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-cyber-teal text-sm space-y-3">
              <p>
                The SHINRAI system is inspired by Evangelion's three-part supercomputer that makes critical decisions 
                by analyzing situations from different perspectives. Each SHINRAI unit represents a different aspect 
                of human decision-making.
              </p>
              <p>
                In NEURAKEI, each SHINRAI mode analyzes your meeting transcripts through a unique lens, providing 
                complementary insights that together form a complete picture of what happened.
              </p>
            </CardContent>
          </Card>

          {/* SHINRAI Modes */}
          <div className="grid gap-4">
            {magiModes.map((mode, index) => (
              <Card key={index} className={`bg-cyber-panel border-2 ${mode.borderColor}`}>
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`text-2xl ${mode.color}`}>{mode.icon}</div>
                    <div>
                      <CardTitle className={`${mode.color} font-tourney`}>
                        {mode.name}
                      </CardTitle>
                      <CardDescription className="text-cyber-cyan font-tourney">
                        {mode.subtitle}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className={`p-3 rounded ${mode.bgColor} border ${mode.borderColor}`}>
                    <p className="text-cyber-teal text-sm italic">
                      "{mode.metaphor}"
                    </p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-cyber-orange mb-2 font-tourney">APPROACH:</h4>
                    <p className="text-cyber-teal text-sm">{mode.approach}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-cyber-orange mb-2 font-tourney">BEST FOR:</h4>
                    <Badge variant="outline" className="text-cyber-cyan border-cyber-border">
                      {mode.bestFor}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-cyber-orange mb-2 font-tourney">OUTPUT FOCUS:</h4>
                    <ul className="text-cyber-teal text-sm space-y-1">
                      {mode.output.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="text-cyber-cyan mr-2">•</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Usage Tips */}
          <Card className="bg-cyber-panel border-cyber-border">
            <CardHeader>
              <CardTitle className="text-cyber-orange font-tourney">Usage Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-cyber-teal text-sm space-y-3">
              <div>
                <h4 className="font-bold text-cyber-cyan mb-2 font-tourney">CHOOSING THE RIGHT MODE:</h4>
                <ul className="space-y-1 ml-4">
                  <li>• Use <span className="text-cyber-red">SYNTHRAX</span> for technical meetings where facts matter most</li>
                  <li>• Use <span className="text-cyber-orange">VANTIX</span> for strategic sessions requiring prioritization</li>
                  <li>• Use <span className="text-cyber-cyan">LYMNIA</span> for people-focused meetings with emotional context</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-bold text-cyber-cyan mb-2 font-tourney">COMBINING INSIGHTS:</h4>
                <p>
                  For complex meetings, try running the same transcript through multiple SHINRAI modes 
                  to get different perspectives on the same content.
                </p>
              </div>
              
              <div>
                <h4 className="font-bold text-cyber-cyan mb-2 font-tourney">EMERGENCY RECOVERY:</h4>
                <p>
                  When you have limited information, the system can generate plausible reconstructions 
                  based on meeting topics and attendees.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Close Button */}
          <div className="flex justify-end">
            <Button 
              onClick={() => setIsOpen(false)}
              className="bg-cyber-orange text-black hover:bg-cyber-red font-tourney"
            >
              CLOSE GUIDE
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}