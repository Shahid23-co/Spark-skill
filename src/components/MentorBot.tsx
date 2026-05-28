import { useState, useRef, useEffect } from "react";
import { MessageSquare, Send, X, Bot, Sparkles, User, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "mentor";
  timestamp: Date;
}

export default function MentorBot({ activeCareerPath }: { activeCareerPath?: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      text: "Yo! 🌟 I'm Sparky, your AI Mentor. Let me help you master CapCut, design high-CTR thumbnails, write code, or claim freelance gigs! Pitch me a question below!",
      sender: "mentor",
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll inside chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsgText = input;
    const userMsg: Message = {
      id: Date.now().toString(),
      text: userMsgText,
      sender: "user",
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/ai/mentor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          chatHistory: messages.slice(-8).map(m => ({ sender: m.sender, text: m.text })),
          currentPath: activeCareerPath,
        })
      });

      if (!response.ok) {
        throw new Error("Mentor response failed");
      }

      const data = await response.json();
      const mentorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: data.reply || "I'm deep in my neural network right now. Spark me again!",
        sender: "mentor",
        timestamp: new Date()
      };

      setMessages((prev) => [...prev, mentorMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          text: "Ah! My connection surged! 🔌 Try matching your secret key under Settings > Secrets, or ask me again in a bit!",
          sender: "mentor",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-24 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: 50 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-[340px] h-[460px] bg-[#0A0A0B] border border-cyan-500/25 rounded-3xl shadow-2xl shadow-cyan-500/5 flex flex-col overflow-hidden backdrop-blur-xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-cyan-500 to-purple-600 p-4.5 flex items-center justify-between border-b border-light-white/10">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 bg-black/40 rounded-xl text-cyan-300">
                  <Bot className="w-5 h-5 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-display font-semibold text-white text-sm tracking-tight flex items-center gap-1.5">
                    Sparky Mentor <Sparkles className="w-3.5 h-3.5 text-cyan-300 fill-cyan-400/20" />
                  </h3>
                  <p className="text-[10px] text-cyan-150 text-cyan-200">Online & ready to teach</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 hover:bg-white/10 rounded-lg text-white/80 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "mentor" && (
                    <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs shrink-0 mt-1">
                      🤖
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-tr-none shadow-md font-display"
                        : "bg-[#050505] text-[#ECECEF] rounded-tl-none border border-white/5"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-2 justify-start">
                  <div className="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-300 flex items-center justify-center text-xs shrink-0 mt-1 animate-pulse">
                    🤖
                  </div>
                  <div className="bg-[#050505] text-neutral-400 text-[10px] rounded-2xl px-3.5 py-2.5 flex items-center gap-1.5 animate-pulse border border-white/5">
                    <Zap className="w-3 h-3 text-cyan-400 animate-spin" /> Sparky is outlining a response...
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Footer Form */}
            <div className="p-3 border-t border-white/5 bg-[#050505] flex gap-2">
              <input
                type="text"
                placeholder="Ask about editing, coding, pricing..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1 bg-[#0A0A0B] rounded-xl px-3.5 py-2 text-xs text-white border border-[#1C1C1E] focus:outline-none focus:border-cyan-400 placeholder-neutral-500 transition-colors"
               />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-gradient-to-r from-cyan-400 to-purple-600 text-white rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center shrink-0 cursor-pointer"
              >
                <Send className="w-4 h-4 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Spark Launcher Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-gradient-to-r from-cyan-400 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-cyan-500/25 cursor-pointer border border-[#22D3EE]/30"
      >
        {isOpen ? (
          <X className="w-6 h-6 text-white" />
        ) : (
          <MessageSquare className="w-6 h-6 font-bold text-white" />
        )}
        <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 border-2 border-[#050505] rounded-full animate-ping" />
        <div className="absolute top-0 right-0 w-3.5 h-3.5 bg-purple-500 border-2 border-[#050505] rounded-full font-bold text-[8px] text-white flex items-center justify-center shrink-0">
          !
        </div>
      </motion.button>
    </div>
  );
}
