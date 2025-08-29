import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertContactSchema, insertChatMessageSchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const validatedData = insertChatMessageSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createChatMessage(validatedData);
      
      // Send to n8n webhook and get AI response
      const webhookUrl = "https://n8n-curso-n8n.yao8ay.easypanel.host/webhook-test/14c61ddf-9057-4879-b86d-96a7ca14b2aa";
      
      try {
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

        if (response.ok) {
          const aiResponse = await response.text();
          
          // Save AI response
          const aiMessage = await storage.createChatMessage({
            sessionId: validatedData.sessionId,
            message: aiResponse,
            isUser: "false",
          });
          
          res.json({ 
            success: true, 
            userMessage, 
            aiMessage 
          });
        } else {
          // Fallback response if webhook fails
          const fallbackMessage = await storage.createChatMessage({
            sessionId: validatedData.sessionId,
            message: "Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes ou entre em contato via WhatsApp.",
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
          message: "Desculpe, estou com dificuldades técnicas no momento. Tente novamente em alguns instantes ou entre em contato via WhatsApp.",
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
