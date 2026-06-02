import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Send, Sparkles, Bot, Zap, Shield, Navigation, BookOpen, Loader2, User, Cpu, Activity, BarChart3, Settings } from "lucide-react";
import { useAppStore } from "@/store";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Streamdown } from "streamdown";

const MODES = [
  { id: "learn",    icon: BookOpen,    label: "Learn Mode",    desc: "Deep knowledge synthesis & pattern learning", color: "#22d3ee" },
  { id: "navigate", icon: Navigation,  label: "Navigate Mode", desc: "Real-time guidance & decision routing",        color: "#8b5cf6" },
  { id: "scan",     icon: Activity,    label: "Scan Mode",     desc: "Continuous environment monitoring",           color: "#f59e0b" },
  { id: "guard",    icon: Shield,      label: "Guard Mode",    desc: "Threat detection & system protection",        color: "#10b981" },
] as const;

const SUGGESTED = [
  "Analyze SKYCOIN4444 market trends",
  "Generate a trading strategy for BTC",
  "Summarize today's governance proposals",
  "What's my digital twin predicting?",
  "Optimize my social feed algorithm",
  "Scan for security threats",
];

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const HOPE_RESPONSES: Record<string, string> = {
  default: `**HOPE AI Analysis Complete** 🧠

I've processed your request through the multi-agent orchestration layer.

**Key Insights:**
- Real-time behavioral modeling indicates a **94.2% confidence** pattern match
- Digital twin simulation projects **3 probable outcomes** in the next 24h
- Current market conditions show **bullish momentum** across SKYCOIN4444

**Recommended Actions:**
1. Increase SKYCOIN staking position by 15%
2. Monitor governance proposal #44 — high impact expected
3. Social graph influence score: **9,820** (top 0.1%)

*HOPE AI is running 14 background tasks. Memory utilization: 68%. All systems nominal.*`,
};

export default function AICore() {
  const { aiMode, setAIMode } = useAppStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: `**HOPE AI Online** — Multi-Agent Orchestration System v70 🧠\n\nI'm your AI operating system. I coordinate trading intelligence, social graph analysis, behavioral modeling, security monitoring, and decision routing across all ShadowChat modules.\n\n**Current Status:**\n- Mode: **NAVIGATE** — Real-time guidance active\n- Agents running: **14**\n- Memory: **68%** utilized\n- Uptime: **99.97%**\n\nHow can I assist you today?`,
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"chat" | "agents" | "memory" | "settings">("chat");
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    setMessages(p => [...p, { role: "user", content: msg, timestamp: new Date() }]);
    setLoading(true);
    await new Promise(r => setTimeout(r, 1200 + Math.random() * 800));
    setMessages(p => [...p, {
      role: "assistant",
      content: HOPE_RESPONSES.default,
      timestamp: new Date(),
    }]);
    setLoading(false);
  };

  return (
    <div className="flex h-[calc(100vh-44px)] overflow-hidden">
      {/* Left panel */}
      <div className="w-64 shrink-0 border-r border-white/[0.07] bg-[oklch(0.09_0.01_265)] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/[0.07]">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: 'Syne, sans-serif' }}>HOPE AI</span>
          </div>
          <div className="text-[10px] text-white/30 font-mono">Multi-Agent Orchestration v70</div>
        </div>

        {/* Mode selector */}
        <div className="p-3 border-b border-white/[0.07]">
          <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Operating Mode</div>
          <div className="space-y-1">
            {MODES.map(mode => (
              <button
                key={mode.id}
                onClick={() => { setAIMode(mode.id); toast.success(`HOPE AI: Switched to ${mode.label}`); }}
                className={cn(
                  "w-full flex items-center gap-2 px-2.5 py-2 rounded-lg text-left transition-all",
                  aiMode.active === mode.id
                    ? "bg-white/[0.08] border border-white/[0.12]"
                    : "hover:bg-white/[0.04] border border-transparent"
                )}
              >
                <mode.icon className="w-3.5 h-3.5 shrink-0" style={{ color: mode.color }} />
                <div className="min-w-0">
                  <div className="text-[11px] font-medium text-white">{mode.label}</div>
                  <div className="text-[9px] text-white/30 truncate">{mode.desc}</div>
                </div>
                {aiMode.active === mode.id && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full animate-pulse shrink-0" style={{ background: mode.color }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="p-3 border-b border-white/[0.07]">
          <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">System Health</div>
          <div className="space-y-2">
            {[
              { label: "AI Health", value: aiMode.health, color: "#10b981" },
              { label: "Memory", value: aiMode.memoryUsed, color: "#8b5cf6" },
              { label: "Task Load", value: Math.min(100, aiMode.tasksRunning * 7), color: "#f59e0b" },
            ].map(s => (
              <div key={s.label}>
                <div className="flex justify-between text-[10px] mb-1">
                  <span className="text-white/40">{s.label}</span>
                  <span className="font-mono" style={{ color: s.color }}>{s.value}%</span>
                </div>
                <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${s.value}%`, background: s.color }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-white/[0.07]">
          {(["chat", "agents", "memory", "settings"] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className={cn("flex-1 py-2 text-[10px] capitalize transition-colors", activeTab === t ? "text-cyan-400 border-b border-cyan-400" : "text-white/30 hover:text-white/50")}>
              {t}
            </button>
          ))}
        </div>

        {/* Suggested prompts */}
        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-[9px] text-white/30 uppercase tracking-widest mb-2">Quick Prompts</div>
          <div className="space-y-1">
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => sendMessage(s)}
                className="w-full text-left text-[10px] text-white/40 hover:text-white/70 px-2 py-1.5 rounded-lg hover:bg-white/[0.04] transition-colors leading-snug">
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Chat header */}
        <div className="h-11 border-b border-white/[0.07] flex items-center px-4 gap-3 shrink-0">
          <Sparkles className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">HOPE AI Chat</span>
          <span className="text-[10px] text-white/30">·</span>
          <span className="text-[10px] text-green-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            {aiMode.tasksRunning} agents active
          </span>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" ? "justify-end" : "justify-start")}
            >
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Brain className="w-3.5 h-3.5 text-cyan-400" />
                </div>
              )}
              <div className={cn(
                "max-w-[80%] rounded-xl px-4 py-2.5 text-sm",
                msg.role === "user"
                  ? "bg-cyan-500/20 text-white border border-cyan-500/20"
                  : "bg-white/[0.05] text-white/80 border border-white/[0.07]"
              )}>
                {msg.role === "assistant" ? (
                  <div className="prose prose-sm prose-invert max-w-none text-[13px] leading-relaxed">
                    <Streamdown>{msg.content}</Streamdown>
                  </div>
                ) : (
                  <p className="text-[13px]">{msg.content}</p>
                )}
                <div className="text-[9px] text-white/20 mt-1.5 text-right">
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
              {msg.role === "user" && (
                <div className="w-7 h-7 rounded-full bg-white/[0.08] flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-3.5 h-3.5 text-white/60" />
                </div>
              )}
            </motion.div>
          ))}
          {loading && (
            <div className="flex gap-3 items-start">
              <div className="w-7 h-7 rounded-full bg-cyan-500/20 flex items-center justify-center shrink-0">
                <Brain className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className="bg-white/[0.05] border border-white/[0.07] rounded-xl px-4 py-3">
                <div className="flex gap-1.5">
                  {[0, 1, 2].map(i => (
                    <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="border-t border-white/[0.07] p-4">
          <div className="flex gap-2 items-end">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask HOPE AI anything..."
              rows={1}
              className="flex-1 bg-white/[0.05] border border-white/[0.08] rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40 resize-none max-h-32"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || loading}
              className="p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </div>
          <div className="text-[10px] text-white/20 mt-1.5 text-center">
            HOPE AI · Multi-agent system · Press Enter to send
          </div>
        </div>
      </div>
    </div>
  );
}
