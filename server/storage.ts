import { meetings, tags, meetingTags, users, licenseKeys, mentorSessions, type Meeting, type Tag, type User, type InsertMeeting, type InsertTag, type InsertUser, type MeetingAnalysis, type LicenseKey, type MentorSession, type InsertMentorSession } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or, and } from "drizzle-orm";

// Memory Bank interfaces
export interface MeetingWithTags extends Meeting {
  tags: Tag[];
}

export interface SaveMeetingData {
  title: string;
  category?: string;
  transcript: string;
  topic?: string;
  attendees?: string;
  knownInfo?: string;
  analysis: MeetingAnalysis;
  magiMode?: string;
  tagIds?: number[];
  newTags?: Array<{ name: string; color: string; }>;
}

export interface IStorage {
  // User management
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserCredits(firebaseUid: string, credits: number): Promise<void>;
  decrementUserCredits(firebaseUid: string): Promise<boolean>; // Returns true if successful, false if insufficient credits
  
  // License key management
  redeemLicenseKey(key: string, firebaseUid: string): Promise<{ success: boolean; message: string; credits?: number }>;
  
  // Mentor system methods
  getMentorSessions(userId: string): Promise<MentorSession[]>;
  createMentorSession(session: InsertMentorSession): Promise<MentorSession>;
  updateMentorSession(sessionId: number, updates: Partial<MentorSession>): Promise<MentorSession>;
  updateUserMentorProgress(firebaseUid: string, progress: any): Promise<void>;
  
  // Memory Bank methods
  saveMeeting(data: SaveMeetingData, userId: string): Promise<Meeting>;
  getMeetings(userId: string, limit?: number, offset?: number): Promise<MeetingWithTags[]>;
  getMeetingById(id: number, userId: string): Promise<MeetingWithTags | undefined>;
  searchMeetings(query: string, userId: string): Promise<MeetingWithTags[]>;
  getMeetingsByCategory(category: string, userId: string): Promise<MeetingWithTags[]>;
  getMeetingsByTag(tagId: number, userId: string): Promise<MeetingWithTags[]>;
  
  getTags(userId: string): Promise<Tag[]>;
  createTag(tag: InsertTag, userId: string): Promise<Tag>;
  deleteTag(id: number, userId: string): Promise<void>;
  
  deleteMeeting(id: number, userId: string): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async updateUserCredits(firebaseUid: string, credits: number): Promise<void> {
    await db
      .update(users)
      .set({ credits, updatedAt: new Date() })
      .where(eq(users.firebaseUid, firebaseUid));
  }

  async decrementUserCredits(firebaseUid: string): Promise<boolean> {
    const user = await this.getUserByFirebaseUid(firebaseUid);
    if (!user || user.credits <= 0) {
      return false;
    }

    await db
      .update(users)
      .set({ credits: user.credits - 1, updatedAt: new Date() })
      .where(eq(users.firebaseUid, firebaseUid));
    
    return true;
  }

  async redeemLicenseKey(key: string, firebaseUid: string): Promise<{ success: boolean; message: string; credits?: number }> {
    try {
      // Check if license key exists and is not redeemed
      const [licenseKey] = await db
        .select()
        .from(licenseKeys)
        .where(eq(licenseKeys.key, key.toUpperCase()));

      if (!licenseKey) {
        return { success: false, message: "Invalid license key" };
      }

      if (licenseKey.isRedeemed) {
        return { success: false, message: "License key has already been redeemed" };
      }

      // Get user to update credits
      const user = await this.getUserByFirebaseUid(firebaseUid);
      if (!user) {
        return { success: false, message: "User not found" };
      }

      // Mark license key as redeemed and update user credits
      await db.transaction(async (tx) => {
        await tx.update(licenseKeys)
          .set({ 
            isRedeemed: true, 
            redeemedBy: firebaseUid,
            redeemedAt: new Date()
          })
          .where(eq(licenseKeys.key, key.toUpperCase()));

        await tx.update(users)
          .set({ credits: user.credits + licenseKey.credits, updatedAt: new Date() })
          .where(eq(users.firebaseUid, firebaseUid));
      });

      return { 
        success: true, 
        message: `Successfully redeemed ${licenseKey.credits} credits!`, 
        credits: licenseKey.credits 
      };
    } catch (error) {
      console.error('Error redeeming license key:', error);
      return { success: false, message: "An error occurred while redeeming the license key" };
    }
  }

  async getMentorSessions(userId: string): Promise<MentorSession[]> {
    const sessions = await db
      .select()
      .from(mentorSessions)
      .where(eq(mentorSessions.userId, userId))
      .orderBy(desc(mentorSessions.createdAt));
    
    return sessions;
  }

  async createMentorSession(session: InsertMentorSession): Promise<MentorSession> {
    const [newSession] = await db
      .insert(mentorSessions)
      .values(session)
      .returning();
    
    return newSession;
  }

  async updateMentorSession(sessionId: number, updates: Partial<MentorSession>): Promise<MentorSession> {
    const [updatedSession] = await db
      .update(mentorSessions)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(mentorSessions.id, sessionId))
      .returning();
    
    return updatedSession;
  }

  async updateUserMentorProgress(firebaseUid: string, progress: any): Promise<void> {
    await db
      .update(users)
      .set({ mentorProgress: progress, updatedAt: new Date() })
      .where(eq(users.firebaseUid, firebaseUid));
  }

  async saveMeeting(data: SaveMeetingData, userId: string): Promise<Meeting> {
    // Create new tags if provided
    const createdTags: Tag[] = [];
    if (data.newTags && data.newTags.length > 0) {
      for (const newTag of data.newTags) {
        const [tag] = await db
          .insert(tags)
          .values({
            ...newTag,
            userId
          })
          .returning();
        createdTags.push(tag);
      }
    }

    // Create the meeting
    const [meeting] = await db
      .insert(meetings)
      .values({
        userId,
        title: data.title,
        category: data.category,
        transcript: data.transcript,
        topic: data.topic,
        attendees: data.attendees,
        knownInfo: data.knownInfo,
        analysis: data.analysis,
        magiMode: data.magiMode,
      })
      .returning();

    // Link tags to meeting
    const allTagIds = [
      ...(data.tagIds || []),
      ...createdTags.map(tag => tag.id)
    ];

    if (allTagIds.length > 0) {
      await db
        .insert(meetingTags)
        .values(
          allTagIds.map(tagId => ({
            meetingId: meeting.id,
            tagId,
          }))
        );
    }

    return meeting;
  }

  async getMeetings(userId: string, limit: number = 20, offset: number = 0): Promise<MeetingWithTags[]> {
    const meetingsData = await db
      .select()
      .from(meetings)
      .where(eq(meetings.userId, userId))
      .orderBy(desc(meetings.createdAt))
      .limit(limit)
      .offset(offset);

    const meetingsWithTags: MeetingWithTags[] = [];
    
    for (const meeting of meetingsData) {
      const meetingTagsData = await db
        .select({
          tag: tags,
        })
        .from(meetingTags)
        .innerJoin(tags, eq(meetingTags.tagId, tags.id))
        .where(eq(meetingTags.meetingId, meeting.id));

      meetingsWithTags.push({
        ...meeting,
        tags: meetingTagsData.map(mt => mt.tag),
      });
    }

    return meetingsWithTags;
  }

  async getMeetingById(id: number, userId: string): Promise<MeetingWithTags | undefined> {
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.id, id), eq(meetings.userId, userId)));

    if (!meeting) return undefined;

    const meetingTagsData = await db
      .select({
        tag: tags,
      })
      .from(meetingTags)
      .innerJoin(tags, eq(meetingTags.tagId, tags.id))
      .where(eq(meetingTags.meetingId, id));

    return {
      ...meeting,
      tags: meetingTagsData.map(mt => mt.tag),
    };
  }

  async searchMeetings(query: string, userId: string): Promise<MeetingWithTags[]> {
    const meetingsData = await db
      .select()
      .from(meetings)
      .where(
        and(
          eq(meetings.userId, userId),
          or(
            like(meetings.title, `%${query}%`),
            like(meetings.transcript, `%${query}%`),
            like(meetings.topic, `%${query}%`),
            like(meetings.category, `%${query}%`)
          )
        )
      )
      .orderBy(desc(meetings.createdAt));

    const meetingsWithTags: MeetingWithTags[] = [];
    
    for (const meeting of meetingsData) {
      const meetingTagsData = await db
        .select({
          tag: tags,
        })
        .from(meetingTags)
        .innerJoin(tags, eq(meetingTags.tagId, tags.id))
        .where(eq(meetingTags.meetingId, meeting.id));

      meetingsWithTags.push({
        ...meeting,
        tags: meetingTagsData.map(mt => mt.tag),
      });
    }

    return meetingsWithTags;
  }

  async getMeetingsByCategory(category: string, userId: string): Promise<MeetingWithTags[]> {
    const meetingsData = await db
      .select()
      .from(meetings)
      .where(and(eq(meetings.category, category), eq(meetings.userId, userId)))
      .orderBy(desc(meetings.createdAt));

    const meetingsWithTags: MeetingWithTags[] = [];
    
    for (const meeting of meetingsData) {
      const meetingTagsData = await db
        .select({
          tag: tags,
        })
        .from(meetingTags)
        .innerJoin(tags, eq(meetingTags.tagId, tags.id))
        .where(eq(meetingTags.meetingId, meeting.id));

      meetingsWithTags.push({
        ...meeting,
        tags: meetingTagsData.map(mt => mt.tag),
      });
    }

    return meetingsWithTags;
  }

  async getMeetingsByTag(tagId: number, userId: string): Promise<MeetingWithTags[]> {
    const meetingsData = await db
      .select({
        meeting: meetings,
      })
      .from(meetingTags)
      .innerJoin(meetings, eq(meetingTags.meetingId, meetings.id))
      .where(and(eq(meetingTags.tagId, tagId), eq(meetings.userId, userId)))
      .orderBy(desc(meetings.createdAt));

    const meetingsWithTags: MeetingWithTags[] = [];
    
    for (const meetingData of meetingsData) {
      const meeting = meetingData.meeting;
      const meetingTagsData = await db
        .select({
          tag: tags,
        })
        .from(meetingTags)
        .innerJoin(tags, eq(meetingTags.tagId, tags.id))
        .where(eq(meetingTags.meetingId, meeting.id));

      meetingsWithTags.push({
        ...meeting,
        tags: meetingTagsData.map(mt => mt.tag),
      });
    }

    return meetingsWithTags;
  }

  async getTags(userId: string): Promise<Tag[]> {
    return await db.select().from(tags).where(eq(tags.userId, userId)).orderBy(tags.name);
  }

  async createTag(tag: InsertTag, userId: string): Promise<Tag> {
    const [newTag] = await db
      .insert(tags)
      .values({
        ...tag,
        userId
      })
      .returning();
    return newTag;
  }

  async deleteTag(id: number, userId: string): Promise<void> {
    await db.delete(meetingTags).where(eq(meetingTags.tagId, id));
    await db.delete(tags).where(and(eq(tags.id, id), eq(tags.userId, userId)));
  }

  async deleteMeeting(id: number, userId: string): Promise<void> {
    await db.delete(meetingTags).where(eq(meetingTags.meetingId, id));
    await db.delete(meetings).where(and(eq(meetings.id, id), eq(meetings.userId, userId)));
  }
}

export const storage = new DatabaseStorage();
