import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertChatMessageSchema, insertEventSchema, insertAdminUserSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure sessions for admin authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  }));

  // Middleware to check if admin is authenticated
  const requireAuth = (req: any, res: any, next: any) => {
    if (req.session?.isAdmin) {
      next();
    } else {
      res.status(401).json({ success: false, message: "Não autorizado" });
    }
  };

  // Initialize admin user if not exists
  const initializeAdmin = async () => {
    try {
      const existingAdmin = await storage.getAdminUser('admin');
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        await storage.createAdminUser({
          username: 'admin',
          password: hashedPassword
        });
        console.log('Admin user created: admin/123456');
      }
    } catch (error) {
      console.error('Error initializing admin user:', error);
    }
  };
  
  await initializeAdmin();

  // Admin authentication routes
  app.post("/api/admin/login", async (req: any, res) => {
    try {
      const { username, password } = req.body;
      
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: "Usuário e senha são obrigatórios" 
        });
      }

      const admin = await storage.getAdminUser(username);
      if (!admin) {
        return res.status(401).json({ 
          success: false, 
          message: "Credenciais inválidas" 
        });
      }

      const isValidPassword = await bcrypt.compare(password, admin.password);
      if (!isValidPassword) {
        return res.status(401).json({ 
          success: false, 
          message: "Credenciais inválidas" 
        });
      }

      req.session.isAdmin = true;
      req.session.adminId = admin.id;
      
      res.json({ 
        success: true, 
        message: "Login realizado com sucesso" 
      });
    } catch (error) {
      console.error("Error in admin login:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  app.post("/api/admin/logout", (req: any, res) => {
    req.session.destroy((err: any) => {
      if (err) {
        return res.status(500).json({ success: false, message: "Erro ao fazer logout" });
      }
      res.json({ success: true, message: "Logout realizado com sucesso" });
    });
  });

  app.get("/api/admin/check", (req: any, res) => {
    res.json({ 
      success: true, 
      isAdmin: !!req.session?.isAdmin 
    });
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await storage.getActiveEvents();
      res.json({ success: true, events });
    } catch (error) {
      console.error("Error fetching events:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  app.get("/api/admin/events", requireAuth, async (req, res) => {
    try {
      const events = await storage.getAllEvents();
      res.json({ success: true, events });
    } catch (error) {
      console.error("Error fetching all events:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  app.post("/api/admin/events", requireAuth, async (req, res) => {
    try {
      const validatedData = insertEventSchema.parse(req.body);
      const event = await storage.createEvent(validatedData);
      res.json({ success: true, event });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating event:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erro interno do servidor" 
        });
      }
    }
  });

  app.put("/api/admin/events/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertEventSchema.partial().parse(req.body);
      const event = await storage.updateEvent(id, validatedData);
      res.json({ success: true, event });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Error updating event:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erro interno do servidor" 
        });
      }
    }
  });

  app.delete("/api/admin/events/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteEvent(id);
      if (success) {
        res.json({ success: true, message: "Evento excluído com sucesso" });
      } else {
        res.status(404).json({ success: false, message: "Evento não encontrado" });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });
  // Contact form submission
  app.post("/api/contacts", async (req, res) => {
    try {
      const validatedData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(validatedData);
      res.json({ success: true, contact });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating contact:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erro interno do servidor" 
        });
      }
    }
  });

  // Get all contacts (for admin purposes if needed)
  app.get("/api/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json({ success: true, contacts });
    } catch (error) {
      console.error("Error fetching contacts:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  // Chat routes
  app.get("/api/chat/:sessionId", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json({ success: true, messages });
    } catch (error) {
      console.error("Error fetching chat messages:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      console.log("=== CHAT API CALLED ===");
      console.log("Request body:", req.body);
      
      const validatedData = insertChatMessageSchema.parse(req.body);
      console.log("Validated data:", validatedData);
      
      // Save user message
      const userMessage = await storage.createChatMessage(validatedData);
      console.log("User message saved:", userMessage);
      
      // Send to n8n webhook and get AI response
      const webhookUrl = "https://n8n-curso-n8n.yao8ay.easypanel.host/webhook-test/AutomaDev";
      
      try {
        console.log("Sending message to n8n webhook:", webhookUrl);
        console.log("Payload:", { message: validatedData.message, sessionId: validatedData.sessionId });
        
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: validatedData.message,
            sessionId: validatedData.sessionId,
          }),
        });

        console.log("Webhook response status:", response.status);
        console.log("Webhook response ok:", response.ok);

        if (response.ok) {
          const aiResponse = await response.text();
          console.log("AI Response from n8n:", aiResponse);
          
          // Save AI response
          const aiMessage = await storage.createChatMessage({
            sessionId: validatedData.sessionId,
            message: aiResponse || "Recebi sua mensagem, mas não consegui gerar uma resposta no momento.",
            isUser: "false",
          });
          
          res.json({ 
            success: true, 
            userMessage, 
            aiMessage 
          });
        } else {
          console.error("Webhook failed with status:", response.status);
          const errorText = await response.text();
          console.error("Error response:", errorText);
          
          // Fallback response if webhook fails
          const fallbackMessage = await storage.createChatMessage({
            sessionId: validatedData.sessionId,
            message: `Erro no webhook (${response.status}). Tente novamente ou entre em contato via WhatsApp.`,
            isUser: "false",
          });
          
          res.json({ 
            success: true, 
            userMessage, 
            aiMessage: fallbackMessage 
          });
        }
      } catch (fetchError) {
        console.error("Error calling n8n webhook:", fetchError);
        
        // Fallback response
        const fallbackMessage = await storage.createChatMessage({
          sessionId: validatedData.sessionId,
          message: `Erro de conexão com o webhook: ${fetchError instanceof Error ? fetchError.message : 'Erro desconhecido'}. Tente novamente ou entre em contato via WhatsApp.`,
          isUser: "false",
        });
        
        res.json({ 
          success: true, 
          userMessage, 
          aiMessage: fallbackMessage 
        });
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Error in chat:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erro interno do servidor" 
        });
      }
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
