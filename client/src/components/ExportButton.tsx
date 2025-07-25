import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MeetingAnalysis } from "@shared/schema";
import { Copy, Download, FileText } from "lucide-react";

interface ExportButtonProps {
  type: "copy" | "download" | "notion";
  analysis: MeetingAnalysis | null;
  variant?: "header" | "menu";
}

export default function ExportButton({ type, analysis, variant = "header" }: ExportButtonProps) {
  const { toast } = useToast();

  const exportMutation = useMutation({
    mutationFn: async (format: "text" | "markdown") => {
      const response = await apiRequest('POST', '/api/export', {
        format,
        analysis,
      });
      return response.json();
    },
    onSuccess: (data) => {
      // Create and download file
      const blob = new Blob([data.content], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      
      toast({
        title: "Export complete",
        description: `Downloaded ${data.filename}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Export failed",
        description: error instanceof Error ? error.message : "Failed to export",
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = async () => {
    if (!analysis) {
      toast({
        title: "No content to copy",
        description: "Please analyze a meeting first",
        variant: "destructive",
      });
      return;
    }

    const content = `Meeting Recovery Report

Summary:
${analysis.summary}

Key Decisions:
${analysis.keyDecisions.map(decision => `- ${decision}`).join('\n')}

Action Items:
${analysis.actionItems.map(item => `- ${item.task}${item.assignee ? ` (${item.assignee})` : ''}`).join('\n')}

Unanswered Questions:
${analysis.unansweredQuestions.map(question => `- ${question}`).join('\n')}

Follow-ups:
${analysis.followUps.map(followUp => `- ${followUp}`).join('\n')}
`;

    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied to clipboard",
        description: "Meeting recovery report copied",
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard",
        variant: "destructive",
      });
    }
  };

  const sendToNotion = () => {
    toast({
      title: "Notion integration",
      description: "Notion integration coming soon",
    });
  };

  const handleClick = () => {
    switch (type) {
      case "copy":
        copyToClipboard();
        break;
      case "download":
        exportMutation.mutate("text");
        break;
      case "notion":
        sendToNotion();
        break;
    }
  };

  const getButtonStyles = () => {
    if (variant === "menu") {
      return "w-full justify-start text-cyber-cyan hover:bg-cyber-orange hover:text-cyber-dark-panel bg-transparent border border-cyber-border";
    }
    
    switch (type) {
      case "copy":
        return "bg-cyber-teal text-cyber-dark-panel hover:bg-cyan-400";
      case "download":
        return "bg-cyber-orange text-cyber-dark-panel hover:bg-orange-600";
      case "notion":
        return "bg-cyber-red text-white hover:bg-red-700";
      default:
        return "bg-cyber-teal text-cyber-dark-panel hover:bg-cyan-400";
    }
  };

  const getButtonText = () => {
    if (variant === "menu") {
      switch (type) {
        case "copy":
          return "Copy to Clipboard";
        case "download":
          return "Download as Text";
        case "notion":
          return "Export to Notion";
        default:
          return "Copy to Clipboard";
      }
    }
    
    switch (type) {
      case "copy":
        return "📄 COPY";
      case "download":
        return "📥 DOWNLOAD";
      case "notion":
        return "📝 NOTION";
      default:
        return "📄 COPY";
    }
  };

  const getButtonIcon = () => {
    switch (type) {
      case "copy":
        return <Copy className="w-4 h-4 mr-2" />;
      case "download":
        return <Download className="w-4 h-4 mr-2" />;
      case "notion":
        return <FileText className="w-4 h-4 mr-2" />;
      default:
        return <Copy className="w-4 h-4 mr-2" />;
    }
  };

  return (
    <Button
      onClick={handleClick}
      disabled={!analysis || (type === "download" && exportMutation.isPending)}
      className={`${getButtonStyles()} ${variant === "menu" ? "text-sm" : "px-2 py-1 text-xs"} rounded font-bold transition-colors micro-hover scale-click button-glow cyber-ripple`}
      size="sm"
    >
      {variant === "menu" && getButtonIcon()}
      {getButtonText()}
    </Button>
  );
}