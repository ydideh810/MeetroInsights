import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MeetingHighlight, MeetingAnalysis } from "@shared/schema";
import { 
  Zap, 
  Brain, 
  AlertTriangle, 
  Lightbulb, 
  Heart, 
  TrendingUp, 
  Play, 
  Pause,
  SkipForward,
  SkipBack,
  Volume2
} from "lucide-react";

interface HighlightReelProps {
  analysis: MeetingAnalysis | null;
}

const getHighlightIcon = (type: MeetingHighlight['type']) => {
  switch (type) {
    case 'decision': return <Zap className="w-4 h-4" />;
    case 'breakthrough': return <Brain className="w-4 h-4" />;
    case 'conflict': return <AlertTriangle className="w-4 h-4" />;
    case 'insight': return <Lightbulb className="w-4 h-4" />;
    case 'emotional': return <Heart className="w-4 h-4" />;
    case 'turning_point': return <TrendingUp className="w-4 h-4" />;
    default: return <Zap className="w-4 h-4" />;
  }
};

const getHighlightColor = (type: MeetingHighlight['type']) => {
  switch (type) {
    case 'decision': return 'bg-green-500';
    case 'breakthrough': return 'bg-blue-500';
    case 'conflict': return 'bg-red-500';
    case 'insight': return 'bg-yellow-500';
    case 'emotional': return 'bg-purple-500';
    case 'turning_point': return 'bg-cyan-500';
    default: return 'bg-gray-500';
  }
};

const getTypeLabel = (type: MeetingHighlight['type']) => {
  switch (type) {
    case 'decision': return 'DECISION';
    case 'breakthrough': return 'BREAKTHROUGH';
    case 'conflict': return 'CONFLICT';
    case 'insight': return 'INSIGHT';
    case 'emotional': return 'EMOTIONAL';
    case 'turning_point': return 'TURNING POINT';
    default: return 'MOMENT';
  }
};

export default function HighlightReel({ analysis }: HighlightReelProps) {
  const [currentHighlight, setCurrentHighlight] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);

  if (!analysis?.highlights || analysis.highlights.length === 0) {
    return (
      <Card className="bg-cyber-panel border-cyber-orange">
        <CardHeader>
          <CardTitle className="text-cyber-orange flex items-center gap-2">
            <Play className="w-5 h-5" />
            HIGHLIGHT REEL
          </CardTitle>
          <CardDescription className="text-cyber-cyan">
            No highlights identified in this meeting
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const highlights = analysis.highlights.sort((a, b) => b.intensity - a.intensity);
  const currentMoment = highlights[currentHighlight];

  const nextHighlight = () => {
    setCurrentHighlight((prev) => (prev + 1) % highlights.length);
  };

  const prevHighlight = () => {
    setCurrentHighlight((prev) => (prev - 1 + highlights.length) % highlights.length);
  };

  const togglePlayback = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Auto-advance highlights when playing
      const interval = setInterval(() => {
        setCurrentHighlight((prev) => (prev + 1) % highlights.length);
      }, 5000 / playbackSpeed);
      
      setTimeout(() => {
        clearInterval(interval);
        setIsPlaying(false);
      }, highlights.length * 5000 / playbackSpeed);
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-cyber-panel border-cyber-orange">
        <CardHeader>
          <CardTitle className="text-cyber-orange flex items-center gap-2">
            <Play className="w-5 h-5" />
            HIGHLIGHT REEL
          </CardTitle>
          <CardDescription className="text-cyber-cyan">
            {highlights.length} key moments identified
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Playback Controls */}
          <div className="flex items-center justify-between mb-4 p-3 bg-cyber-bg rounded border border-cyber-orange/30">
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                onClick={prevHighlight}
                className="bg-cyber-orange/20 text-cyber-orange hover:bg-cyber-orange hover:text-black"
              >
                <SkipBack className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                onClick={togglePlayback}
                className="bg-cyber-orange text-black hover:bg-orange-600"
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                onClick={nextHighlight}
                className="bg-cyber-orange/20 text-cyber-orange hover:bg-cyber-orange hover:text-black"
              >
                <SkipForward className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-cyber-cyan text-sm">
              <Volume2 className="w-4 h-4" />
              <span>{currentHighlight + 1} / {highlights.length}</span>
            </div>
          </div>

          {/* Current Highlight */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Badge className={`${getHighlightColor(currentMoment.type)} text-white`}>
                {getHighlightIcon(currentMoment.type)}
                {getTypeLabel(currentMoment.type)}
              </Badge>
              {currentMoment.timestamp && (
                <Badge variant="outline" className="text-cyber-cyan border-cyber-cyan">
                  {currentMoment.timestamp}
                </Badge>
              )}
              <div className="flex items-center gap-1 ml-auto">
                <span className="text-xs text-cyber-cyan">INTENSITY</span>
                <Progress 
                  value={currentMoment.intensity * 10} 
                  className="w-16 h-2"
                />
                <span className="text-xs text-cyber-orange font-bold">
                  {currentMoment.intensity}/10
                </span>
              </div>
            </div>

            <div className="bg-cyber-bg p-4 rounded border border-cyber-orange/30">
              <h4 className="text-cyber-orange font-bold mb-2">
                {currentMoment.moment}
              </h4>
              <p className="text-cyber-cyan text-sm leading-relaxed">
                {currentMoment.context}
              </p>
              {currentMoment.participants && currentMoment.participants.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {currentMoment.participants.map((participant, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs border-cyber-cyan text-cyber-cyan"
                    >
                      {participant}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Highlights Timeline */}
      <Card className="bg-cyber-panel border-cyber-orange">
        <CardHeader>
          <CardTitle className="text-cyber-orange text-lg">MOMENT TIMELINE</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {highlights.map((highlight, idx) => (
              <div
                key={idx}
                onClick={() => setCurrentHighlight(idx)}
                className={`cursor-pointer p-3 rounded border transition-all ${
                  idx === currentHighlight
                    ? 'bg-cyber-orange/20 border-cyber-orange'
                    : 'bg-cyber-bg border-cyber-orange/30 hover:border-cyber-orange/60'
                }`}
              >
                <div className="flex items-start gap-2">
                  <div className={`w-2 h-2 rounded-full mt-2 ${getHighlightColor(highlight.type)}`} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge 
                        variant="outline" 
                        className="text-xs border-cyber-cyan text-cyber-cyan"
                      >
                        {getTypeLabel(highlight.type)}
                      </Badge>
                      {highlight.timestamp && (
                        <span className="text-xs text-cyber-cyan opacity-70">
                          {highlight.timestamp}
                        </span>
                      )}
                      <div className="flex items-center gap-1 ml-auto">
                        <Progress 
                          value={highlight.intensity * 10} 
                          className="w-12 h-1"
                        />
                        <span className="text-xs text-cyber-orange">
                          {highlight.intensity}
                        </span>
                      </div>
                    </div>
                    <p className="text-cyber-cyan text-sm">
                      {highlight.moment}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}