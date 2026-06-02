import { useState } from "react";
import { Bot, Play, Pause, TrendingUp, Plus, Zap, Star, DollarSign } from "lucide-react";
import { AI_AGENTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AGENT_TEMPLATES = [
  {name:"TradeMaster Pro",type:"Trading",price:999,icon:"📈",desc:"Auto-trades based on HOPE AI signals with 94% accuracy"},
  {name:"ContentGenius",type:"Social",price:299,icon:"✍️",desc:"Auto-generates and posts viral content 24/7"},
  {name:"MarketScout",type:"Research",price:199,icon:"🔍",desc:"Monitors 1000+ data sources for alpha signals"},
  {name:"SecurityGuard",type:"Security",price:0,icon:"🛡️",desc:"Protects your account from threats in real-time"},
  {name:"SocialOptimizer",type:"Growth",price:499,icon:"🚀",desc:"Grows your following using behavioral graph analysis"},
  {name:"ArbitrageBot",type:"Trading",price:1499,icon:"⚡",desc:"Cross-exchange arbitrage with 0.1% fee optimization"},
];

export default function AIAgentMarket() {
  const [agents, setAgents] = useState(AI_AGENTS);
  const toggleAgent = (id:string) => {
    setAgents(p=>p.map(a=>a.id===id?{...a,status:a.status==="running"?"idle":"running"}:a));
    const a = agents.find(a=>a.id===id);
    toast.success(`Agent ${a?.name} ${a?.status==="running"?"paused":"started"}!`);
  };
  return (
    <div className="p-5 max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>AI Agent Marketplace</h1>
          <p className="text-[11px] text-white/40">App Store for AI Workers · Deploy, manage, and monetize agents</p>
        </div>
        <button onClick={()=>toast.info("Agent builder coming soon!")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">
          <Plus className="w-3.5 h-3.5"/> Create Agent
        </button>
      </div>
      <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
        <h3 className="text-[13px] font-semibold text-white mb-4">Your Active Agents</h3>
        <div className="space-y-3">
          {agents.map(a=>(
            <div key={a.id} className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-all">
              <div className="text-2xl">{a.icon}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-[12px] font-semibold text-white">{a.name}</span>
                  <span className={cn("text-[9px] px-1.5 py-0.5 rounded border font-mono",a.status==="running"?"bg-green-500/10 text-green-400 border-green-500/20":"bg-white/[0.06] text-white/30 border-white/[0.08]")}>{a.status}</span>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-white/40">
                  <span>{a.tasks.toLocaleString()} tasks</span>
                  <span>{a.accuracy}% accuracy</span>
                  {a.earnings>0&&<span className="text-green-400">+${a.earnings.toLocaleString()} earned</span>}
                </div>
              </div>
              <button onClick={()=>toggleAgent(a.id)} className={cn("p-2 rounded-lg border transition-all",a.status==="running"?"bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20":"bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20")}>
                {a.status==="running"?<Pause className="w-4 h-4"/>:<Play className="w-4 h-4"/>}
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <h3 className="text-[13px] font-semibold text-white mb-3">Agent Marketplace</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {AGENT_TEMPLATES.map(t=>(
            <div key={t.name} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 hover:border-white/[0.15] transition-all">
              <div className="text-3xl mb-3">{t.icon}</div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[13px] font-semibold text-white">{t.name}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">{t.type}</span>
              </div>
              <p className="text-[11px] text-white/50 mb-3">{t.desc}</p>
              <div className="flex items-center justify-between">
                <span className="text-[13px] font-bold text-white font-mono">{t.price===0?"FREE":`${t.price} USDT`}</span>
                <button onClick={()=>toast.success(`${t.name} deployed!`)} className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">Deploy</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
