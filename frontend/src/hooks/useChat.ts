import { useState, useCallback, useRef } from "react";
import type { ChatMessage } from "../types";
import { api } from "../api/client";

const SESSION_KEY = "portfolio_chat_session";

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm an AI assistant for this portfolio. Ask me about the projects, skills, or experience you see here.",
      timestamp: Date.now(),
    },
  ]);
  const [sending, setSending] = useState(false);
  const sessionId = useRef(getSessionId());

  const sendMessage = useCallback(async (text: string) => {
    setSending(true);

    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      timestamp: Date.now(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const res = await api.sendChat({
        session_id: sessionId.current,
        message: text,
      });

      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.reply,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch {
      const errMsg: ChatMessage = {
        role: "assistant",
        content: "Sorry, I couldn't reach the AI service. Please try again.",
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setSending(false);
    }
  }, []);

  return { messages, sending, sendMessage };
}

export function resetSession() {
  localStorage.removeItem(SESSION_KEY);
}
