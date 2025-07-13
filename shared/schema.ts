import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  transcript: text("transcript").notNull(),
  topic: text("topic"),
  attendees: text("attendees"),
  knownInfo: text("known_info"),
  analysis: jsonb("analysis"),
  createdAt: text("created_at").notNull(),
});

export const insertMeetingSchema = createInsertSchema(meetings).pick({
  transcript: true,
  topic: true,
  attendees: true,
  knownInfo: true,
});

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;

export interface MeetingAnalysis {
  summary: string;
  keyDecisions: string[];
  actionItems: Array<{
    task: string;
    assignee?: string;
  }>;
  unansweredQuestions: string[];
  followUps: string[];
}

export const analyzeRequestSchema = z.object({
  transcript: z.string().min(1, "Transcript is required"),
  topic: z.string().optional(),
  attendees: z.string().optional(),
  knownInfo: z.string().optional(),
  mode: z.enum(["melchior", "balthasar", "casper", "emergency"]).default("melchior"),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
