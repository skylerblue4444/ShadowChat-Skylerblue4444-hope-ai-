import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, X, Star, MapPin, Zap, Brain, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const PROFILES = [
  {id:"d1",name:"Alex Rivera",age:28,bio:"Crypto trader & AI enthusiast. SKYCOIN whale 🐋",match:98,traits:["DeFi","AI","Travel"],distance:"2mi",verified:true,color:"from-cyan-500 to-blue-600"},
  {id:"d2",name:"Maya Chen",age:26,bio:"Web3 developer. Building the future one block at a time.",match:94,traits:["Web3","Music","Art"],distance:"5mi",verified:true,color:"from-purple-500 to-pink-600"},
  {id:"d3",name:"Jordan Wells",age:31,bio:"Startup founder. HOPE AI believer. Digital nomad.",match:91,traits:["Startup","Tech","Yoga"],distance:"1mi",verified:false,color:"from-green-500 to-teal-600"},
  {id:"d4",name:"Zara Knight",age:29,bio:"NFT artist & governance voter. DAO maxi.",match:87,traits:["NFT","DAO","Art"],distance:"8mi",verified:true,color:"from-amber-500 to-orange-600"},
];

export default function Dating() {
  const [idx, setIdx] = useState(0);
  const [matches, setMatches] = useState<typeof PROFILES>([]);
  const [dir, setDir] = useState<"left"|"right"|null>(null);
  const profile = PROFILES[idx % PROFILES.length];

  const swipe = (direction: "left"|"right") => {
    setDir(direction);
    setTimeout(()=>{
      if(direction==="right"){
        setMatches(p=>[...p,profile]);
        toast.success(`🎉 Matched with ${profile.name}! (${profile.match}% compatibility)`);
      }
      setIdx(p=>p+1);
      setDir(null);
    },300);
  };

  return (
    <div className="p-5 max-w-[900px] mx-auto space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Dating & Matching</h1>
          <p className="text-[11px] text-white/40">AI Tinder × Behavioral Matching Engine · 847 matches today</p>
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-red-400">
          <Heart className="w-4 h-4 fill-red-400"/> {matches.length} matches
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Card stack */}
        <div className="lg:col-span-2 flex flex-col items-center gap-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={profile.id}
              initial={{opacity:0,scale:0.95,x:dir==="left"?-100:dir==="right"?100:0}}
              animate={{opacity:1,scale:1,x:0}}
              exit={{opacity:0,scale:0.95,x:dir==="left"?-200:200,rotate:dir==="left"?-15:15}}
              transition={{duration:0.25,ease:[0.23,1,0.32,1]}}
              className="w-full max-w-sm"
            >
              <div className="rounded-2xl overflow-hidden border border-white/[0.1] bg-[oklch(0.11_0.01_265)]">
                <div className={cn("h-64 bg-gradient-to-br flex items-end p-4", profile.color)}>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-white">{profile.name}</span>
                      <span className="text-white/80 text-lg">{profile.age}</span>
                    </div>
                    <div className="flex items-center gap-2 text-white/80 text-[12px]">
                      <MapPin className="w-3 h-3"/> {profile.distance}
                    </div>
                  </div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Brain className="w-4 h-4 text-cyan-400"/>
                      <span className="text-[12px] text-white font-semibold">AI Match Score</span>
                    </div>
                    <span className="text-xl font-bold text-cyan-400 font-mono">{profile.match}%</span>
                  </div>
                  <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full" style={{width:`${profile.match}%`}}/>
                  </div>
                  <p className="text-[12px] text-white/70">{profile.bio}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {profile.traits.map(t=>(
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60">{t}</span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
          <div className="flex gap-4">
            <button onClick={()=>swipe("left")} className="w-14 h-14 rounded-full border-2 border-red-500/40 bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors">
              <X className="w-6 h-6"/>
            </button>
            <button onClick={()=>swipe("right")} className="w-14 h-14 rounded-full border-2 border-green-500/40 bg-green-500/10 text-green-400 flex items-center justify-center hover:bg-green-500/20 transition-colors">
              <Heart className="w-6 h-6"/>
            </button>
          </div>
        </div>
        {/* Matches */}
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-[13px] font-semibold text-white mb-3">Your Matches ({matches.length})</h3>
          {matches.length === 0 ? (
            <div className="text-center py-8 text-white/30 text-[12px]">Start swiping to see matches here</div>
          ) : (
            <div className="space-y-2">
              {matches.map(m=>(
                <div key={m.id} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-white/[0.03] hover:bg-white/[0.06] transition-colors cursor-pointer">
                  <div className={cn("w-9 h-9 rounded-full bg-gradient-to-br flex items-center justify-center text-sm font-bold text-white shrink-0", m.color)}>
                    {m.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[12px] font-semibold text-white">{m.name}</div>
                    <div className="text-[10px] text-cyan-400">{m.match}% match</div>
                  </div>
                  <MessageCircle className="w-4 h-4 text-white/30"/>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
