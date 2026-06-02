import { useState } from "react";
import { motion } from "framer-motion";
import { Vote, CheckCircle2, XCircle, Clock, Users, TrendingUp, Plus } from "lucide-react";
import { GOVERNANCE_PROPOSALS } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Governance() {
  const [voted, setVoted] = useState<Record<string,string>>({});
  const vote = (id:string, choice:"yes"|"no") => {
    if(voted[id]) return;
    setVoted(p=>({...p,[id]:choice}));
    toast.success(`Vote cast: ${choice.toUpperCase()} on Proposal #${id.replace("p","")}`);
  };
  return (
    <div className="p-5 max-w-[1000px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Governance / DAO</h1>
          <p className="text-[11px] text-white/40">Token-holder democracy · Proposal system · Community decisions</p>
        </div>
        <button onClick={()=>toast.info("Proposal creation coming soon!")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">
          <Plus className="w-3.5 h-3.5"/> New Proposal
        </button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          {label:"Total Proposals",value:"47",icon:Vote,color:"cyan"},
          {label:"Voting Power",value:"4.44M",icon:TrendingUp,color:"gold"},
          {label:"Quorum",value:"75K SKY",icon:Users,color:"purple"},
        ].map(s=>(
          <div key={s.label} className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
            <div className="text-[10px] text-white/40 mb-2">{s.label}</div>
            <div className="text-2xl font-bold text-white font-mono">{s.value}</div>
          </div>
        ))}
      </div>
      <div className="space-y-4">
        {GOVERNANCE_PROPOSALS.map((p,i)=>{
          const total = p.votes.yes + p.votes.no;
          const yesPct = Math.round((p.votes.yes/total)*100);
          const noPct = 100-yesPct;
          const myVote = voted[p.id];
          return (
            <motion.div key={p.id} initial={{opacity:0,y:10}} animate={{opacity:1,y:0}} transition={{delay:i*0.07}}
              className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-mono text-white/30">#{p.id.replace("p","")}</span>
                    <span className={cn("text-[9px] px-2 py-0.5 rounded border font-mono uppercase",
                      p.status==="active"?"bg-green-500/10 text-green-400 border-green-500/20":
                      p.status==="passed"?"bg-cyan-500/10 text-cyan-400 border-cyan-500/20":
                      "bg-red-500/10 text-red-400 border-red-500/20"
                    )}>{p.status}</span>
                  </div>
                  <h3 className="text-[14px] font-semibold text-white">{p.title}</h3>
                  <div className="text-[11px] text-white/40 mt-0.5">Proposed by {p.proposer} · Ends: {p.ends}</div>
                </div>
              </div>
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-green-400">YES — {p.votes.yes.toLocaleString()} ({yesPct}%)</span>
                  <span className="text-red-400">NO — {p.votes.no.toLocaleString()} ({noPct}%)</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden flex">
                  <div className="h-full bg-green-500 transition-all duration-700" style={{width:`${yesPct}%`}}/>
                  <div className="h-full bg-red-500 transition-all duration-700" style={{width:`${noPct}%`}}/>
                </div>
                <div className="text-[10px] text-white/30">Quorum: {p.quorum.toLocaleString()} SKY required</div>
              </div>
              {p.status==="active" && (
                <div className="flex gap-2">
                  <button onClick={()=>vote(p.id,"yes")} disabled={!!myVote}
                    className={cn("flex-1 py-2 rounded-lg border text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5",
                      myVote==="yes"?"bg-green-500/20 border-green-500/30 text-green-400":
                      myVote?"opacity-40 cursor-not-allowed bg-white/[0.03] border-white/[0.07] text-white/30":
                      "bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500/20")}>
                    <CheckCircle2 className="w-3.5 h-3.5"/> Vote YES
                  </button>
                  <button onClick={()=>vote(p.id,"no")} disabled={!!myVote}
                    className={cn("flex-1 py-2 rounded-lg border text-[12px] font-semibold transition-all flex items-center justify-center gap-1.5",
                      myVote==="no"?"bg-red-500/20 border-red-500/30 text-red-400":
                      myVote?"opacity-40 cursor-not-allowed bg-white/[0.03] border-white/[0.07] text-white/30":
                      "bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500/20")}>
                    <XCircle className="w-3.5 h-3.5"/> Vote NO
                  </button>
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
