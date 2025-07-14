import { meetings, tags, meetingTags, type Meeting, type Tag, type InsertMeeting, type InsertTag, type MeetingAnalysis } from "@shared/schema";
import { db } from "./db";
import { eq, desc, like, or } from "drizzle-orm";

// User types for future implementation
interface User {
  id: number;
  username: string;
}

interface InsertUser {
  username: string;
}

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
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Memory Bank methods
  saveMeeting(data: SaveMeetingData): Promise<Meeting>;
  getMeetings(limit?: number, offset?: number): Promise<MeetingWithTags[]>;
  getMeetingById(id: number): Promise<MeetingWithTags | undefined>;
  searchMeetings(query: string): Promise<MeetingWithTags[]>;
  getMeetingsByCategory(category: string): Promise<MeetingWithTags[]>;
  getMeetingsByTag(tagId: number): Promise<MeetingWithTags[]>;
  
  getTags(): Promise<Tag[]>;
  createTag(tag: InsertTag): Promise<Tag>;
  deleteTag(id: number): Promise<void>;
  
  deleteMeeting(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    // User implementation for future use
    return undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    // User implementation for future use
    return undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // User implementation for future use
    throw new Error("User creation not implemented");
  }

  async saveMeeting(data: SaveMeetingData): Promise<Meeting> {
    // Create new tags if provided
    const createdTags: Tag[] = [];
    if (data.newTags && data.newTags.length > 0) {
      for (const newTag of data.newTags) {
        const [tag] = await db
          .insert(tags)
          .values(newTag)
          .returning();
        createdTags.push(tag);
      }
    }

    // Create the meeting
    const [meeting] = await db
      .insert(meetings)
      .values({
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

  async getMeetings(limit: number = 20, offset: number = 0): Promise<MeetingWithTags[]> {
    const meetingsData = await db
      .select()
      .from(meetings)
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

  async getMeetingById(id: number): Promise<MeetingWithTags | undefined> {
    const [meeting] = await db
      .select()
      .from(meetings)
      .where(eq(meetings.id, id));

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

  async searchMeetings(query: string): Promise<MeetingWithTags[]> {
    const meetingsData = await db
      .select()
      .from(meetings)
      .where(
        or(
          like(meetings.title, `%${query}%`),
          like(meetings.transcript, `%${query}%`),
          like(meetings.topic, `%${query}%`),
          like(meetings.category, `%${query}%`)
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

  async getMeetingsByCategory(category: string): Promise<MeetingWithTags[]> {
    const meetingsData = await db
      .select()
      .from(meetings)
      .where(eq(meetings.category, category))
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

  async getMeetingsByTag(tagId: number): Promise<MeetingWithTags[]> {
    const meetingsData = await db
      .select({
        meeting: meetings,
      })
      .from(meetingTags)
      .innerJoin(meetings, eq(meetingTags.meetingId, meetings.id))
      .where(eq(meetingTags.tagId, tagId))
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

  async getTags(): Promise<Tag[]> {
    return await db.select().from(tags).orderBy(tags.name);
  }

  async createTag(tag: InsertTag): Promise<Tag> {
    const [newTag] = await db
      .insert(tags)
      .values(tag)
      .returning();
    return newTag;
  }

  async deleteTag(id: number): Promise<void> {
    await db.delete(meetingTags).where(eq(meetingTags.tagId, id));
    await db.delete(tags).where(eq(tags.id, id));
  }

  async deleteMeeting(id: number): Promise<void> {
    await db.delete(meetingTags).where(eq(meetingTags.meetingId, id));
    await db.delete(meetings).where(eq(meetings.id, id));
  }
}

export const storage = new DatabaseStorage();
