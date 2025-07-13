import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import FileUpload from "@/components/ui/file-upload";
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
    uploadMutation.mutate(file);
  };

  const handleEmergencyRecovery = () => {
    setIsProcessing(true);
    emergencyRecoveryMutation.mutate();
  };

  return (
    <div className="space-y-4">
      <div className="magi-panel rounded-lg p-6">
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-4 cyber-glow tracking-wide font-doto">INPUT MODULE</h2>
          <div className="text-xs text-cyber-cyan mb-4 font-tektur">MAGI MELCHIOR-1 • ONLINE</div>
        
          {/* File Upload Area */}
        <FileUpload
          onFileUpload={handleFileUpload}
          isUploading={uploadMutation.isPending}
        />
        
        {/* Text Input */}
        <div className="mt-6">
          <Label className="block text-sm font-bold mb-2 cyber-glow">PASTE TRANSCRIPT</Label>
          <Textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full h-32 terminal-input rounded p-3 text-sm resize-none"
            placeholder="Paste meeting transcript, notes, or audio blob..."
          />
        </div>
        
        {/* Meeting Info */}
        <div className="mt-6 space-y-3">
          <div>
            <Label className="block text-sm font-bold mb-1 cyber-glow">TOPIC</Label>
            <Input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full terminal-input rounded p-2 text-sm"
              placeholder="e.g., Sprint planning"
            />
          </div>
          <div>
            <Label className="block text-sm font-bold mb-1 cyber-glow">ATTENDEES</Label>
            <Input
              value={attendees}
              onChange={(e) => setAttendees(e.target.value)}
              className="w-full terminal-input rounded p-2 text-sm"
              placeholder="John, Sarah, Mike (optional)"
            />
          </div>
        </div>
        </div>
      </div>
      
      {/* Emergency Recovery Mode */}
      <div className="auth-panel p-6">
        <div className="relative z-10">
          <h3 className="text-lg font-bold mb-4 text-cyber-red cyber-glow tracking-wide">EMERGENCY RECOVERY</h3>
          <div className="text-xs text-cyber-cyan mb-4 font-mono">MOTION: SELF-DESTRUCTION</div>
          
          <div className="space-y-3">
            <Input
              value={knownInfo}
              onChange={(e) => setKnownInfo(e.target.value)}
              className="w-full terminal-input rounded p-2 text-sm"
              placeholder="What you know happened..."
            />
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
