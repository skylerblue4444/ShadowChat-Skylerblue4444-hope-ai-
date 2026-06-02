import { useState } from "react";
import { Compass, TrendingUp, Users, Star, Search, Sparkles } from "lucide-react";
import { FEED_POSTS, MARKETPLACE_ITEMS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const TRENDING_TOPICS = ["#SKYCOIN4444","#HOPEAI","#ShadowChat","#DeFi","#AITrading","#DAO","#Web3","#NFT","#TRUMP","#Governance"];
const TOP_CREATORS = [
  {name:"Alex Rivera",handle:"@alexr",followers:"12.4K",score:98,color:"from-cyan-400 to-blue-600"},
  {name:"Maya Chen",handle:"@mayachain",followers:"8.9K",score:94,color:"from-purple-400 to-pink-600"},
  {name:"Zara Knight",handle:"@zaraknights",followers:"15.2K",score:97,color:"from-amber-400 to-orange-600"},
];

export default function Explore() {
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("Trending");
  const TABS = ["Trending","Creators","Marketplace","AI Picks"];
  return (
    <div className="p-5 max-w-[1200px] space-y-5">
      <div>
        <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Explore & Discovery</h1>
        <p className="text-[11px] text-white/40">AI-powered recommendations · Trending content · Top creators</p>
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"/>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search everything..." className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40"/>
      </div>
      <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04] border border-white/[0.06]">
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} className={cn("flex-1 py-1.5 rounded-md text-[11px] font-medium transition-all",tab===t?"bg-cyan-500/20 text-cyan-400 border border-cyan-500/20":"text-white/40 hover:text-white/60")}>{t}</button>
        ))}
      </div>
      {tab==="Trending" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <h3 className="text-[13px] font-semibold text-white mb-3 flex items-center gap-2"><TrendingUp className="w-4 h-4 text-orange-400"/> Trending Topics</h3>
            <div className="flex flex-wrap gap-2">
              {TRENDING_TOPICS.map((t,i)=>(
                <button key={t} onClick={()=>toast.info(`Exploring ${t}`)} className="px-3 py-1.5 rounded-full border border-white/[0.08] bg-white/[0.03] text-[11px] text-white/60 hover:text-cyan-400 hover:border-cyan-500/30 transition-colors">
                  {t} <span className="text-white/30 ml-1">{(Math.random()*100).toFixed(0)}K</span>
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <h3 className="text-[13px] font-semibold text-white mb-3 flex items-center gap-2"><Sparkles className="w-4 h-4 text-cyan-400"/> AI Picks for You</h3>
            <div className="space-y-3">
              {FEED_POSTS.slice(0,3).map(p=>(
                <div key={p.id} className="p-3 rounded-lg bg-white/[0.03] border border-white/[0.06] hover:border-white/[0.12] transition-colors cursor-pointer">
                  <div className="text-[11px] font-semibold text-white mb-1">{p.user}</div>
                  <p className="text-[11px] text-white/50 line-clamp-2">{p.content}</p>
                  <div className="text-[10px] text-cyan-400 mt-1">{p.likes.toLocaleString()} likes · {p.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab==="Creators" && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {TOP_CREATORS.map(c=>(
            <div key={c.name} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden hover:border-white/[0.15] transition-all">
              <div className={cn("h-20 bg-gradient-to-r",c.color)}/>
              <div className="p-4 -mt-6">
                <div className={cn("w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center text-lg font-bold text-white border-4 border-[oklch(0.11_0.01_265)] mb-3",c.color)}>{c.name[0]}</div>
                <div className="text-[13px] font-bold text-white">{c.name}</div>
                <div className="text-[11px] text-white/40">{c.handle}</div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[11px] text-white/50">{c.followers} followers</span>
                  <span className="text-[10px] text-cyan-400 font-mono">{c.score}% score</span>
                </div>
                <button onClick={()=>toast.success(`Following ${c.name}!`)} className="w-full mt-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">Follow</button>
              </div>
            </div>
          ))}
        </div>
      )}
      {["Marketplace","AI Picks"].includes(tab) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MARKETPLACE_ITEMS.slice(0,6).map(item=>(
            <div key={item.id} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 hover:border-white/[0.15] transition-all">
              <div className="text-4xl mb-3">{item.image}</div>
              <div className="text-[12px] font-semibold text-white">{item.name}</div>
              <div className="text-[10px] text-white/40 mt-0.5">{item.category}</div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[13px] font-bold text-white font-mono">{item.price} {item.currency}</span>
                <button onClick={()=>toast.success("Added to cart!")} className="px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[10px] hover:bg-cyan-500/30 transition-colors">Buy</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
