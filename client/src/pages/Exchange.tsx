import { useState, useEffect } from "react";
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, ArrowLeftRight, Zap, BarChart3 } from "lucide-react";
import { TOKENS, formatCurrency, generateSparkline } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CHART_DATA = Array.from({length:60},(_,i)=>({
  t:i,
  price:44444+Math.sin(i*0.3)*2000+Math.cos(i*0.1)*1000+Math.random()*500,
}));
const ORDERBOOK_BIDS = Array.from({length:8},(_,i)=>({price:44000-i*50,size:(Math.random()*10).toFixed(2),total:(Math.random()*100).toFixed(2)}));
const ORDERBOOK_ASKS = Array.from({length:8},(_,i)=>({price:44100+i*50,size:(Math.random()*10).toFixed(2),total:(Math.random()*100).toFixed(2)}));

export default function Exchange() {
  const [pair, setPair] = useState("SKYCOIN/USDT");
  const [side, setSide] = useState<"buy"|"sell">("buy");
  const [orderType, setOrderType] = useState<"market"|"limit">("limit");
  const [amount, setAmount] = useState("");
  const [price, setPrice] = useState("44444");
  const [price24h] = useState(44444);
  const [change] = useState(+11.2);
  const isUp = change >= 0;
  return (
    <div className="p-4 max-w-[1400px] space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Exchange</h1>
          <p className="text-[11px] text-white/40">Binance-grade DEX · Order book · Real-time charts</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-bold text-white font-mono">${price24h.toLocaleString()}</span>
          <span className={cn("text-[12px] font-mono flex items-center gap-1",isUp?"text-green-400":"text-red-400")}>
            {isUp?<TrendingUp className="w-3.5 h-3.5"/>:<TrendingDown className="w-3.5 h-3.5"/>}
            {isUp?"+":""}{change}%
          </span>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Chart */}
        <div className="lg:col-span-3 rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <div className="flex items-center gap-3 mb-4">
            {["1m","5m","15m","1h","4h","1D","1W"].map(tf=>(
              <button key={tf} className="text-[10px] text-white/40 hover:text-white/70 px-2 py-1 rounded hover:bg-white/[0.06] transition-colors font-mono">{tf}</button>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={CHART_DATA}>
              <defs>
                <linearGradient id="exchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isUp?"#22d3ee":"#ef4444"} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={isUp?"#22d3ee":"#ef4444"} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="t" hide/>
              <YAxis domain={["auto","auto"]} tick={{fill:"#ffffff40",fontSize:10}} axisLine={false} tickLine={false} tickFormatter={v=>`$${(v/1000).toFixed(1)}K`}/>
              <Tooltip contentStyle={{background:"#0d0d1a",border:"1px solid #ffffff15",borderRadius:8,fontSize:11}} formatter={(v:any)=>[`$${Number(v).toFixed(2)}`,"Price"]}/>
              <Area type="monotone" dataKey="price" stroke={isUp?"#22d3ee":"#ef4444"} fill="url(#exchGrad)" strokeWidth={1.5} dot={false}/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
        {/* Order panel */}
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4 space-y-3">
          <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04]">
            <button onClick={()=>setSide("buy")} className={cn("flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all",side==="buy"?"bg-green-500/20 text-green-400":"text-white/40")}>Buy</button>
            <button onClick={()=>setSide("sell")} className={cn("flex-1 py-1.5 rounded-md text-[11px] font-semibold transition-all",side==="sell"?"bg-red-500/20 text-red-400":"text-white/40")}>Sell</button>
          </div>
          <div className="flex gap-1 p-1 rounded-lg bg-white/[0.04]">
            {["market","limit"].map(t=>(
              <button key={t} onClick={()=>setOrderType(t as any)} className={cn("flex-1 py-1 rounded-md text-[10px] font-medium transition-all capitalize",orderType===t?"bg-white/[0.08] text-white":"text-white/30")}>{t}</button>
            ))}
          </div>
          {orderType==="limit"&&(
            <div>
              <label className="text-[10px] text-white/40 mb-1 block">Price (USDT)</label>
              <input value={price} onChange={e=>setPrice(e.target.value)} className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-cyan-500/40 font-mono"/>
            </div>
          )}
          <div>
            <label className="text-[10px] text-white/40 mb-1 block">Amount (SKYCOIN)</label>
            <input value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00" className="w-full bg-white/[0.05] border border-white/[0.08] rounded-lg px-3 py-2 text-[12px] text-white outline-none focus:border-cyan-500/40 font-mono"/>
          </div>
          <div className="grid grid-cols-4 gap-1">
            {["25%","50%","75%","100%"].map(p=>(
              <button key={p} onClick={()=>setAmount((parseFloat(p)/100*1000).toFixed(2))} className="py-1 rounded text-[10px] text-white/40 bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-colors">{p}</button>
            ))}
          </div>
          {amount&&price&&(
            <div className="text-[11px] text-white/40">
              Total: <span className="text-white font-mono">${(parseFloat(amount)*parseFloat(price)).toLocaleString()}</span>
            </div>
          )}
          <button
            onClick={()=>{toast.success(`${side.toUpperCase()} order placed: ${amount} SKYCOIN @ $${price}`);setAmount("");}}
            disabled={!amount}
            className={cn("w-full py-2.5 rounded-lg border text-[12px] font-bold transition-all disabled:opacity-40",
              side==="buy"?"bg-green-500/20 border-green-500/30 text-green-400 hover:bg-green-500/30":"bg-red-500/20 border-red-500/30 text-red-400 hover:bg-red-500/30")}>
            {side==="buy"?"Buy":"Sell"} SKYCOIN
          </button>
        </div>
      </div>
      {/* Order book */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden">
          <div className="px-4 py-2.5 border-b border-white/[0.06] grid grid-cols-3 text-[10px] text-white/30 font-medium">
            <span>Price</span><span className="text-center">Size</span><span className="text-right">Total</span>
          </div>
          {ORDERBOOK_ASKS.slice().reverse().map((o,i)=>(
            <div key={i} className="grid grid-cols-3 px-4 py-1.5 text-[11px] hover:bg-red-500/5 transition-colors relative">
              <div className="absolute inset-0 right-0 bg-red-500/5" style={{width:`${Math.random()*60+20}%`,right:0,left:"auto"}}/>
              <span className="text-red-400 font-mono relative z-10">${parseFloat(o.price.toString()).toLocaleString()}</span>
              <span className="text-center text-white/60 font-mono relative z-10">{o.size}</span>
              <span className="text-right text-white/40 font-mono relative z-10">{o.total}</span>
            </div>
          ))}
          <div className="px-4 py-2 border-y border-white/[0.06] bg-white/[0.02]">
            <span className="text-[14px] font-bold text-green-400 font-mono">${price24h.toLocaleString()}</span>
            <span className="text-[10px] text-white/30 ml-2">Spread: 0.02%</span>
          </div>
          {ORDERBOOK_BIDS.map((o,i)=>(
            <div key={i} className="grid grid-cols-3 px-4 py-1.5 text-[11px] hover:bg-green-500/5 transition-colors relative">
              <div className="absolute inset-0 bg-green-500/5" style={{width:`${Math.random()*60+20}%`}}/>
              <span className="text-green-400 font-mono relative z-10">${parseFloat(o.price.toString()).toLocaleString()}</span>
              <span className="text-center text-white/60 font-mono relative z-10">{o.size}</span>
              <span className="text-right text-white/40 font-mono relative z-10">{o.total}</span>
            </div>
          ))}
        </div>
        <div className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] p-4">
          <h3 className="text-[13px] font-semibold text-white mb-3">Token Pairs</h3>
          <div className="space-y-2">
            {TOKENS.map(t=>{
              const up = t.change>=0;
              return (
                <div key={t.symbol} onClick={()=>setPair(`${t.symbol}/USDT`)} className={cn("flex items-center justify-between p-2.5 rounded-lg cursor-pointer transition-all",pair===`${t.symbol}/USDT`?"bg-cyan-500/10 border border-cyan-500/20":"hover:bg-white/[0.04] border border-transparent")}>
                  <span className="text-[12px] font-semibold text-white">{t.symbol}/USDT</span>
                  <div className="text-right">
                    <div className="text-[11px] font-mono text-white">${t.price>=1000?(t.price/1000).toFixed(2)+"K":t.price.toFixed(2)}</div>
                    <div className={cn("text-[10px] font-mono",up?"text-green-400":"text-red-400")}>{up?"+":""}{t.change}%</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
