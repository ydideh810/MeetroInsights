import { pgTable, text, serial, integer, boolean, jsonb, timestamp, varchar } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { relations } from "drizzle-orm";
import { z } from "zod";

export const meetings = pgTable("meetings", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Firebase UID
  transcript: text("transcript").notNull(),
  topic: text("topic"),
  attendees: text("attendees"),
  knownInfo: text("known_info"),
  analysis: jsonb("analysis"),
  title: varchar("title", { length: 255 }).notNull(),
  category: varchar("category", { length: 100 }),
  shinraiMode: varchar("shinrai_mode", { length: 20 }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tags = pgTable("tags", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Firebase UID
  name: varchar("name", { length: 50 }).notNull(),
  color: varchar("color", { length: 7 }).notNull(), // hex color code
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const meetingTags = pgTable("meeting_tags", {
  id: serial("id").primaryKey(),
  meetingId: integer("meeting_id").notNull(),
  tagId: integer("tag_id").notNull(),
});

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  firebaseUid: text("firebase_uid").notNull().unique(),
  email: text("email").notNull(),
  displayName: text("display_name"),
  credits: integer("credits").notNull().default(10),
  mentorProgress: jsonb("mentor_progress").default({}), // Track mentor guidance progress
  preferences: jsonb("preferences").default({}), // User preferences for guidance
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const mentorSessions = pgTable("mentor_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Firebase UID
  sessionType: varchar("session_type", { length: 50 }).notNull(), // onboarding, feature_intro, troubleshooting, etc.
  currentStep: integer("current_step").notNull().default(0),
  isCompleted: boolean("is_completed").notNull().default(false),
  contextData: jsonb("context_data").default({}), // Additional context for the session
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const licenseKeys = pgTable("license_keys", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  credits: integer("credits").notNull().default(10),
  isRedeemed: boolean("is_redeemed").notNull().default(false),
  redeemedBy: text("redeemed_by"),
  redeemedAt: timestamp("redeemed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// Relations
export const meetingsRelations = relations(meetings, ({ many }) => ({
  meetingTags: many(meetingTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  meetingTags: many(meetingTags),
}));

export const meetingTagsRelations = relations(meetingTags, ({ one }) => ({
  meeting: one(meetings, {
    fields: [meetingTags.meetingId],
    references: [meetings.id],
  }),
  tag: one(tags, {
    fields: [meetingTags.tagId],
    references: [tags.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  meetings: many(meetings),
  tags: many(tags),
  mentorSessions: many(mentorSessions),
}));

export const mentorSessionsRelations = relations(mentorSessions, ({ one }) => ({
  user: one(users, {
    fields: [mentorSessions.userId],
    references: [users.firebaseUid],
  }),
}));

export const licenseKeysRelations = relations(licenseKeys, ({ one }) => ({
  redeemedByUser: one(users, {
    fields: [licenseKeys.redeemedBy],
    references: [users.firebaseUid],
  }),
}));

export const insertMeetingSchema = createInsertSchema(meetings).pick({
  transcript: true,
  topic: true,
  attendees: true,
  knownInfo: true,
  title: true,
  category: true,
  shinraiMode: true,
});

export const insertTagSchema = createInsertSchema(tags).pick({
  name: true,
  color: true,
});

export const insertUserSchema = createInsertSchema(users).pick({
  firebaseUid: true,
  email: true,
  displayName: true,
  mentorProgress: true,
  preferences: true,
});

export const insertMentorSessionSchema = createInsertSchema(mentorSessions).pick({
  userId: true,
  sessionType: true,
  currentStep: true,
  isCompleted: true,
  contextData: true,
});

export const saveMeetingSchema = z.object({
  meetingId: z.number().optional(),
  title: z.string().min(1, "Title is required"),
  category: z.string().optional(),
  tagIds: z.array(z.number()).optional(),
  newTags: z.array(z.object({
    name: z.string().min(1),
    color: z.string().regex(/^#[0-9A-F]{6}$/i),
  })).optional(),
});

export const redeemLicenseKeySchema = z.object({
  key: z.string().min(1, "License key is required").regex(/^[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}-[A-Z0-9]{5}$/i, "Invalid license key format"),
});

export type InsertMeeting = z.infer<typeof insertMeetingSchema>;
export type Meeting = typeof meetings.$inferSelect;
export type Tag = typeof tags.$inferSelect;
export type InsertTag = z.infer<typeof insertTagSchema>;
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SaveMeetingRequest = z.infer<typeof saveMeetingSchema>;
export type LicenseKey = typeof licenseKeys.$inferSelect;
export type RedeemLicenseKeyRequest = z.infer<typeof redeemLicenseKeySchema>;
export type MentorSession = typeof mentorSessions.$inferSelect;
export type InsertMentorSession = z.infer<typeof insertMentorSessionSchema>;

export interface MeetingHighlight {
  timestamp?: string;
  moment: string;
  type: 'decision' | 'breakthrough' | 'conflict' | 'insight' | 'emotional' | 'turning_point';
  intensity: number; // 1-10 scale
  participants?: string[];
  context: string;
}

export interface MeetingAnalysis {
  summary: string;
  keyDecisions: string[];
  actionItems: Array<{
    task: string;
    assignee?: string;
  }>;
  unansweredQuestions: string[];
  followUps: string[];
  highlights: MeetingHighlight[];
}

export const analyzeRequestSchema = z.object({
  transcript: z.string().min(1, "Transcript is required"),
  topic: z.string().optional(),
  attendees: z.string().optional(),
  knownInfo: z.string().optional(),
  mode: z.enum(["synthrax", "vantix", "lymnia", "emergency"]).default("synthrax"),
  contentMode: z.enum(["meetings", "socials", "notes"]).default("meetings"),
});

export type AnalyzeRequest = z.infer<typeof analyzeRequestSchema>;
