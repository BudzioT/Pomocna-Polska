"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DbMessage, DbHelpRequest } from "@/types";

const POLL_INTERVAL_MS = 3000;

interface ChatPageProps {
  params: Promise<{ id: string }>;
}

export default function ChatPage({ params }: ChatPageProps) {
  const router = useRouter();
  const [conversationId, setConversationId] = useState<string>("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<DbMessage[]>([]);
  const [conversation, setConversation] = useState<any | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setCurrentUserId(localStorage.getItem("user_id"));
  }, []);

  // Resolve params
  useEffect(() => {
    params.then(({ id }) => setConversationId(id));
  }, [params]);

  // Determine who the chat partner is
  const chatPartner = conversation
    ? conversation.request.authorId === currentUserId
      ? conversation.volunteer
      : conversation.request.author
    : null;

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Fetch conversation details
  const fetchConversation = useCallback(async () => {
    if (!conversationId || !currentUserId) return;
    try {
      const res = await fetch(`/api/conversations/${conversationId}`);
      if (!res.ok) throw new Error("Conversation not found");
      const data = await res.json();

      // Guard: current user must be author or volunteer
      if (data.request.authorId !== currentUserId && data.volunteerId !== currentUserId) {
        router.push("/feed");
        return;
      }

      setConversation(data);
    } catch {
      setError("Nie udało się załadować konwersacji");
    }
  }, [conversationId, router, currentUserId]);

  // Fetch messages
  const fetchMessages = useCallback(async () => {
    if (!conversationId) return;
    try {
      const res = await fetch(`/api/messages?conversationId=${conversationId}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data: DbMessage[] = await res.json();
      setMessages(data);
    } catch {
      console.error("Failed to fetch messages");
    }
  }, [conversationId]);

  // Initial load
  useEffect(() => {
    if (!conversationId || !currentUserId) return;

    const init = async () => {
      setLoading(true);
      await fetchConversation();
      await fetchMessages();
      setLoading(false);
    };

    init();
  }, [conversationId, currentUserId, fetchConversation, fetchMessages]);

  // Polling for new messages
  useEffect(() => {
    if (!conversationId || loading) return;

    pollRef.current = setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [conversationId, loading, fetchMessages]);

  // Send a message
  const handleSend = async () => {
    if (!currentUserId) return;
    const text = input.trim();
    if (!text || sending) return;

    setSending(true);

    // Optimistic update
    const optimisticMsg: DbMessage = {
      id: `temp-${Date.now()}`,
      body: text,
      createdAt: new Date().toISOString(),
      senderId: currentUserId,
      conversationId: conversationId,
      sender: {
        id: currentUserId,
        name: "Ty",
        avatarUrl: null,
      },
    } as any;

    setMessages((prev) => [...prev, optimisticMsg]);
    setInput("");

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          senderId: currentUserId,
          body: text,
        }),
      });

      if (!res.ok) throw new Error("Failed to send");
      const savedMsg: DbMessage = await res.json();

      // Replace optimistic entry with real one
      setMessages((prev) =>
        prev.map((m) => (m.id === optimisticMsg.id ? savedMsg : m))
      );
    } catch {
      // Remove optimistic entry on failure
      setMessages((prev) => prev.filter((m) => m.id !== optimisticMsg.id));
      setInput(text); // Restore input
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-on-surface-variant font-medium">Ładowanie czatu...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface px-6 text-center">
        <span className="material-symbols-outlined text-6xl text-on-surface-variant mb-4">
          error_outline
        </span>
        <h2 className="text-2xl font-bold text-on-surface mb-2">{error}</h2>
        <Link
          href="/feed"
          className="mt-6 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold"
        >
          Wróć do listy
        </Link>
      </div>
    );
  }

  return (
    <div className="text-on-surface min-h-screen flex flex-col w-full max-w-[390px] md:max-w-full mx-auto bg-surface relative">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 flex justify-between items-center px-4 py-3 bg-[#FBFBE2]/90 backdrop-blur-md shadow-sm w-full max-w-[390px] md:max-w-full">
        <div className="flex items-center gap-3">
          <Link
            href="/profile"
            className="p-2 -ml-2 hover:bg-surface-container transition-colors rounded-full active:scale-95 duration-150"
          >
            <span className="material-symbols-outlined text-on-surface">
              arrow_back
            </span>
          </Link>
          <div className="flex items-center gap-3">
            <div className="relative">
              {chatPartner?.avatarUrl && (
                <Image
                  alt="Zdjęcie rozmówcy"
                  className="w-10 h-10 rounded-full border-2 border-primary/10"
                  src={chatPartner.avatarUrl}
                  width={40}
                  height={40}
                />
              )}
              {!chatPartner?.avatarUrl && (
                <div className="w-10 h-10 rounded-full border-2 border-primary/10 bg-primary-fixed flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary">
                    person
                  </span>
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-on-surface tracking-tight leading-tight">
                  {chatPartner?.name ?? "Rozmówca"}
                </span>
                {conversation?.request?.type === "REMOTE" && currentUserId === conversation?.volunteerId && chatPartner?.phoneNumber && (
                  <a href={`tel:${chatPartner.phoneNumber}`} className="flex items-center gap-1 text-[11px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full hover:bg-primary/20 transition-colors border border-primary/20">
                    <span className="material-symbols-outlined text-[12px]">call</span>
                    {chatPartner.phoneNumber}
                  </a>
                )}
              </div>
              {conversation && (
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary truncate max-w-[180px]">
                  {conversation.request.title}
                </span>
              )}
            </div>
          </div>
        </div>
        {conversation?.request?.status !== "COMPLETED" && currentUserId === conversation?.request?.authorId && (
           <button
             onClick={async () => {
               if (confirm("Czy na pewno chcesz zakończyć tę rozmowę i zaliczyć zgłoszenie jako zakończone? Wtedy dopiero zostaną przyznane punkty.")) {
                 await fetch(`/api/conversations/${conversationId}/complete`, { method: "POST" });
                 window.location.reload();
               }
             }}
             className="px-3 py-1.5 bg-primary text-on-primary text-xs font-bold rounded-lg shadow-sm hover:bg-primary/90 active:scale-95 transition-transform"
           >
             Zakończ
           </button>
        )}
      </header>

      {/* Messages */}
      <main className="flex-1 pt-[72px] pb-[100px] px-4 overflow-y-auto">
        {/* Safety banner */}
        <section className="mt-2 mb-6">
          <Link
            href="/safety"
            className="bg-secondary-container/30 border border-secondary/20 rounded-xl p-3 flex items-start gap-3 hover:bg-secondary-container/50 transition-colors"
          >
            <span className="material-symbols-outlined text-on-secondary-container mt-0.5">
              security
            </span>
            <div className="flex-1">
              <p className="text-xs font-semibold text-on-secondary-container">
                Pamiętaj o zasadach bezpiecznego spotkania
              </p>
            </div>
            <span className="material-symbols-outlined text-on-secondary-container">
              chevron_right
            </span>
          </Link>
        </section>

        {/* Empty state */}
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <span className="material-symbols-outlined text-5xl text-on-surface-variant/40 mb-3">
              chat_bubble_outline
            </span>
            <p className="text-on-surface-variant font-medium">
              Napisz pierwszą wiadomość!
            </p>
          </div>
        )}

        {/* Message bubbles */}
        <div className="space-y-6">
          {messages.map((msg) => {
            const isOwn = msg.senderId === currentUserId;
            return (
              <div
                key={msg.id}
                className={`flex items-end gap-2 ${
                  isOwn ? "ml-auto max-w-[85%] justify-end" : "max-w-[85%]"
                }`}
              >
                <div
                  className={`p-4 shadow-sm ${
                    isOwn
                      ? "bg-primary rounded-[1.5rem_1.5rem_0.25rem_1.5rem]"
                      : "bg-surface-container-high rounded-[1.5rem_1.5rem_1.5rem_0.25rem] border border-outline-variant/10"
                  }`}
                >
                  <p
                    className={`text-sm leading-relaxed ${
                      isOwn ? "text-on-primary" : "text-on-surface"
                    }`}
                  >
                    {msg.body}
                  </p>
                  <p
                    className={`text-[10px] mt-1 ${
                      isOwn ? "text-on-primary/60" : "text-on-surface-variant/60"
                    }`}
                  >
                    {new Date(msg.createdAt).toLocaleTimeString("pl-PL", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-[#f5f5dd]/95 backdrop-blur-md px-4 pb-8 pt-4 w-full max-w-[390px] md:max-w-full border-t border-outline-variant/20 mx-auto right-0">
        {conversation?.request?.status === "COMPLETED" ? (
          <div className="w-full text-center p-3 bg-surface-container-high rounded-xl border border-outline-variant/20 text-on-surface-variant text-sm font-bold shadow-inner">
            <span className="material-symbols-outlined align-middle mr-2 text-primary">done_all</span>
            Rozmowa archiwalna (Zakończona)
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-surface-container-highest/60 rounded-[28px] px-4 py-1.5 flex items-center gap-2 border border-outline-variant/20">
              <input
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 placeholder:text-on-surface-variant/50 outline-none"
                placeholder="Napisz wiadomość..."
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={sending || !input.trim()}
              className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg active:scale-90 duration-200 disabled:opacity-50 disabled:active:scale-100"
            >
              <span
                className="material-symbols-outlined"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                send
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
