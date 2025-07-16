import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import multer from "multer";
import { analyzeRequestSchema, saveMeetingSchema, redeemLicenseKeySchema } from "@shared/schema";
import { analyzeMeetingContent } from "./services/openai";
import { parseFile } from "./services/fileParser";
import { storage } from "./storage";
import { verifyFirebaseToken } from "./firebase-admin";

// Auth middleware
interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

async function authMiddleware(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'No authentication token provided' });
    }

    const token = authHeader.substring(7);
    const decodedToken = await verifyFirebaseToken(token);
    
    // Get or create user in database
    let user = await storage.getUserByFirebaseUid(decodedToken.uid);
    if (!user) {
      user = await storage.createUser({
        firebaseUid: decodedToken.uid,
        email: decodedToken.email || '',
        displayName: null,
      });
    }
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    res.status(401).json({ error: 'Invalid authentication token' });
  }
}

const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/x-subrip', 'application/pdf'];
    const allowedExtensions = ['.txt', '.docx', '.srt', '.pdf'];
    const hasValidExtension = allowedExtensions.some(ext => file.originalname.toLowerCase().endsWith(ext));
    
    if (hasValidExtension) {
      cb(null, true);
    } else {
      cb(new Error('Only .txt, .docx, .srt, and .pdf files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Health check endpoint
  app.get("/api/health", async (req, res) => {
    try {
      const hasApiKey = !!process.env.OPENROUTER_API_KEY;
      const hasDbUrl = !!process.env.DATABASE_URL;
      
      res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        hasApiKey,
        hasDbUrl,
        version: "1.0.0"
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: "Health check failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });


  
  // Get user info endpoint
  app.get("/api/user", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const user = await storage.getUserByFirebaseUid(req.user!.uid);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      
      res.json({ 
        success: true, 
        user: {
          id: user.id,
          email: user.email,
          displayName: user.displayName,
          credits: user.credits,
          createdAt: user.createdAt,
        }
      });
    } catch (error) {
      console.error("User info error:", error);
      res.status(500).json({ error: "Failed to retrieve user information" });
    }
  });
  
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
  app.post("/api/analyze", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = analyzeRequestSchema.parse(req.body);
      
      // Check if user has sufficient credits
      const hasCredits = await storage.decrementUserCredits(req.user!.uid);
      if (!hasCredits) {
        return res.status(402).json({ 
          error: "Insufficient credits. Please purchase more credits to continue.",
          needsPayment: true,
          paymentUrl: "https://payhip.com/b/dAc53"
        });
      }
      
      const analysis = await analyzeMeetingContent(
        validatedData.transcript,
        validatedData.topic,
        validatedData.attendees,
        validatedData.knownInfo,
        validatedData.mode as "synthrax" | "vantix" | "lymnia" | "emergency",
        validatedData.contentMode as "meetings" | "socials" | "notes"
      );
      
      res.json({ 
        success: true, 
        analysis 
      });
    } catch (error) {
      console.error("[Routes] Analysis error:", error);
      
      // If analysis fails, refund the credit
      try {
        const user = await storage.getUserByFirebaseUid(req.user!.uid);
        if (user) {
          await storage.updateUserCredits(req.user!.uid, user.credits + 1);
          console.log(`[Routes] Refunded 1 credit to user ${req.user!.uid}`);
        }
      } catch (refundError) {
        console.error("[Routes] Failed to refund credit:", refundError);
      }
      
      // Provide detailed error response
      const errorMessage = error instanceof Error ? error.message : "Unknown error occurred";
      res.status(500).json({ 
        error: errorMessage,
        timestamp: new Date().toISOString()
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

  // Memory Bank API routes
  app.post("/api/memory-bank/save", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const validatedData = saveMeetingSchema.parse(req.body);
      const { analysis, transcript, topic, attendees, knownInfo, shinraiMode, ...saveData } = req.body;
      
      const meeting = await storage.saveMeeting({
        ...saveData,
        transcript: transcript || "",
        topic,
        attendees,
        knownInfo,
        analysis,
        shinraiMode,
      }, req.user!.uid);
      
      res.json({ success: true, meeting });
    } catch (error) {
      console.error("Save meeting error:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to save meeting" 
      });
    }
  });

  app.get("/api/memory-bank/meetings", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const offset = parseInt(req.query.offset as string) || 0;
      
      const meetings = await storage.getMeetings(req.user!.uid, limit, offset);
      res.json({ success: true, meetings });
    } catch (error) {
      console.error("Get meetings error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to get meetings" 
      });
    }
  });

  app.get("/api/memory-bank/meetings/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      const meeting = await storage.getMeetingById(id, req.user!.uid);
      
      if (!meeting) {
        return res.status(404).json({ error: "Meeting not found" });
      }
      
      res.json({ success: true, meeting });
    } catch (error) {
      console.error("Get meeting error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to get meeting" 
      });
    }
  });

  app.get("/api/memory-bank/search", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const query = req.query.q as string;
      if (!query) {
        return res.status(400).json({ error: "Query parameter 'q' is required" });
      }
      
      const meetings = await storage.searchMeetings(query, req.user!.uid);
      res.json({ success: true, meetings });
    } catch (error) {
      console.error("Search meetings error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to search meetings" 
      });
    }
  });

  app.get("/api/memory-bank/category/:category", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const category = req.params.category;
      const meetings = await storage.getMeetingsByCategory(category, req.user!.uid);
      res.json({ success: true, meetings });
    } catch (error) {
      console.error("Get meetings by category error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to get meetings by category" 
      });
    }
  });

  app.get("/api/memory-bank/tag/:tagId", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const tagId = parseInt(req.params.tagId);
      const meetings = await storage.getMeetingsByTag(tagId, req.user!.uid);
      res.json({ success: true, meetings });
    } catch (error) {
      console.error("Get meetings by tag error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to get meetings by tag" 
      });
    }
  });

  app.get("/api/memory-bank/tags", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const tags = await storage.getTags(req.user!.uid);
      res.json({ success: true, tags });
    } catch (error) {
      console.error("Get tags error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to get tags" 
      });
    }
  });

  app.post("/api/memory-bank/tags", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { name, color } = req.body;
      const tag = await storage.createTag({ name, color }, req.user!.uid);
      res.json({ success: true, tag });
    } catch (error) {
      console.error("Create tag error:", error);
      res.status(400).json({ 
        error: error instanceof Error ? error.message : "Failed to create tag" 
      });
    }
  });

  app.delete("/api/memory-bank/meetings/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteMeeting(id, req.user!.uid);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete meeting error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to delete meeting" 
      });
    }
  });

  app.delete("/api/memory-bank/tags/:id", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTag(id, req.user!.uid);
      res.json({ success: true });
    } catch (error) {
      console.error("Delete tag error:", error);
      res.status(500).json({ 
        error: error instanceof Error ? error.message : "Failed to delete tag" 
      });
    }
  });

  // Redeem license key
  app.post("/api/redeem-license-key", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      console.log("License key redemption attempt:", {
        user: req.user?.uid,
        body: req.body,
        timestamp: new Date().toISOString()
      });

      const validationResult = redeemLicenseKeySchema.safeParse(req.body);
      if (!validationResult.success) {
        console.error("Validation failed:", validationResult.error.issues);
        return res.status(400).json({ 
          error: "Invalid license key format. Please check your key and try again.",
          details: validationResult.error.issues 
        });
      }

      const { key } = validationResult.data;
      console.log("Attempting to redeem key:", key);
      
      const result = await storage.redeemLicenseKey(key, req.user!.uid);
      console.log("Redemption result:", result);
      
      if (result.success) {
        res.json({ 
          success: true, 
          message: result.message,
          credits: result.credits 
        });
      } else {
        res.status(400).json({ 
          success: false, 
          error: result.message 
        });
      }
    } catch (error) {
      console.error("Error redeeming license key:", error);
      res.status(500).json({ error: "Failed to redeem license key. Please try again." });
    }
  });

  // Mentor System API endpoints
  app.get("/api/mentor/sessions", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const sessions = await storage.getMentorSessions(req.user!.uid);
      res.json({ success: true, sessions });
    } catch (error) {
      console.error("Error fetching mentor sessions:", error);
      res.status(500).json({ error: "Failed to fetch mentor sessions" });
    }
  });

  app.post("/api/mentor/start-session", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { sessionType } = req.body;
      
      if (!sessionType) {
        return res.status(400).json({ error: "Session type is required" });
      }

      const newSession = await storage.createMentorSession({
        userId: req.user!.uid,
        sessionType,
        currentStep: 0,
        isCompleted: false,
        contextData: {}
      });

      res.json({ success: true, session: newSession });
    } catch (error) {
      console.error("Error starting mentor session:", error);
      res.status(500).json({ error: "Failed to start mentor session" });
    }
  });

  app.post("/api/mentor/update-progress", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { sessionId, step, completed } = req.body;
      
      if (!sessionId || step === undefined) {
        return res.status(400).json({ error: "Session ID and step are required" });
      }

      const updates: Partial<any> = { 
        currentStep: step,
        updatedAt: new Date()
      };

      if (completed !== undefined) {
        updates.isCompleted = completed;
      }

      const updatedSession = await storage.updateMentorSession(sessionId, updates);
      res.json({ success: true, session: updatedSession });
    } catch (error) {
      console.error("Error updating mentor progress:", error);
      res.status(500).json({ error: "Failed to update mentor progress" });
    }
  });

  app.post("/api/mentor/update-user-progress", authMiddleware, async (req: AuthenticatedRequest, res) => {
    try {
      const { progress } = req.body;
      
      await storage.updateUserMentorProgress(req.user!.uid, progress);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating user mentor progress:", error);
      res.status(500).json({ error: "Failed to update user mentor progress" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
