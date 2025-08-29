import { 
  type Contact, type InsertContact, 
  type ChatMessage, type InsertChatMessage,
  type Event, type InsertEvent,
  type AdminUser, type InsertAdminUser,
  contacts, chatMessages, events, adminUsers
} from "@shared/schema";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import { eq, desc } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  getContact(id: string): Promise<Contact | undefined>;
  getAllContacts(): Promise<Contact[]>;
  createContact(contact: InsertContact): Promise<Contact>;
  
  // Chat methods
  getChatMessages(sessionId: string): Promise<ChatMessage[]>;
  createChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  
  // Events methods
  getAllEvents(): Promise<Event[]>;
  getActiveEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: string, event: Partial<InsertEvent>): Promise<Event>;
  deleteEvent(id: string): Promise<boolean>;
  
  // Admin methods
  getAdminUser(username: string): Promise<AdminUser | undefined>;
  createAdminUser(user: InsertAdminUser): Promise<AdminUser>;
}


// Database storage using Drizzle ORM and PostgreSQL
export class DbStorage implements IStorage {
  private db;

  constructor() {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is required");
    }
    const sql = neon(process.env.DATABASE_URL);
    this.db = drizzle(sql);
  }

  async getContact(id: string): Promise<Contact | undefined> {
    const result = await this.db
      .select()
      .from(contacts)
      .where(eq(contacts.id, id))
      .limit(1);
    return result[0];
  }

  async getAllContacts(): Promise<Contact[]> {
    return await this.db
      .select()
      .from(contacts)
      .orderBy(desc(contacts.createdAt));
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const result = await this.db
      .insert(contacts)
      .values(insertContact)
      .returning();
    return result[0];
  }

  async getChatMessages(sessionId: string): Promise<ChatMessage[]> {
    return await this.db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.sessionId, sessionId))
      .orderBy(chatMessages.timestamp);
  }

  async createChatMessage(insertMessage: InsertChatMessage): Promise<ChatMessage> {
    const result = await this.db
      .insert(chatMessages)
      .values(insertMessage)
      .returning();
    return result[0];
  }

  // Events methods
  async getAllEvents(): Promise<Event[]> {
    return await this.db
      .select()
      .from(events)
      .orderBy(desc(events.createdAt));
  }

  async getActiveEvents(): Promise<Event[]> {
    return await this.db
      .select()
      .from(events)
      .where(eq(events.isActive, "true"))
      .orderBy(desc(events.createdAt));
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const result = await this.db
      .select()
      .from(events)
      .where(eq(events.id, id))
      .limit(1);
    return result[0];
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    // Clean up empty strings and convert to null/undefined
    const cleanedEvent = {
      ...insertEvent,
      subtitle: insertEvent.subtitle === "" ? null : insertEvent.subtitle,
      description: insertEvent.description === "" ? null : insertEvent.description,
      endDate: insertEvent.endDate === "" ? null : new Date(insertEvent.endDate!),
    };
    
    // Only set endDate if it's not empty
    if (insertEvent.endDate && insertEvent.endDate !== "") {
      cleanedEvent.endDate = new Date(insertEvent.endDate);
    } else {
      cleanedEvent.endDate = null;
    }
    
    console.log("=== STORAGE CREATE EVENT ===");
    console.log("Original data:", insertEvent);
    console.log("Cleaned data:", cleanedEvent);
    
    const result = await this.db
      .insert(events)
      .values(cleanedEvent)
      .returning();
    return result[0];
  }

  async updateEvent(id: string, eventData: Partial<InsertEvent>): Promise<Event> {
    const result = await this.db
      .update(events)
      .set({ ...eventData, updatedAt: new Date() })
      .where(eq(events.id, id))
      .returning();
    return result[0];
  }

  async deleteEvent(id: string): Promise<boolean> {
    const result = await this.db
      .delete(events)
      .where(eq(events.id, id))
      .returning();
    return result.length > 0;
  }

  // Admin methods
  async getAdminUser(username: string): Promise<AdminUser | undefined> {
    const result = await this.db
      .select()
      .from(adminUsers)
      .where(eq(adminUsers.username, username))
      .limit(1);
    return result[0];
  }

  async createAdminUser(insertUser: InsertAdminUser): Promise<AdminUser> {
    const result = await this.db
      .insert(adminUsers)
      .values(insertUser)
      .returning();
    return result[0];
  }
}

// Use database storage instead of memory storage
export const storage = new DbStorage();
