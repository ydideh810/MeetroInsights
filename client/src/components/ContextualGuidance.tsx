import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { X, Lightbulb, AlertTriangle, CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContextualTip {
  id: string;
  title: string;
  description: string;
  actions?: Array<{
    label: string;
    onClick: () => void;
    variant?: "default" | "outline" | "destructive";
  }>;
  type: "info" | "warning" | "success" | "tip";
  dismissible: boolean;
  oneTime: boolean;
}

interface ContextualGuidanceProps {
  transcript: string;
  hasAnalysis: boolean;
  isProcessing: boolean;
  userCredits: number;
  hasUsedMemoryBank: boolean;
  analysisCount: number;
}

export default function ContextualGuidance({
  transcript,
  hasAnalysis,
  isProcessing,
  userCredits,
  hasUsedMemoryBank,
  analysisCount
}: ContextualGuidanceProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dismissedTips, setDismissedTips] = useState<Set<string>>(new Set());
  const [currentTip, setCurrentTip] = useState<ContextualTip | null>(null);

  // Get dismissed tips from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`neurakei-dismissed-tips-${user?.uid}`);
    if (stored) {
      setDismissedTips(new Set(JSON.parse(stored)));
    }
  }, [user?.uid]);

  // Save dismissed tips to localStorage
  const dismissTip = (tipId: string) => {
    const newDismissed = new Set(dismissedTips);
    newDismissed.add(tipId);
    setDismissedTips(newDismissed);
    localStorage.setItem(`neurakei-dismissed-tips-${user?.uid}`, JSON.stringify([...newDismissed]));
    setCurrentTip(null);
  };

  // Generate contextual tips based on user state
  const generateTips = (): ContextualTip[] => {
    const tips: ContextualTip[] = [];

    // First-time user welcome
    if (analysisCount === 0 && !dismissedTips.has('welcome')) {
      tips.push({
        id: 'welcome',
        title: 'Welcome to NEURAKEI!',
        description: 'Start by uploading a meeting transcript or pasting text, then choose a SHINRAI analysis mode to extract key insights.',
        actions: [{
          label: 'Get Started',
          onClick: () => document.querySelector('input[type="file"]')?.click(),
          variant: 'default'
        }],
        type: 'info',
        dismissible: true,
        oneTime: true
      });
    }

    // No transcript guidance
    if (!transcript && !isProcessing && !dismissedTips.has('no_transcript')) {
      tips.push({
        id: 'no_transcript',
        title: 'No meeting transcript?',
        description: 'Try Emergency Recovery mode - it can generate insights from just meeting topic, attendees, and context information.',
        actions: [{
          label: 'Learn More',
          onClick: () => toast({
            title: "Emergency Recovery",
            description: "Use this when you have limited information but still need meeting insights generated."
          }),
          variant: 'outline'
        }],
        type: 'tip',
        dismissible: true,
        oneTime: false
      });
    }

    // Low credits warning
    if (userCredits <= 2 && !dismissedTips.has('low_credits')) {
      tips.push({
        id: 'low_credits',
        title: 'Running low on credits',
        description: `You have ${userCredits} credits remaining. Each analysis costs 1 credit.`,
        actions: [
          {
            label: 'Purchase Credits',
            onClick: () => window.open('https://niddamhub.lemonsqueezy.com/buy/be00a64f-fe92-44a6-a654-d6187a4e864a', '_blank'),
            variant: 'default'
          },
          {
            label: 'Redeem License Key',
            onClick: () => toast({
              title: "License Key Redemption",
              description: "Check your account dropdown for license key redemption option."
            }),
            variant: 'outline'
          }
        ],
        type: 'warning',
        dismissible: true,
        oneTime: false
      });
    }

    // Post-analysis guidance
    if (hasAnalysis && !isProcessing && !dismissedTips.has('post_analysis')) {
      tips.push({
        id: 'post_analysis',
        title: 'Analysis Complete!',
        description: 'Don\'t forget to save your analysis to Memory Bank and check out the Highlights tab for key meeting moments.',
        actions: [{
          label: 'Save Analysis',
          onClick: () => toast({
            title: "Save to Memory Bank",
            description: "Click the save button in the output panel to store this analysis."
          }),
          variant: 'default'
        }],
        type: 'success',
        dismissible: true,
        oneTime: false
      });
    }

    // Memory Bank feature introduction
    if (analysisCount >= 2 && !hasUsedMemoryBank && !dismissedTips.has('memory_bank_intro')) {
      tips.push({
        id: 'memory_bank_intro',
        title: 'Build Your Knowledge Base',
        description: 'You\'ve completed multiple analyses! Start saving them to Memory Bank to build a searchable knowledge base.',
        actions: [{
          label: 'Explore Memory Bank',
          onClick: () => toast({
            title: "Memory Bank",
            description: "Save, tag, and organize your meeting insights for easy retrieval."
          }),
          variant: 'default'
        }],
        type: 'tip',
        dismissible: true,
        oneTime: true
      });
    }

    // Advanced features tip
    if (analysisCount >= 5 && !dismissedTips.has('advanced_features')) {
      tips.push({
        id: 'advanced_features',
        title: 'Explore Advanced Features',
        description: 'You\'re becoming a NEURAKEI pro! Try different SHINRAI modes on the same transcript to compare perspectives.',
        actions: [{
          label: 'Learn About SHINRAI Modes',
          onClick: () => toast({
            title: "SHINRAI Modes",
            description: "Each mode provides different analytical perspectives - Synthrax (technical), Vantix (strategic), and Lymnia (human-focused)."
          }),
          variant: 'outline'
        }],
        type: 'tip',
        dismissible: true,
        oneTime: true
      });
    }

    return tips;
  };

  // Update current tip based on context
  useEffect(() => {
    const tips = generateTips();
    const activeTip = tips.find(tip => 
      !dismissedTips.has(tip.id) && 
      (!tip.oneTime || !dismissedTips.has(tip.id))
    );
    
    if (activeTip && activeTip.id !== currentTip?.id) {
      setCurrentTip(activeTip);
    }
  }, [transcript, hasAnalysis, isProcessing, userCredits, hasUsedMemoryBank, analysisCount, dismissedTips]);

  if (!currentTip) return null;

  const getIcon = (type: string) => {
    switch (type) {
      case 'warning': return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      case 'success': return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'tip': return <Sparkles className="w-5 h-5 text-purple-400" />;
      default: return <Lightbulb className="w-5 h-5 text-blue-400" />;
    }
  };

  const getAlertVariant = (type: string) => {
    switch (type) {
      case 'warning': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="bg-cyber-dark-panel border-cyber-cyan shadow-lg">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {getIcon(currentTip.type)}
              <CardTitle className="text-sm text-cyber-cyan">{currentTip.title}</CardTitle>
            </div>
            {currentTip.dismissible && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => dismissTip(currentTip.id)}
                className="h-6 w-6 p-0 text-cyber-cyan/50 hover:text-cyber-cyan"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <p className="text-sm text-cyber-cyan/80 mb-3">{currentTip.description}</p>
          
          {currentTip.actions && (
            <div className="flex flex-wrap gap-2">
              {currentTip.actions.map((action, index) => (
                <Button
                  key={index}
                  size="sm"
                  variant={action.variant || 'default'}
                  onClick={action.onClick}
                  className="text-xs"
                >
                  {action.label}
                  <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              ))}
            </div>
          )}
          
          <div className="flex items-center justify-between mt-3">
            <Badge variant="outline" className="text-xs">
              AI Mentor
            </Badge>
            {currentTip.oneTime && (
              <Badge variant="secondary" className="text-xs">
                One-time tip
              </Badge>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}