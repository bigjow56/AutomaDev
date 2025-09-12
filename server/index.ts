import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { WebSocketServer } from "ws";
import { parse } from "url";

const app = express();

// Configure CORS specifically for Replit environment
app.use((req, res, next) => {
  // Allow all origins for Replit compatibility
  res.header('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS,HEAD');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, Cookie');
  res.header('Access-Control-Expose-Headers', 'Set-Cookie');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // Setup WebSocket server with dedicated path /ws to avoid Vite HMR conflicts
  const wss = new WebSocketServer({
    server,
    path: '/ws',
    perMessageDeflate: false // Disable compression for better performance
  });
  
  // Store connected clients organized by session ID
  const sessionClients = new Map<string, Set<any>>();
  
  // Broadcast message to all clients in a specific session
  const broadcastToSession = (sessionId: string, message: any) => {
    const clients = sessionClients.get(sessionId);
    if (clients) {
      const messageStr = JSON.stringify(message);
      clients.forEach((ws) => {
        if (ws.readyState === ws.OPEN) {
          try {
            ws.send(messageStr);
            console.log(`Broadcasted message to session ${sessionId}:`, message);
          } catch (error) {
            console.error('Error broadcasting message:', error);
            // Remove dead connection
            clients.delete(ws);
          }
        } else {
          // Remove dead connection
          clients.delete(ws);
        }
      });
      
      // Clean up empty session
      if (clients.size === 0) {
        sessionClients.delete(sessionId);
      }
    }
  };
  
  wss.on('connection', (ws, req) => {
    const { pathname } = parse(req.url || '', true);
    console.log('WebSocket client connected to:', pathname, 'from:', req.socket.remoteAddress);
    
    // Track connection state
    let clientSessionId: string | null = null;
    
    ws.on('message', (message) => {
      try {
        const data = JSON.parse(message.toString());
        console.log('WebSocket message received:', data);
        
        if (data.type === 'join_session' && data.sessionId) {
          clientSessionId = data.sessionId;
          
          // Add client to session
          if (!sessionClients.has(clientSessionId)) {
            sessionClients.set(clientSessionId, new Set());
          }
          sessionClients.get(clientSessionId)!.add(ws);
          
          console.log(`Client joined session: ${clientSessionId}. Total sessions: ${sessionClients.size}`);
          
          // Send confirmation
          ws.send(JSON.stringify({
            type: 'session_joined',
            sessionId: clientSessionId,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
      
      // Remove client from session
      if (clientSessionId) {
        const clients = sessionClients.get(clientSessionId);
        if (clients) {
          clients.delete(ws);
          if (clients.size === 0) {
            sessionClients.delete(clientSessionId);
          }
          console.log(`Client left session: ${clientSessionId}. Remaining sessions: ${sessionClients.size}`);
        }
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      
      // Remove client from session on error
      if (clientSessionId) {
        const clients = sessionClients.get(clientSessionId);
        if (clients) {
          clients.delete(ws);
        }
      }
    });
  });

  // Make WebSocket server and broadcasting function available to routes
  (app as any).wss = wss;
  (app as any).broadcastToSession = broadcastToSession;

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
    log(`WebSocket server running on /ws`);
  });
})();
