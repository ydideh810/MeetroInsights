import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/ui/file-upload";
import LoadingScreen from "@/components/ui/loading-screen";
import ContentModeToggle, { ContentMode } from "./ContentModeToggle";
import { MeetingAnalysis } from "@shared/schema";

interface UploadPanelProps {
  transcript: string;
  setTranscript: (value: string) => void;
  topic: string;
  setTopic: (value: string) => void;
  attendees: string;
  setAttendees: (value: string) => void;
  knownInfo: string;
  setKnownInfo: (value: string) => void;
  setIsProcessing: (value: boolean) => void;
  setAnalysis: (value: MeetingAnalysis | null) => void;
  contentMode: ContentMode;
  setContentMode: (mode: ContentMode) => void;
}

export default function UploadPanel({
  transcript,
  setTranscript,
  topic,
  setTopic,
  attendees,
  setAttendees,
  knownInfo,
  setKnownInfo,
  setIsProcessing,
  setAnalysis,
  contentMode,
  setContentMode,
}: UploadPanelProps) {
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      return apiRequest('POST', '/api/upload', formData);
    },
    onSuccess: async (response) => {
      const data = await response.json();
      setTranscript(data.transcript);
      toast({
        title: "File uploaded successfully",
        description: `Processed ${data.filename}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
    },
  });

  const emergencyRecoveryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/analyze', {
        transcript: knownInfo || "Emergency recovery mode activated",
        topic,
        attendees,
        knownInfo,
        mode: "emergency",
        contentMode,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setAnalysis(data.analysis);
      toast({
        title: "Emergency recovery complete",
        description: "Meeting reconstruction generated",
      });
    },
    onError: (error) => {
      toast({
        title: "Emergency recovery failed",
        description: error instanceof Error ? error.message : "Failed to generate recovery",
        variant: "destructive",
      });
    },
  });

  const handleFileUpload = (file: File) => {
    setIsProcessing(true);
    setAnalysis(null);
    uploadMutation.mutate(file);
  };

  const handleEmergencyRecovery = () => {
    setIsProcessing(true);
    setAnalysis(null);
    emergencyRecoveryMutation.mutate();
  };

  const getPlaceholderText = () => {
    switch (contentMode) {
      case "meetings":
        return "Paste your meeting transcript here...\n\nExample:\n[10:00] John: Let's start with the quarterly review...\n[10:05] Sarah: Our revenue increased by 15%...";
      case "socials":
        return "Paste your chat logs, threads, or social conversations here...\n\nExample:\n@john_dev: Has anyone looked at the new API issue?\n@sarah_pm: I can take a look after lunch\n@mike_lead: It's related to the auth system...";
      case "notes":
        return "Paste your brainstorm notes, idea dumps, or raw thoughts here...\n\nExample:\n# New Product Ideas\n- AI-powered meeting assistant\n- Integration with Slack/Discord\n- Voice transcription features\n- Analytics dashboard";
      default:
        return "Enter your content here...";
    }
  };

  const getFieldLabels = () => {
    switch (contentMode) {
      case "meetings":
        return {
          topic: "Meeting Topic",
          attendees: "Attendees",
          context: "Additional Context",
          topicPlaceholder: "Weekly standup, Q4 planning, etc.",
          attendeesPlaceholder: "John, Sarah, Mike",
          contextPlaceholder: "Any background info or key decisions expected..."
        };
      case "socials":
        return {
          topic: "Thread/Chat Topic",
          attendees: "Participants",
          context: "Platform & Context",
          topicPlaceholder: "Bug discussion, feature feedback, etc.",
          attendeesPlaceholder: "@john_dev, @sarah_pm, @mike_lead",
          contextPlaceholder: "Slack #engineering, Discord #general, etc."
        };
      case "notes":
        return {
          topic: "Session/Document Title",
          attendees: "Contributors",
          context: "Source & Context",
          topicPlaceholder: "Brainstorm session, idea dump, etc.",
          attendeesPlaceholder: "Team members, stakeholders",
          contextPlaceholder: "Notion page, meeting notes, whiteboard session..."
        };
      default:
        return {
          topic: "Topic",
          attendees: "Participants",
          context: "Context",
          topicPlaceholder: "",
          attendeesPlaceholder: "",
          contextPlaceholder: ""
        };
    }
  };

  const labels = getFieldLabels();

  // Show loading screen during file upload
  if (uploadMutation.isPending) {
    return (
      <LoadingScreen 
        variant="data" 
        message="PARSING FILE DATA"
        className="relative"
      />
    );
  }

  return (
    <div className="space-y-4">
      {/* Content Mode Toggle */}
      <ContentModeToggle
        currentMode={contentMode}
        onModeChange={setContentMode}
      />

      <div className="magi-panel rounded-lg p-6">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 cyber-glow tracking-wide font-doto">INPUT MODULE</h2>
          <div className="text-xs text-cyber-cyan mb-4 font-tourney">TRI-CORE COGNITIVE INTERFACE • ONLINE</div>
        
          {/* File Upload Area */}
          <FileUpload
            onFileUpload={handleFileUpload}
            isUploading={uploadMutation.isPending}
          />
        
          {/* Text Input */}
          <div className="mt-6">
            <Label className="block text-sm font-bold mb-2 cyber-glow">
              {contentMode === "meetings" ? "PASTE TRANSCRIPT" : contentMode === "socials" ? "PASTE CHAT LOGS" : "PASTE NOTES"}
            </Label>
            <Textarea
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              className="w-full h-32 terminal-input rounded p-3 text-sm resize-none"
              placeholder={getPlaceholderText()}
            />
          </div>
        
          {/* Dynamic Fields Based on Content Mode */}
          <div className="mt-6 space-y-3">
            <div>
              <Label className="block text-sm font-bold mb-1 cyber-glow">{labels.topic.toUpperCase()}</Label>
              <Input
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full terminal-input rounded p-2 text-sm"
                placeholder={labels.topicPlaceholder}
              />
            </div>
            <div>
              <Label className="block text-sm font-bold mb-1 cyber-glow">{labels.attendees.toUpperCase()}</Label>
              <Input
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full terminal-input rounded p-2 text-sm"
                placeholder={labels.attendeesPlaceholder}
              />
            </div>
            <div>
              <Label className="block text-sm font-bold mb-1 cyber-glow">{labels.context.toUpperCase()}</Label>
              <Input
                value={knownInfo}
                onChange={(e) => setKnownInfo(e.target.value)}
                className="w-full terminal-input rounded p-2 text-sm"
                placeholder={labels.contextPlaceholder}
              />
            </div>
          </div>
        </div>
      </div>
      
      {/* Emergency Recovery Mode */}
      <div className="auth-panel p-6">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-4 text-cyber-red cyber-glow tracking-wide">EMERGENCY RECOVERY</h3>
          <div className="text-xs text-cyber-cyan mb-4 font-mono">MOTION: COGNITIVE RECONSTRUCTION</div>
          
          <div className="space-y-3">
            <div className="text-sm text-cyber-cyan/70 mb-2">
              {contentMode === "meetings" && "Generate insights from minimal meeting context"}
              {contentMode === "socials" && "Reconstruct discussion from partial chat fragments"}
              {contentMode === "notes" && "Organize scattered ideas into structured insights"}
            </div>
            <Button
              onClick={handleEmergencyRecovery}
              disabled={emergencyRecoveryMutation.isPending}
              className="w-full nerv-unlock text-white px-4 py-2 rounded font-bold transition-colors"
            >
              {emergencyRecoveryMutation.isPending ? "RECONSTRUCTING..." : "EMERGENCY RECONSTRUCT"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
