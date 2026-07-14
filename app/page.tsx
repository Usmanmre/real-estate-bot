"use client";

import { useEffect, useRef, useState } from "react";
import { Key, Send } from "lucide-react";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hi, I'm Emma. How can I help you with leasing, rentals, or property management today?",
    },
  ]);

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  const [sessionId] = useState(() => crypto.randomUUID());

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function sendMessage() {
    if (!message.trim() || loading) return;

    const userMessage = message;

    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);

    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMessage, sessionId }),
      });

      const data = await res.json();

      // Change this depending on your API response
      const assistantReply =
        data.answer ??
        data.response ??
        data.message ??
        "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: assistantReply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0A0B0D] text-[#F2EFE9] flex justify-center relative overflow-hidden">
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap");

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .msg-in {
          animation: fadeInUp 0.35s ease-out both;
        }

        @keyframes pulseDot {
          0%,
          80%,
          100% {
            opacity: 0.25;
            transform: scale(0.85);
          }
          40% {
            opacity: 1;
            transform: scale(1);
          }
        }
        .dot {
          animation: pulseDot 1.3s infinite ease-in-out;
        }
        .dot:nth-child(2) {
          animation-delay: 0.15s;
        }
        .dot:nth-child(3) {
          animation-delay: 0.3s;
        }

        @keyframes statusGlow {
          0%,
          100% {
            box-shadow: 0 0 0 0 rgba(201, 166, 103, 0.5);
          }
          50% {
            box-shadow: 0 0 0 4px rgba(201, 166, 103, 0);
          }
        }
        .status-dot {
          animation: statusGlow 2s infinite;
        }

        textarea::placeholder {
          color: #6b6f76;
        }
      `}</style>

      {/* Ambient brass glow */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-96 w-[42rem] rounded-full bg-[#C9A667]/8 blur-[140px]" />

      <div className="flex flex-col h-screen w-full max-w-5xl relative z-10">
        {/* Header */}
        <header className="bg-[#0A0B0D]/85 backdrop-blur">
          <div className="h-20 px-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg border border-[#C9A667]/40 bg-gradient-to-br from-[#1C1F24] to-[#0A0B0D] flex items-center justify-center text-[#C9A667]">
                <Key size={20} strokeWidth={1.75} />
              </div>

              <div>
                <h1
                  className="text-xl leading-tight"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  Emma
                </h1>
                <p className="text-[11px] uppercase tracking-[0.2em] text-[#8B8F97]">
                  AI Leasing Specialist
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs text-[#8B8F97]">
              <span className="status-dot h-1.5 w-1.5 rounded-full bg-[#C9A667]" />
              <span style={{ fontFamily: "JetBrains Mono, monospace" }}>
                Online now
              </span>
            </div>
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-[#C9A667]/40 to-transparent" />
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-8">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg, index) =>
              msg.role === "assistant" ? (
                <div key={index} className="msg-in flex gap-3">
                  <div
                    className="h-9 w-9 shrink-0 rounded-md border border-[#C9A667]/30 bg-[#15171B] flex items-center justify-center text-[#C9A667] text-sm"
                    style={{ fontFamily: "Fraunces, serif" }}
                  >
                    E
                  </div>

                  <div className="bg-[#15171B]/90 border border-[#2A2D33] rounded-2xl rounded-tl-sm px-5 py-3.5 shadow-[0_4px_24px_rgba(0,0,0,0.35)] max-w-[85%] text-[15px] leading-relaxed text-[#EDEAE3]">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div key={index} className="msg-in flex justify-end">
                  <div className="bg-gradient-to-br from-[#D9B67A] to-[#A8874F] text-[#1A1508] rounded-2xl rounded-br-sm px-5 py-3.5 max-w-[85%] text-[15px] leading-relaxed font-medium shadow-[0_4px_20px_rgba(201,166,103,0.2)]">
                    {msg.content}
                  </div>
                </div>
              )
            )}

            {loading && (
              <div className="msg-in flex gap-3">
                <div
                  className="h-9 w-9 shrink-0 rounded-md border border-[#C9A667]/30 bg-[#15171B] flex items-center justify-center text-[#C9A667] text-sm"
                  style={{ fontFamily: "Fraunces, serif" }}
                >
                  E
                </div>

                <div className="bg-[#15171B]/90 border border-[#2A2D33] rounded-2xl rounded-tl-sm px-5 py-4 flex items-center gap-1.5">
                  <span className="dot h-1.5 w-1.5 rounded-full bg-[#C9A667]" />
                  <span className="dot h-1.5 w-1.5 rounded-full bg-[#C9A667]" />
                  <span className="dot h-1.5 w-1.5 rounded-full bg-[#C9A667]" />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-[#0A0B0D]/90 backdrop-blur">
          <div className="h-px bg-gradient-to-r from-transparent via-[#2A2D33] to-transparent" />
          <div className="max-w-3xl mx-auto p-4">
            <div className="flex gap-3">
              <textarea
                rows={1}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ask about a listing, a lease, or a viewing..."
                className="flex-1 bg-[#15171B] border border-[#2A2D33] rounded-xl px-4 py-3 resize-none outline-none text-[#F2EFE9] focus:border-[#C9A667]/60 focus:ring-1 focus:ring-[#C9A667]/25 transition-colors"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />

              <button
                disabled={loading}
                onClick={sendMessage}
                className="h-12 w-12 rounded-xl bg-gradient-to-br from-[#D9B67A] to-[#A8874F] text-[#1A1508] flex items-center justify-center transition-shadow hover:shadow-[0_0_20px_rgba(201,166,103,0.35)] disabled:opacity-40 disabled:hover:shadow-none"
              >
                <Send size={18} strokeWidth={2} />
              </button>
            </div>

            <p
              className="text-center text-[11px] text-[#6B6F76] mt-3 tracking-wide"
              style={{ fontFamily: "JetBrains Mono, monospace" }}
            >
              AI can make mistakes. Please verify important information.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}