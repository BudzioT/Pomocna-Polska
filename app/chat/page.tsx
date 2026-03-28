"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { mockMessages, chatPartner, currentUser } from "@/lib/mockData";
import type { Message } from "@/types";

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [input, setInput] = useState("");

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: `m${Date.now()}`,
        senderId: currentUser.id,
        text,
        sentAt: new Date(),
      },
    ]);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSend();
  };

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
              {chatPartner.avatarUrl && (
                <Image
                  alt="User Avatar"
                  className="w-10 h-10 rounded-full border-2 border-primary/10"
                  src={chatPartner.avatarUrl}
                  width={40}
                  height={40}
                />
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-on-surface tracking-tight leading-tight">
                {chatPartner.name}
              </span>
              <div className="flex items-center gap-1">
                <span
                  className="material-symbols-outlined text-[14px] text-secondary"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  verified_user
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                  Trust Score: {chatPartner.trustScore}
                </span>
              </div>
            </div>
          </div>
        </div>
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

        {/* Message bubbles */}
        <div className="space-y-6">
          {messages.map((msg) => {
            const isOwn = msg.senderId === currentUser.id;
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
                    {msg.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {/* Input bar */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-[#FBFBE2]/95 backdrop-blur-md px-4 pb-8 pt-4 w-full max-w-[390px] md:max-w-full border-t border-outline-variant/20 mx-auto right-0">
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
            className="w-12 h-12 bg-primary text-on-primary rounded-full flex items-center justify-center shadow-lg active:scale-90 duration-200"
          >
            <span
              className="material-symbols-outlined"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              send
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
