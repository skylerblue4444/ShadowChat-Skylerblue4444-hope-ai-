import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, Search, Filter, Star, TrendingUp, Plus, ShoppingCart } from "lucide-react";
import { trpc } from "@/lib/trpc";
const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2 }).format(n);
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MARKETPLACE_ITEMS = [
  { id: "n1", name: "Shadow Genesis #001", price: 4.44, currency: "ETH", image: "🌑", rarity: "Legendary", creator: "ShadowArtist", seller: "0xSKY4444", category: "Art", likes: 444, views: 4444, sales: 12, rating: 4.9 },
  { id: "n2", name: "HOPE AI Oracle", price: 2.88, currency: "ETH", image: "🔮", rarity: "Epic", creator: "HopeDAO", seller: "0xHOPE444", category: "AI", likes: 288, views: 2888, sales: 8, rating: 4.8 },
  { id: "n3", name: "Quantum Void #444", price: 1.44, currency: "ETH", image: "✨", rarity: "Rare", creator: "QuantumMint", seller: "0xQUANTUM", category: "Abstract", likes: 144, views: 1444, sales: 5, rating: 4.6 },
  { id: "n4", name: "Neon Shadow #888", price: 0.88, currency: "ETH", image: "🌊", rarity: "Uncommon", creator: "NeonArt", seller: "0xNEON888", category: "Digital", likes: 88, views: 888, sales: 3, rating: 4.4 },
  { id: "n5", name: "Dark Matter #777", price: 3.33, currency: "ETH", image: "🌌", rarity: "Legendary", creator: "DarkMatter", seller: "0xDARK777", category: "Space", likes: 333, views: 3333, sales: 10, rating: 4.7 },
  { id: "n6", name: "Cyber Phoenix #222", price: 1.11, currency: "ETH", image: "🦅", rarity: "Rare", creator: "CyberArt", seller: "0xCYBER222", category: "Cyber", likes: 222, views: 2222, sales: 6, rating: 4.5 },
];


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
