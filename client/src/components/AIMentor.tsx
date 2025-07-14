import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CheckCircle, Circle, Bot, Lightbulb, AlertCircle, ArrowRight, X, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { MentorSession } from "@shared/schema";

interface MentorTip {
  id: string;
  title: string;
  description: string;
  icon: JSX.Element;
  category: 'onboarding' | 'features' | 'optimization' | 'troubleshooting';
  priority: 'high' | 'medium' | 'low';
  isCompleted: boolean;
  steps?: string[];
  relatedFeatures?: string[];
}

interface MentorContextualTip {
  id: string;
  title: string;
  description: string;
  trigger: 'first_upload' | 'no_transcript' | 'low_credits' | 'unused_features' | 'analysis_complete';
  autoShow: boolean;
  oneTime: boolean;
}

export default function AIMentor() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [contextualTips, setContextualTips] = useState<MentorContextualTip[]>([]);

  // Fetch mentor sessions
  const { data: mentorSessions } = useQuery({
    queryKey: ['/api/mentor/sessions'],
    enabled: !!user,
  });

  // Fetch user progress
  const { data: userProgress } = useQuery({
    queryKey: ['/api/user'],
    enabled: !!user,
  });

  // Start/update mentor session
  const startSessionMutation = useMutation({
    mutationFn: async (sessionType: string) => {
      return await apiRequest('/api/mentor/start-session', {
        method: 'POST',
        body: JSON.stringify({ sessionType }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mentor/sessions'] });
      toast({
        title: "Mentor Session Started",
        description: "Let's get you up to speed with MEETRO!",
      });
    },
  });

  // Update session progress
  const updateProgressMutation = useMutation({
    mutationFn: async ({ sessionId, step }: { sessionId: number; step: number }) => {
      return await apiRequest('/api/mentor/update-progress', {
        method: 'POST',
        body: JSON.stringify({ sessionId, step }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/mentor/sessions'] });
    },
  });

  // Define mentor tips and guidance
  const mentorTips: MentorTip[] = [
    {
      id: 'welcome',
      title: 'Welcome to MEETRO',
      description: 'Learn the basics of the MAGI system and get started with your first meeting analysis',
      icon: <Sparkles className="w-5 h-5" />,
      category: 'onboarding',
      priority: 'high',
      isCompleted: false,
      steps: [
        'Upload your first meeting transcript or paste text',
        'Choose a MAGI analysis mode (Melchior, Balthasar, or Casper)',
        'Review the generated insights and action items',
        'Save your analysis to Memory Bank for future reference'
      ],
      relatedFeatures: ['file_upload', 'magi_modes', 'memory_bank']
    },
    {
      id: 'magi_modes',
      title: 'Master the MAGI Modes',
      description: 'Understand when to use each MAGI mode for optimal meeting analysis',
      icon: <Bot className="w-5 h-5" />,
      category: 'features',
      priority: 'high',
      isCompleted: false,
      steps: [
        'Use MELCHIOR for technical meetings requiring factual analysis',
        'Use BALTHASAR for strategic meetings and decision-making',
        'Use CASPER for understanding team dynamics and emotions',
        'Experiment with different modes on the same transcript'
      ],
      relatedFeatures: ['magi_guide', 'analysis_modes']
    },
    {
      id: 'memory_bank',
      title: 'Organize with Memory Bank',
      description: 'Learn to save, tag, and organize your meeting insights effectively',
      icon: <Lightbulb className="w-5 h-5" />,
      category: 'features',
      priority: 'medium',
      isCompleted: false,
      steps: [
        'Save your first analysis with a descriptive title',
        'Create custom tags for different meeting types',
        'Use categories to organize meetings by project or team',
        'Search your saved meetings to find specific insights'
      ],
      relatedFeatures: ['memory_bank', 'tags', 'search']
    },
    {
      id: 'credit_management',
      title: 'Manage Your Credits',
      description: 'Understand the credit system and how to refill when needed',
      icon: <AlertCircle className="w-5 h-5" />,
      category: 'optimization',
      priority: 'medium',
      isCompleted: false,
      steps: [
        'Each analysis costs 1 credit',
        'Monitor your credit balance in the top bar',
        'Purchase more credits through Lemon Squeezy',
        'Redeem license keys for additional credits'
      ],
      relatedFeatures: ['credits', 'payment', 'license_keys']
    },
    {
      id: 'highlight_reel',
      title: 'Meeting Highlights',
      description: 'Discover key moments and turning points in your meetings',
      icon: <Sparkles className="w-5 h-5" />,
      category: 'features',
      priority: 'low',
      isCompleted: false,
      steps: [
        'Run an analysis to generate meeting highlights',
        'Switch to the Highlights tab in the output panel',
        'Use playback controls to navigate through moments',
        'Understand the different highlight types and intensity scores'
      ],
      relatedFeatures: ['highlights', 'playback', 'moments']
    }
  ];

  // Contextual tips that appear based on user behavior
  const contextualTipTemplates: MentorContextualTip[] = [
    {
      id: 'first_upload_tip',
      title: 'Great! You\'ve uploaded your first file',
      description: 'Now choose a MAGI mode to analyze your meeting. Try Melchior for technical meetings or Balthasar for strategic discussions.',
      trigger: 'first_upload',
      autoShow: true,
      oneTime: true,
    },
    {
      id: 'no_transcript_tip',
      title: 'No transcript? No problem!',
      description: 'Use the Emergency Recovery feature to generate insights from meeting context, topic, and attendees information.',
      trigger: 'no_transcript',
      autoShow: true,
      oneTime: false,
    },
    {
      id: 'low_credits_tip',
      title: 'Running low on credits',
      description: 'You have 2 or fewer credits remaining. Consider purchasing more credits or redeeming a license key to continue analyzing meetings.',
      trigger: 'low_credits',
      autoShow: true,
      oneTime: false,
    },
    {
      id: 'unused_features_tip',
      title: 'Maximize your MEETRO experience',
      description: 'You haven\'t used the Memory Bank yet! Save your analyses to build a searchable knowledge base of your meeting insights.',
      trigger: 'unused_features',
      autoShow: false,
      oneTime: true,
    },
    {
      id: 'analysis_complete_tip',
      title: 'Analysis complete! What\'s next?',
      description: 'Don\'t forget to save this analysis to your Memory Bank and check out the Highlights tab for key meeting moments.',
      trigger: 'analysis_complete',
      autoShow: true,
      oneTime: false,
    }
  ];

  // Calculate overall progress
  const calculateProgress = () => {
    const completedTips = mentorTips.filter(tip => tip.isCompleted).length;
    return (completedTips / mentorTips.length) * 100;
  };

  // Handle tip completion
  const completeTip = (tipId: string) => {
    // Mark tip as completed in user progress
    updateProgressMutation.mutate({
      sessionId: 1, // Default session
      step: mentorTips.findIndex(tip => tip.id === tipId) + 1
    });
  };

  const startOnboarding = () => {
    startSessionMutation.mutate('onboarding');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-cyber-panel border-2 border-cyber-cyan text-cyber-cyan hover:bg-cyber-cyan hover:text-black transition-all duration-300"
          size="sm"
        >
          <Bot className="w-4 h-4 mr-2" />
          AI Mentor
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-cyber-dark-panel border-cyber-cyan text-cyber-cyan">
        <DialogHeader>
          <DialogTitle className="text-cyber-cyan font-tourney text-xl">
            <Bot className="w-6 h-6 inline mr-2" />
            AI Mentor Guidance System
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-cyber-bg border-cyber-border">
            <TabsTrigger 
              value="dashboard" 
              className="data-[state=active]:bg-cyber-cyan data-[state=active]:text-black"
            >
              Dashboard
            </TabsTrigger>
            <TabsTrigger 
              value="guides" 
              className="data-[state=active]:bg-cyber-cyan data-[state=active]:text-black"
            >
              Guides
            </TabsTrigger>
            <TabsTrigger 
              value="tips" 
              className="data-[state=active]:bg-cyber-cyan data-[state=active]:text-black"
            >
              Quick Tips
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-4">
            <Card className="bg-cyber-panel border-cyber-border">
              <CardHeader>
                <CardTitle className="text-cyber-orange">Your MEETRO Journey</CardTitle>
                <CardDescription className="text-cyber-cyan/70">
                  Track your progress mastering the MAGI system
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-tektur">Overall Progress</span>
                    <span className="text-sm font-tektur">{Math.round(calculateProgress())}%</span>
                  </div>
                  <Progress value={calculateProgress()} className="h-2" />
                  
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="bg-cyber-bg p-4 rounded border border-cyber-border">
                      <div className="text-2xl font-bold text-cyber-cyan">
                        {mentorTips.filter(tip => tip.isCompleted).length}
                      </div>
                      <div className="text-sm text-cyber-cyan/70">Completed Guides</div>
                    </div>
                    <div className="bg-cyber-bg p-4 rounded border border-cyber-border">
                      <div className="text-2xl font-bold text-cyber-orange">
                        {mentorTips.filter(tip => !tip.isCompleted && tip.priority === 'high').length}
                      </div>
                      <div className="text-sm text-cyber-cyan/70">High Priority</div>
                    </div>
                  </div>

                  <Button 
                    onClick={startOnboarding}
                    className="w-full bg-cyber-orange text-black hover:bg-cyber-orange/90 mt-4"
                    disabled={startSessionMutation.isPending}
                  >
                    {startSessionMutation.isPending ? 'Starting...' : 'Start Guided Tour'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="guides" className="space-y-4">
            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-4">
                {mentorTips.map((tip) => (
                  <Card key={tip.id} className="bg-cyber-panel border-cyber-border">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {tip.icon}
                          <div>
                            <CardTitle className="text-cyber-cyan text-sm">{tip.title}</CardTitle>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge 
                                variant={tip.priority === 'high' ? 'destructive' : 'outline'}
                                className="text-xs"
                              >
                                {tip.priority}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {tip.category}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        {tip.isCompleted ? (
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        ) : (
                          <Circle className="w-5 h-5 text-cyber-cyan/50" />
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-cyber-cyan/80 text-sm mb-3">{tip.description}</p>
                      {tip.steps && (
                        <div className="space-y-2">
                          <div className="text-xs font-semibold text-cyber-orange">Steps:</div>
                          {tip.steps.map((step, index) => (
                            <div key={index} className="flex items-start gap-2 text-xs">
                              <span className="text-cyber-cyan/50">{index + 1}.</span>
                              <span className="text-cyber-cyan/80">{step}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {!tip.isCompleted && (
                        <Button 
                          size="sm" 
                          className="mt-3 bg-cyber-cyan text-black hover:bg-cyber-cyan/90"
                          onClick={() => completeTip(tip.id)}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tips" className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              {contextualTipTemplates.map((tip) => (
                <Card key={tip.id} className="bg-cyber-panel border-cyber-border">
                  <CardHeader>
                    <CardTitle className="text-cyber-orange text-sm">{tip.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-cyber-cyan/80 text-sm">{tip.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        {tip.trigger.replace('_', ' ')}
                      </Badge>
                      {tip.autoShow && (
                        <Badge variant="outline" className="text-xs">
                          Auto-show
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}