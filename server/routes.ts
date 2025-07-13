import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { analyzeRequestSchema } from "@shared/schema";
import { analyzeMeetingContent } from "./services/openai";
import { parseFile } from "./services/fileParser";

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/x-subrip'];
    const allowedExtensions = ['.txt', '.docx', '.srt'];
    const hasValidExtension = allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    if (hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt, .docx, and .srt files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // File upload endpoint
  app.post("/api/upload", upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const transcript = await parseFile(req.file.buffer, req.file.originalname);
      
      res.json({ 
        success: true, 
        transcript,
        filename: req.file.originalname 
      });
    } catch (error) {
      console.error("File upload error:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to process file" 
      });
    }
  });

  // Meeting analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      const validatedData = analyzeRequestSchema.parse(req.body);
      
      const analysis = await analyzeMeetingContent(
        validatedData.transcript,
        validatedData.topic,
        validatedData.attendees,
        validatedData.knownInfo,
        validatedData.mode as "melchior" | "balthasar" | "casper" | "emergency"
      );
      
      res.json({ 
        success: true, 
        analysis 
      });
    } catch (error) {
      console.error("Analysis error:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to analyze meeting content" 
      });
    }
  });

  // Export endpoint
  app.post("/api/export", async (req, res) => {
    try {
      const { format, analysis } = req.body;
      
      if (!analysis) {
        return res.status(400).json({ error: "No analysis data provided" });
      }

      let content = "";
      
      if (format === "markdown") {
        content = `# Meeting Recovery Report

## Summary
${analysis.summary}

## Key Decisions
${analysis.keyDecisions.map((decision: string) => `- ${decision}`).join('\n')}

## Action Items
${analysis.actionItems.map((item: any) => `- ${item.task}${item.assignee ? ` (${item.assignee})` : ''}`).join('\n')}

## Unanswered Questions
${analysis.unansweredQuestions.map((question: string) => `- ${question}`).join('\n')}

## Follow-ups
${analysis.followUps.map((followUp: string) => `- ${followUp}`).join('\n')}
`;
      } else {
        content = `Meeting Recovery Report

Summary:
${analysis.summary}

Key Decisions:
${analysis.keyDecisions.map((decision: string) => `- ${decision}`).join('\n')}

Action Items:
${analysis.actionItems.map((item: any) => `- ${item.task}${item.assignee ? ` (${item.assignee})` : ''}`).join('\n')}

Unanswered Questions:
${analysis.unansweredQuestions.map((question: string) => `- ${question}`).join('\n')}

Follow-ups:
${analysis.followUps.map((followUp: string) => `- ${followUp}`).join('\n')}
`;
      }

      res.json({ 
        success: true, 
        content,
        filename: `meeting-recovery-${Date.now()}.${format === "markdown" ? "md" : "txt"}`
      });
    } catch (error) {
      console.error("Export error:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to export content" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
