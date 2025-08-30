import { 
  type Contact, type InsertContact, 
  type ChatMessage, type InsertChatMessage,
  type Event, type InsertEvent,
  type AdminUser, type InsertAdminUser,
  type Project, type InsertProject,
  contacts, chatMessages, events, adminUsers, projects
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

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
  
  // Projects methods
  getAllProjects(): Promise<Project[]>;
  getActiveProjects(): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  updateProject(id: string, project: Partial<InsertProject>): Promise<Project>;
  deleteProject(id: string): Promise<boolean>;
}


// Database storage using Drizzle ORM and PostgreSQL
export class DbStorage implements IStorage {
  private db = db;

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
    const cleanedEvent: any = {
      title: insertEvent.title,
      isActive: insertEvent.isActive || "false",
      subtitle: insertEvent.subtitle === "" ? null : insertEvent.subtitle,
      description: insertEvent.description === "" ? null : insertEvent.description,
      endDate: null,
    };
    
    // Only set endDate if it's not empty
    if (insertEvent.endDate && insertEvent.endDate !== "") {
      cleanedEvent.endDate = new Date(insertEvent.endDate);
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
    // Clean up the update data similar to create
    const cleanedEventData: any = {
      ...eventData,
      updatedAt: new Date(),
    };
    
    // Handle endDate conversion
    if (eventData.endDate !== undefined) {
      if (eventData.endDate === "" || !eventData.endDate) {
        cleanedEventData.endDate = null;
      } else {
        cleanedEventData.endDate = new Date(eventData.endDate);
      }
    }
    
    // Handle empty strings for optional fields
    if (eventData.subtitle === "") cleanedEventData.subtitle = null;
    if (eventData.description === "") cleanedEventData.description = null;
    
    const result = await this.db
      .update(events)
      .set(cleanedEventData)
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

  // Projects methods
  async getAllProjects(): Promise<Project[]> {
    return await this.db
      .select()
      .from(projects)
      .orderBy(projects.sortOrder, desc(projects.createdAt));
  }

  async getActiveProjects(): Promise<Project[]> {
    return await this.db
      .select()
      .from(projects)
      .where(eq(projects.isActive, "true"))
      .orderBy(projects.sortOrder, desc(projects.createdAt));
  }

  async getProject(id: string): Promise<Project | undefined> {
    const result = await this.db
      .select()
      .from(projects)
      .where(eq(projects.id, id))
      .limit(1);
    return result[0];
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const cleanedProject: any = {
      title: insertProject.title,
      description: insertProject.description,
      category: insertProject.category,
      categoryColor: insertProject.categoryColor || "bg-primary",
      icon: insertProject.icon || "Building",
      tags: insertProject.tags,
      metric: insertProject.metric,
      images: insertProject.images || "[]",
      isActive: insertProject.isActive || "true",
      sortOrder: insertProject.sortOrder || "0",
    };
    
    const result = await this.db
      .insert(projects)
      .values(cleanedProject)
      .returning();
    return result[0];
  }

  async updateProject(id: string, projectData: Partial<InsertProject>): Promise<Project> {
    const cleanedProjectData: any = {
      ...projectData,
      updatedAt: new Date(),
    };
    
    // Handle empty strings for optional fields
    if (projectData.images === "") cleanedProjectData.images = "[]";
    if (projectData.categoryColor === "") cleanedProjectData.categoryColor = "bg-primary";
    if (projectData.icon === "") cleanedProjectData.icon = "Building";
    if (projectData.sortOrder === "") cleanedProjectData.sortOrder = "0";
    
    const result = await this.db
      .update(projects)
      .set(cleanedProjectData)
      .where(eq(projects.id, id))
      .returning();
    return result[0];
  }

  async deleteProject(id: string): Promise<boolean> {
    const result = await this.db
      .delete(projects)
      .where(eq(projects.id, id))
      .returning();
    return result.length > 0;
  }
}

// Use database storage instead of memory storage
export const storage = new DbStorage();
