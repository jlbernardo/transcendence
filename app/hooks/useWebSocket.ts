"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { ClientMessage, ServerMessage } from "@/types/game";

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

type MessageHandler = (message: ServerMessage) => void;

interface UseWebSocketReturn {
  status: ConnectionStatus;
  send: (message: ClientMessage) => void;
  subscribe: (handler: MessageHandler) => () => void;
  error: string | null;
}

export function useWebSocket(url: string): UseWebSocketReturn {
  const [status, setStatus] = useState<ConnectionStatus>("connecting");
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const handlersRef = useRef<Set<MessageHandler>>(new Set());
  const urlRef = useRef(url);

  useEffect(() => {
    urlRef.current = url;
  }, [url]);

  useEffect(() => {
    let isMounted = true;

    const connect = () => {
      // Do not create a new connection if one already exists and is open/connecting
      if (
        wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING
      ) {
        return;
      }

      try {
        console.log("Creating new WebSocket connection to:", urlRef.current);
        const ws = new WebSocket(urlRef.current);
        wsRef.current = ws;

        ws.onopen = () => {
          if (!isMounted) return;
          console.log("WebSocket connected");
          setStatus("connected");
          setError(null);
        };

        ws.onmessage = (event) => {
          if (!isMounted) return;
          try {
            const message: ServerMessage = JSON.parse(event.data);
            console.log("Received message:", message.type);
            // Call all registered handlers
            handlersRef.current.forEach((handler) => handler(message));
          } catch (e) {
            console.error("Failed to parse message:", e);
          }
        };

        ws.onclose = (event) => {
          if (!isMounted) return;
          console.log("WebSocket disconnected, code:", event.code);
          setStatus("disconnected");
          wsRef.current = null;

          // Only reconnects on abnormal closure
          if (event.code !== 1000) {
            reconnectTimeoutRef.current = setTimeout(() => {
              if (isMounted) {
                console.log("Attempting to reconnect...");
                setStatus("connecting");
                connect();
              }
            }, 3000);
          }
        };

        ws.onerror = () => {
          if (!isMounted) return;
          console.error("WebSocket error");
          setStatus("error");
          setError("Connection error");
        };
      } catch (e) {
        if (!isMounted) return;
        console.error("Failed to create WebSocket:", e);
        setStatus("error");
        setError("Failed to connect");
      }
    };

    connect();

    return () => {
      isMounted = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close(1000, "Component unmounting");
        wsRef.current = null;
      }
    };
  }, []); // Empty dependency array, so it only runs once on mount

  const send = useCallback((message: ClientMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      console.log("Sending message:", message.type);
      wsRef.current.send(JSON.stringify(message));
    } else {
      console.warn(
        "WebSocket is not connected, readyState:",
        wsRef.current?.readyState
      );
    }
  }, []);

  const subscribe = useCallback((handler: MessageHandler) => {
    handlersRef.current.add(handler);
    return () => {
      handlersRef.current.delete(handler);
    };
  }, []);

  return { status, send, subscribe, error };
}
