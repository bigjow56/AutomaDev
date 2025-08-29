import { type Contact, type InsertContact, type ChatMessage, type InsertChatMessage, contacts, chatMessages } from "@shared/schema";
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
}

// Use database storage instead of memory storage
export const storage = new DbStorage();
