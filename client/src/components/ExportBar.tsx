import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { MeetingAnalysis } from "@shared/schema";

interface ExportBarProps {
  analysis: MeetingAnalysis | null;
}

export default function ExportBar({ analysis }: ExportBarProps) {
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

  return (
    <footer className="border-t-2 border-cyber-orange bg-cyber-panel p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="text-sm text-cyber-cyan">
          EXPORT OPTIONS
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={copyToClipboard}
            disabled={!analysis}
            className="bg-cyber-teal text-black px-4 py-2 rounded font-bold hover:bg-cyan-400 transition-colors"
          >
            📄 COPY
          </Button>
          <Button
            onClick={() => exportMutation.mutate("text")}
            disabled={!analysis || exportMutation.isPending}
            className="bg-cyber-orange text-black px-4 py-2 rounded font-bold hover:bg-orange-600 transition-colors"
          >
            📥 DOWNLOAD
          </Button>
          <Button
            onClick={sendToNotion}
            disabled={!analysis}
            className="bg-cyber-red text-white px-4 py-2 rounded font-bold hover:bg-red-700 transition-colors"
          >
            📝 NOTION
          </Button>
        </div>
      </div>
    </footer>
  );
}
