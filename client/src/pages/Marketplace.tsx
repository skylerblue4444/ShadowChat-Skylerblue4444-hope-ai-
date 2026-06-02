import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Filter, Star, TrendingUp, Plus, ShoppingCart } from "lucide-react";
import { MARKETPLACE_ITEMS, formatCurrency } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const CATS = ["All", "Digital Goods", "Luxury", "SaaS", "AI Tools", "Security", "Analytics"];

export default function Marketplace() {
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState("All");
  const [cart, setCart] = useState<string[]>([]);
  const filtered = MARKETPLACE_ITEMS.filter(i =>
    (cat === "All" || i.category === cat) &&
    (i.name.toLowerCase().includes(search.toLowerCase()) || i.category.toLowerCase().includes(search.toLowerCase()))
  );
  return (
    <div className="p-5 max-w-[1400px] space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-white" style={{fontFamily:"Syne,sans-serif"}}>Marketplace</h1>
          <p className="text-[11px] text-white/40">Amazon × Shopify × Web3 Commerce · $8.4M daily volume</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] hover:bg-cyan-500/30 transition-colors">
            <Plus className="w-3.5 h-3.5"/> List Item
          </button>
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-white/40"/>
            {cart.length > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-cyan-500 text-[9px] text-white flex items-center justify-center font-bold">{cart.length}</span>}
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search marketplace..." className="w-full bg-white/[0.05] border border-white/[0.08] rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-500/40"/>
        </div>
      </div>
      <div className="flex gap-2 flex-wrap">
        {CATS.map(c=>(
          <button key={c} onClick={()=>setCat(c)} className={cn("px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all border", cat===c?"bg-cyan-500/20 border-cyan-500/30 text-cyan-400":"bg-white/[0.03] border-white/[0.07] text-white/40 hover:border-white/[0.15]")}>{c}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item,i)=>(
          <motion.div key={item.id} initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{delay:i*0.05}}
            className="rounded-xl border border-white/[0.07] bg-[oklch(0.11_0.01_265)] overflow-hidden hover:border-white/[0.15] transition-all group">
            <div className="h-32 bg-gradient-to-br from-white/[0.04] to-white/[0.01] flex items-center justify-center text-5xl border-b border-white/[0.06]">
              {item.image}
            </div>
            <div className="p-4">
              <div className="flex items-start justify-between mb-1">
                <h3 className="text-[13px] font-semibold text-white">{item.name}</h3>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.06] text-white/40 border border-white/[0.06]">{item.category}</span>
              </div>
              <div className="text-[11px] text-white/40 mb-3">by {item.seller} · {item.sales.toLocaleString()} sold</div>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({length:5}).map((_,i)=>(
                  <Star key={i} className={cn("w-3 h-3", i < Math.floor(item.rating) ? "text-amber-400 fill-amber-400" : "text-white/20")}/>
                ))}
                <span className="text-[10px] text-white/40 ml-1">{item.rating}</span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-lg font-bold text-white font-mono">{item.price}</div>
                  <div className="text-[10px] text-cyan-400">{item.currency}</div>
                </div>
                <button onClick={()=>{setCart(p=>[...p,item.id]);toast.success(`${item.name} added to cart!`);}}
                  className="px-3 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 text-[11px] font-semibold hover:bg-cyan-500/30 transition-colors">
                  Add to Cart
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
