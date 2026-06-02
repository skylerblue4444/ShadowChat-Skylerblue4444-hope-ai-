import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/store";
import {
  LayoutDashboard, MessageSquare, Heart, Video, ShoppingBag,
  Wallet, Brain, User, Bell, Shield, Compass, FlaskConical,
  BarChart3, Network, Vote, Clapperboard, Bot, Lock,
  CreditCard, Settings, Cpu, Server, Zap, GitBranch,
  Database, Workflow, AlertTriangle, Globe, Navigation, Flag,
  ChevronLeft, ChevronRight, Menu, X, Activity, Coins
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const NAV = [
  { section: "CORE", items: [
    { path: "/",              icon: LayoutDashboard, label: "Mission Control", badge: "LIVE", badgeType: "green" },
    { path: "/feed",          icon: MessageSquare,   label: "Social Feed" },
    { path: "/explore",       icon: Compass,         label: "Explore" },
    { path: "/notifications", icon: Bell,            label: "Notifications", badgeType: "count" },
  ]},
  { section: "SOCIAL & MEDIA", items: [
    { path: "/dating",         icon: Heart,          label: "Dating / Match" },
    { path: "/messages",       icon: Video,          label: "Messaging" },
    { path: "/creator-studio", icon: Clapperboard,   label: "Creator Studio" },
    { path: "/nft",            icon: Network,        label: "NFT Gallery" },
  ]},
  { section: "COMMERCE & FINANCE", items: [
    { path: "/marketplace",   icon: ShoppingBag,     label: "Marketplace" },
    { path: "/wallet",        icon: Wallet,          label: "Wallet / Finance" },
    { path: "/exchange",      icon: CreditCard,      label: "Exchange / DEX" },
  ]},
  { section: "AI & INTELLIGENCE", items: [
    { path: "/ai-core",           icon: Brain,       label: "HOPE AI Core",     badge: "AI",  badgeType: "cyan" },
    { path: "/ai-agents",         icon: Bot,         label: "AI Agent Market" },
    { path: "/digital-twin",      icon: Cpu,         label: "Digital Twin" },
    { path: "/ai-agents",         icon: GitBranch,   label: "AI Orchestration" },
  ]},
  { section: "ANALYTICS & DATA", items: [
    { path: "/analytics",   icon: BarChart3,         label: "Analytics Hub" },
    { path: "/leaderboard", icon: Database,          label: "Leaderboard" },
  ]},
  { section: "GOVERNANCE", items: [
    { path: "/governance",  icon: Vote,              label: "Governance / DAO" },
    { path: "/profile",     icon: User,              label: "Profile" },
    { path: "/security",    icon: Lock,              label: "Security Center" },
    { path: "/reputation",  icon: Activity,          label: "Reputation" },
    { path: "/referrals",   icon: Coins,             label: "Referrals" },
  ]},
  { section: "INFRASTRUCTURE", items: [
    { path: "/events",        icon: Server,          label: "Events & Spaces" },
    { path: "/subscriptions", icon: Zap,             label: "Subscriptions" },
    { path: "/moderation",    icon: AlertTriangle,   label: "Moderation Layer" },
    { path: "/api-ecosystem", icon: Globe,           label: "API Ecosystem" },
  ]},
  { section: "SYSTEM", items: [
    { path: "/admin",         icon: Shield,          label: "Admin Panel",      badge: "ROOT", badgeType: "red" },
    { path: "/settings",      icon: Settings,        label: "Settings" },
    { path: "/navigation",    icon: Navigation,      label: "Navigation System" },
    { path: "/feature-flags", icon: Flag,            label: "Feature Flags" },
  ]},
];

const BADGE_STYLES: Record<string, string> = {
  green:  "bg-green-500/20 text-green-400 border-green-500/30",
  cyan:   "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  red:    "bg-red-500/20 text-red-400 border-red-500/30",
  gold:   "bg-amber-500/20 text-amber-400 border-amber-500/30",
  count:  "bg-orange-500/20 text-orange-400 border-orange-500/30",
};

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { sidebarCollapsed, setSidebarCollapsed, unreadCount, currentUser, systemStatus, aiMode } = useAppStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [liveStats, setLiveStats] = useState(systemStatus);

  // Simulate live system stats
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveStats(prev => ({
        ...prev,
        activeUsers: prev.activeUsers + Math.floor((Math.random() - 0.4) * 10),
        txPerSecond: Math.floor(4000 + Math.random() * 800),
        feedLatency: Math.floor(8 + Math.random() * 10),
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ─────────────────────────────────────────────────── */}
      <aside className={cn(
        "fixed lg:relative z-50 h-full flex flex-col transition-all duration-300 ease-out",
        "bg-[oklch(0.09_0.01_265)] border-r border-white/[0.07]",
        sidebarCollapsed ? "w-[52px]" : "w-[220px]",
        mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Logo */}
        <div className={cn(
          "flex items-center gap-2.5 px-3 py-3.5 border-b border-white/[0.07] shrink-0",
          sidebarCollapsed && "justify-center"
        )}>
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-700 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <Brain className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-green-400 border border-background animate-pulse" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <div className="text-sm font-bold text-white leading-none" style={{ fontFamily: 'Syne, sans-serif' }}>
                ShadowChat
              </div>
              <div className="text-[9px] text-cyan-400 tracking-[0.2em] font-mono mt-0.5">ULTIMATE v70</div>
            </div>
          )}
        </div>

        {/* Live mini stats bar */}
        {!sidebarCollapsed && (
          <div className="px-3 py-2 border-b border-white/[0.07] grid grid-cols-3 gap-1">
            {[
              { label: 'USERS', val: `${(liveStats.activeUsers/1000).toFixed(1)}K` },
              { label: 'TPS', val: liveStats.txPerSecond },
              { label: 'AI', val: `${aiMode.health}%` },
            ].map(s => (
              <div key={s.label} className="text-center">
                <div className="text-[10px] font-mono text-cyan-400">{s.val}</div>
                <div className="text-[8px] text-muted-foreground tracking-wider">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-1.5 space-y-3">
          {NAV.map(({ section, items }) => (
            <div key={section}>
              {!sidebarCollapsed && (
                <div className="px-2 mb-1 text-[8px] font-semibold tracking-[0.15em] text-white/30 uppercase">
                  {section}
                </div>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const active = location === item.path;
                  const badge = item.badgeType === 'count' ? (unreadCount > 0 ? String(unreadCount) : null) : item.badge;
                  return (
                    <Link key={item.path} href={item.path} onClick={() => setMobileOpen(false)}>
                      <div className={cn(
                        "flex items-center gap-2 px-2 py-1.5 rounded-md text-[13px] transition-all duration-150 cursor-pointer group relative",
                        active
                          ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                          : "text-white/50 hover:text-white/80 hover:bg-white/5"
                      )} title={sidebarCollapsed ? item.label : undefined}>
                        {active && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3.5 bg-cyan-400 rounded-r" />}
                        <item.icon className={cn("w-3.5 h-3.5 shrink-0", active && "text-cyan-400")} />
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1 truncate">{item.label}</span>
                            {badge && (
                              <span className={cn("text-[8px] px-1.5 py-0.5 rounded border font-mono font-bold", BADGE_STYLES[item.badgeType || 'cyan'])}>
                                {badge}
                              </span>
                            )}
                          </>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User + collapse */}
        <div className="border-t border-white/[0.07] p-2 space-y-1">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2 px-2 py-1.5 rounded-md bg-white/5">
              <div className="w-6 h-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                {currentUser.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[11px] font-semibold text-white truncate">{currentUser.name}</div>
                <div className="text-[9px] text-cyan-400 font-mono">{currentUser.role.toUpperCase()}</div>
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="hidden lg:flex w-full items-center justify-center gap-1.5 px-2 py-1.5 rounded-md text-white/30 hover:text-white/60 hover:bg-white/5 transition-colors text-[11px]"
          >
            {sidebarCollapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <><ChevronLeft className="w-3.5 h-3.5" /><span>Collapse</span></>}
          </button>
        </div>
      </aside>

      {/* ── Main ────────────────────────────────────────────────────── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-11 border-b border-white/[0.07] flex items-center gap-3 px-4 shrink-0 bg-[oklch(0.09_0.01_265)]/80 backdrop-blur-sm">
          <button className="lg:hidden p-1.5 rounded-md hover:bg-white/10 text-white/50" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Activity className="w-3.5 h-3.5 text-green-400 shrink-0" />
            <span className="text-[11px] text-white/40 font-mono truncate">
              HOPE AI × ShadowChat × SKYCOIN4444 — All Systems Operational
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <div className="hidden sm:flex items-center gap-1 text-[10px] font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
              <Coins className="w-3 h-3" />
              4,444,444 SKY
            </div>
            <div className="text-[9px] px-1.5 py-0.5 rounded border font-mono bg-green-500/10 text-green-400 border-green-500/20">
              {systemStatus.uptime}% UP
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
