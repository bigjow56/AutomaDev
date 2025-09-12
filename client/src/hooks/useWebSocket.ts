import { useEffect, useRef, useCallback, useState } from 'react';

interface WebSocketMessage {
  type: string;
  message?: any;
  sessionId?: string;
}

interface UseWebSocketOptions {
  sessionId: string;
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: Event) => void;
}

export function useWebSocket({ 
  sessionId, 
  onMessage, 
  onConnect, 
  onDisconnect, 
  onError 
}: UseWebSocketOptions) {
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;
  const reconnectDelay = 3000; // 3 seconds

  const [connectionState, setConnectionState] = useState<'connecting' | 'connected' | 'disconnected' | 'error'>('disconnected');
  const isMountedRef = useRef(true);
  
  const connect = useCallback(() => {
    try {
      // Get WebSocket URL with dedicated /ws path
      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}/ws`;
      
      console.log('Connecting to WebSocket:', wsUrl);
      setConnectionState('connecting');
      ws.current = new WebSocket(wsUrl);

      ws.current.onopen = () => {
        console.log('WebSocket connected');
        reconnectAttempts.current = 0;
        
        if (isMountedRef.current) {
          setConnectionState('connected');
        }
        
        // Join session immediately after connection
        if (ws.current && sessionId) {
          ws.current.send(JSON.stringify({
            type: 'join_session',
            sessionId: sessionId
          }));
        }
        
        onConnect?.();
      };

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('WebSocket message received:', data);
          onMessage?.(data);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.current.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason);
        ws.current = null;
        
        if (isMountedRef.current) {
          setConnectionState('disconnected');
        }
        
        onDisconnect?.();
        
        // Attempt to reconnect if not a clean close and component is still mounted
        if (event.code !== 1000 && reconnectAttempts.current < maxReconnectAttempts && isMountedRef.current) {
          reconnectAttempts.current++;
          console.log(`Attempting to reconnect... (${reconnectAttempts.current}/${maxReconnectAttempts})`);
          
          if (isMountedRef.current) {
            setConnectionState('connecting');
          }
          
          reconnectTimeoutRef.current = setTimeout(() => {
            if (isMountedRef.current) {
              connect();
            }
          }, reconnectDelay);
        }
      };

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        
        if (isMountedRef.current) {
          setConnectionState('error');
        }
        
        onError?.(error);
      };

    } catch (error) {
      console.error('Failed to create WebSocket connection:', error);
      
      if (isMountedRef.current) {
        setConnectionState('error');
      }
    }
  }, [sessionId, onMessage, onConnect, onDisconnect, onError]);

  const disconnect = useCallback(() => {
    isMountedRef.current = false;
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    if (ws.current) {
      ws.current.close(1000, 'Component unmounting');
      ws.current = null;
    }
    
    setConnectionState('disconnected');
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify(message));
    } else {
      console.warn('WebSocket is not connected, cannot send message:', message);
    }
  }, []);

  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    sendMessage,
    disconnect,
    isConnected: connectionState === 'connected',
    connectionState,
    isConnecting: connectionState === 'connecting'
  };
}