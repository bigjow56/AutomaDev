import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage as dbStorage } from "./storage";
import express from "express";
import { insertContactSchema, insertChatMessageSchema, insertEventSchema, insertAdminUserSchema, insertProjectSchema } from "@shared/schema";
import { z } from "zod";
import bcrypt from "bcrypt";
import session from "express-session";
import multer from "multer";
import path from "path";
import fs from "fs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
  // JWT Configuration
  const JWT_SECRET = process.env.JWT_SECRET || crypto.randomBytes(64).toString('hex');
  const JWT_EXPIRES_IN = '24h';

  // Utility functions for JWT
  const generateToken = (adminId: string): string => {
    return jwt.sign(
      { 
        adminId, 
        type: 'admin',
        iat: Math.floor(Date.now() / 1000)
      }, 
      JWT_SECRET, 
      { expiresIn: JWT_EXPIRES_IN }
    );
  };

  const verifyToken = (token: string): { adminId: string } | null => {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as any;
      if (decoded.type === 'admin' && decoded.adminId) {
        return { adminId: decoded.adminId };
      }
      return null;
    } catch (error) {
      return null;
    }
  };
  // Ensure uploads directory exists
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }

  // Configure multer for file uploads
  const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
      // Create unique filename with timestamp
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

  const upload = multer({ 
    storage: multerStorage,
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      // Only allow image files
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Apenas arquivos de imagem são permitidos'));
      }
    }
  });

  // Serve uploaded files statically
  app.use('/uploads', express.static(uploadsDir));

  // Configure sessions for admin authentication
  app.use(session({
    secret: process.env.SESSION_SECRET || 'automadev-secret-key-2024',
    resave: false,
    saveUninitialized: false, // Only create session when needed
    name: 'sid',
    cookie: { 
      secure: false, // Set to true in production with HTTPS
      httpOnly: true, // Security: prevent XSS attacks
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: 'lax',
      path: '/'
    },
    rolling: true // Extend session on activity
  }));

  // Middleware to check if admin is authenticated (supports both sessions and JWT tokens)
  const requireAuth = (req: any, res: any, next: any) => {
    // Method 1: Check session-based authentication
    if (req.session?.isAdmin) {
      req.adminId = req.session.adminId;
      return next();
    }

    // Method 2: Check JWT token authentication
    const authHeader = req.headers.authorization;
    const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') 
      ? authHeader.slice(7) 
      : null;
    
    const tokenFromCustomHeader = req.headers['x-auth-token'];
    const token = tokenFromHeader || tokenFromCustomHeader;

    if (token) {
      const decoded = verifyToken(token);
      if (decoded) {
        req.adminId = decoded.adminId;
        return next();
      }
    }

    // Neither session nor valid token found
    res.status(401).json({ 
      success: false, 
      message: "Não autorizado",
      code: "AUTH_REQUIRED"
    });
  };

  // Initialize admin user if not exists
  const initializeAdmin = async () => {
    try {
      const existingAdmin = await dbStorage.getAdminUser('admin');
      if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        await dbStorage.createAdminUser({
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

      const admin = await dbStorage.getAdminUser(username);
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

      // Set admin properties in session
      req.session.isAdmin = true;
      req.session.adminId = admin.id;
      
      // Generate secure JWT token
      const jwtToken = generateToken(admin.id);
      
      req.session.save((saveErr: any) => {
        if (saveErr) {
          console.error('Session save error:', saveErr);
          return res.status(500).json({ 
            success: false, 
            message: "Erro ao salvar sessão" 
          });
        }
        
        res.json({ 
          success: true, 
          message: "Login realizado com sucesso",
          token: jwtToken,
          sessionId: req.sessionID,
          expiresIn: JWT_EXPIRES_IN
        });
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
    // Check session-based authentication
    let isAuthenticated = !!req.session?.isAdmin;
    let authMethod = 'none';
    let adminId = null;
    
    if (isAuthenticated) {
      authMethod = 'session';
      adminId = req.session.adminId;
    } else {
      // Check JWT token authentication
      const authHeader = req.headers.authorization;
      const tokenFromHeader = authHeader && authHeader.startsWith('Bearer ') 
        ? authHeader.slice(7) 
        : null;
      
      const tokenFromCustomHeader = req.headers['x-auth-token'];
      const token = tokenFromHeader || tokenFromCustomHeader;

      if (token) {
        const decoded = verifyToken(token);
        if (decoded) {
          isAuthenticated = true;
          authMethod = 'jwt';
          adminId = decoded.adminId;
        }
      }
    }
    
    res.json({ 
      success: true, 
      isAdmin: isAuthenticated,
      adminId: adminId,
      authMethod: authMethod,
      sessionId: req.sessionID
    });
  });

  // Events routes
  app.get("/api/events", async (req, res) => {
    try {
      const events = await dbStorage.getActiveEvents();
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
      const events = await dbStorage.getAllEvents();
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
      console.log("=== CREATE EVENT REQUEST ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      const validatedData = insertEventSchema.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      
      const event = await dbStorage.createEvent(validatedData);
      res.json({ success: true, event });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
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
      const event = await dbStorage.updateEvent(id, validatedData);
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
      const success = await dbStorage.deleteEvent(id);
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
      const contact = await dbStorage.createContact(validatedData);
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
      const contacts = await dbStorage.getAllContacts();
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
      const messages = await dbStorage.getChatMessages(sessionId);
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
      const userMessage = await dbStorage.createChatMessage(validatedData);
      console.log("User message saved:", userMessage);
      
      // Send to n8n webhook and get AI response
      const webhookUrl = process.env.N8N_WEBHOOK_URL;
      
      if (!webhookUrl) {
        console.error("N8N_WEBHOOK_URL not configured");
        const fallbackMessage = await dbStorage.createChatMessage({
          sessionId: validatedData.sessionId,
          message: "Webhook do n8n não configurado. Entre em contato via WhatsApp para suporte.",
          isUser: "false",
        });
        
        return res.json({ 
          success: true, 
          userMessage, 
          aiMessage: fallbackMessage 
        });
      }
      
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
          
          // Check if this is just the "Workflow was started" acknowledgment
          // Don't save it - wait for the real response via webhook
          let parsedResponse;
          try {
            parsedResponse = JSON.parse(aiResponse);
          } catch {
            parsedResponse = { message: aiResponse };
          }
          
          if (parsedResponse.message === "Workflow was started") {
            console.log("Skipping 'Workflow was started' message - waiting for real response via webhook");
            // Just return user message, don't save AI acknowledgment
            res.json({ 
              success: true, 
              userMessage,
              message: "Mensagem enviada! Aguardando resposta do agente..." 
            });
          } else {
            // Save actual AI response (fallback case)
            const aiMessage = await dbStorage.createChatMessage({
              sessionId: validatedData.sessionId,
              message: aiResponse || "Recebi sua mensagem, mas não consegui gerar uma resposta no momento.",
              isUser: "false",
            });
            
            res.json({ 
              success: true, 
              userMessage, 
              aiMessage 
            });
          }
        } else {
          console.error("Webhook failed with status:", response.status);
          const errorText = await response.text();
          console.error("Error response:", errorText);
          
          // Fallback response if webhook fails
          const fallbackMessage = await dbStorage.createChatMessage({
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
        const fallbackMessage = await dbStorage.createChatMessage({
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

  // Webhook endpoint for n8n to send async AI responses
  app.post("/api/webhook/n8n", async (req, res) => {
    try {
      console.log("=== N8N WEBHOOK CALLED ===");
      console.log("Request body:", req.body);

      const { sessionId, message, type = 'ai_response' } = req.body;

      if (!sessionId || !message) {
        return res.status(400).json({
          success: false,
          message: "sessionId and message are required"
        });
      }

      // Save the AI response to the database
      const aiMessage = await dbStorage.createChatMessage({
        sessionId,
        message,
        isUser: "false",
      });

      console.log("AI message saved:", aiMessage);

      // Get the WebSocket server and broadcasting function from app
      const broadcastToSession = (app as any).broadcastToSession;
      
      if (broadcastToSession) {
        // Broadcast the new message to all clients in this session
        broadcastToSession(sessionId, {
          type: 'new_message',
          message: aiMessage,
          timestamp: new Date().toISOString()
        });
        
        console.log(`Broadcasted AI response to session: ${sessionId}`);
      } else {
        console.warn("Broadcasting function not available");
      }

      res.json({ 
        success: true, 
        message: "AI response processed and broadcasted",
        aiMessage 
      });

    } catch (error) {
      console.error("Error in n8n webhook:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error"
      });
    }
  });

  // Projects routes
  app.get("/api/projects", async (req, res) => {
    try {
      const projects = await dbStorage.getActiveProjects();
      res.json({ success: true, projects });
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  app.get("/api/admin/projects", requireAuth, async (req, res) => {
    try {
      const projects = await dbStorage.getAllProjects();
      res.json({ success: true, projects });
    } catch (error) {
      console.error("Error fetching all projects:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  app.post("/api/admin/projects", requireAuth, async (req, res) => {
    try {
      console.log("=== CREATE PROJECT REQUEST ===");
      console.log("Request body:", JSON.stringify(req.body, null, 2));
      
      const validatedData = insertProjectSchema.parse(req.body);
      console.log("Validated data:", JSON.stringify(validatedData, null, 2));
      
      const project = await dbStorage.createProject(validatedData);
      res.json({ success: true, project });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.errors);
        res.status(400).json({ 
          success: false, 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Error creating project:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erro interno do servidor" 
        });
      }
    }
  });

  app.put("/api/admin/projects/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProjectSchema.partial().parse(req.body);
      const project = await dbStorage.updateProject(id, validatedData);
      res.json({ success: true, project });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ 
          success: false, 
          message: "Dados inválidos", 
          errors: error.errors 
        });
      } else {
        console.error("Error updating project:", error);
        res.status(500).json({ 
          success: false, 
          message: "Erro interno do servidor" 
        });
      }
    }
  });

  app.delete("/api/admin/projects/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const success = await dbStorage.deleteProject(id);
      if (success) {
        res.json({ success: true, message: "Projeto excluído com sucesso" });
      } else {
        res.status(404).json({ success: false, message: "Projeto não encontrado" });
      }
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  // Image upload route for projects
  app.post("/api/admin/upload", requireAuth, upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "Nenhuma imagem foi enviada" 
        });
      }

      const imageUrl = `/uploads/${req.file.filename}`;
      res.json({ 
        success: true, 
        imageUrl: imageUrl,
        message: "Imagem enviada com sucesso" 
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  // Webhook endpoint for n8n to send responses back (asynchronous)
  app.post("/api/webhook/n8n-response", async (req, res) => {
    try {
      console.log("=== N8N WEBHOOK RESPONSE ===");
      console.log("Request body:", req.body);
      
      const { sessionId, message, messageId } = req.body;
      
      if (!sessionId || !message) {
        return res.status(400).json({ 
          success: false, 
          message: "sessionId e message são obrigatórios" 
        });
      }
      
      // Save AI response from n8n
      const aiMessage = await dbStorage.createChatMessage({
        sessionId: sessionId,
        message: message,
        isUser: "false",
      });
      
      console.log("AI response saved:", aiMessage);
      
      // Broadcast to WebSocket clients for real-time updates
      const wss = (req as any).app?.wss;
      if (wss) {
        wss.clients.forEach((client: any) => {
          if (client.readyState === 1 && client.sessionId === sessionId) { // WebSocket.OPEN = 1
            client.send(JSON.stringify({
              type: 'new_message',
              message: aiMessage
            }));
          }
        });
      }
      
      res.json({ 
        success: true, 
        message: "Resposta recebida com sucesso",
        aiMessage: aiMessage
      });
    } catch (error) {
      console.error("Error processing n8n webhook response:", error);
      res.status(500).json({ 
        success: false, 
        message: "Erro interno do servidor" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
